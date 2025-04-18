/********************************************************
 * /Applications/Works/kozmetik/frontend/src/components/Reviews/ReviewForm.jsx
 ********************************************************/
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { fetchWithAuth } from "../Auth/fetchWithAuth";

const ReviewForm = ({ singleProduct }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res && res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch {
      // silent: kullanıcı girişli değilse burada sessizce fail et
    }
  }, [apiUrl]);

  // Sadece token varsa kullanıcı bilgisini getir
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
    }
  }, [fetchUserInfo]);

  const handleRatingChange = (e, newRating) => {
    e.preventDefault();
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      return message.warning("Yorum yapabilmek için giriş yapmalısınız!");
    }
    if (rating === 0) {
      return message.warning("Puan seçiniz!");
    }

    try {
      const res = await fetchWithAuth(
        `${apiUrl}/api/products/${singleProduct._id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: review,
            rating: parseInt(rating, 10),
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        return message.error(err.error || "Yorum eklenemedi.");
      }

      message.success(
        "Yorumunuz alındı, onaylandıktan sonra ürün sayfasında yayınlanacaktır."
      );
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("handleSubmit error:", error);
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <p className="comment-notes">
        Your email address will not be published. Required fields are marked
        <span className="required">*</span>
      </p>

      <div className="comment-form-rating">
        <label>
          Your rating<span className="required">*</span>
        </label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <a
              href="#!"
              key={star}
              className={`star ${rating === star ? "active" : ""}`}
              onClick={(e) => handleRatingChange(e, star)}
            >
              {[...Array(star)].map((_, i) => (
                <i className="bi bi-star-fill" key={i}></i>
              ))}
            </a>
          ))}
        </div>
      </div>

      <div className="comment-form-comment form-comment">
        <label htmlFor="comment">
          Your review<span className="required">*</span>
        </label>
        <textarea
          id="comment"
          cols="50"
          rows="10"
          onChange={(e) => setReview(e.target.value)}
          value={review}
          required
        ></textarea>
      </div>

      <div className="comment-form-cookies">
        <input id="cookies" type="checkbox" />
        <label htmlFor="cookies">
          Save my name, email, and website in this browser for the next time I
          comment.<span className="required">*</span>
        </label>
      </div>

      <div className="form-submit">
        <input type="submit" className="btn submit" />
      </div>
    </form>
  );
};

ReviewForm.propTypes = {
  singleProduct: PropTypes.object.isRequired,
};

export default ReviewForm;
