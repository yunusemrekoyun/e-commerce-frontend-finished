/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Reviews/ReviewForm.jsx
 ********************************************************/
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";

const ReviewForm = ({ singleProduct, setSingleProduct }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Token çek
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const localRefresh = localStorage.getItem("refreshToken");
    if (localToken) setToken(localToken);
    if (localRefresh) setRefreshToken(localRefresh);
  }, []);

  // Bileşen açılınca /me
  useEffect(() => {
    if (!token) return;
    fetchUserInfo();
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        const newToken = await tryRefreshToken();
        if (newToken) {
          return fetchUserInfo();
        } else {
          message.error("Lütfen giriş yapın.");
        }
      } else if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        message.error("Kullanıcı bilgisi alınamadı.");
      }
    } catch (error) {
      console.log("fetchUserInfo error:", error);
    }
  };

  // refresh token
  const tryRefreshToken = async () => {
    if (!refreshToken) return null;
    try {
      const resp = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!resp.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return null;
      }
      const data = await resp.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      return data.token;
    } catch (err) {
      console.error("refresh error:", err);
      return null;
    }
  };

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

    const formData = {
      reviews: [
        ...singleProduct.reviews,
        {
          text: review,
          rating: parseInt(rating),
          user: userInfo.id,
        },
      ],
    };

    try {
      const res = await fetch(`${apiUrl}/api/products/${singleProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        const newToken = await tryRefreshToken();
        if (newToken) {
          // tekrar dene
          return handleSubmit(e);
        } else {
          return message.error("Oturum süresi dolmuş. Tekrar giriş yapın.");
        }
      }

      if (!res.ok) {
        return message.error("Bir şeyler yanlış gitti.");
      }

      const data = await res.json();
      setSingleProduct(data);
      setReview("");
      setRating(0);
      message.success("Yorum başarıyla eklendi.");
    } catch (error) {
      console.log(error);
      message.error("Bir şeyler yanlış gitti.");
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
          Your rating
          <span className="required">*</span>
        </label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <a
              href="#"
              key={star}
              className={`star ${rating === star && "active"}`}
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
          Your review
          <span className="required">*</span>
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
          comment.
          <span className="required">*</span>
        </label>
      </div>
      <div className="form-submit">
        <input type="submit" className="btn submit" />
      </div>
    </form>
  );
};

export default ReviewForm;

ReviewForm.propTypes = {
  singleProduct: PropTypes.object,
  setSingleProduct: PropTypes.func,
};
