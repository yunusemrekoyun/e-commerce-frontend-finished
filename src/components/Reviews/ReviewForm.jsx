// /Applications/Works/kozmetik/frontend/src/components/Reviews/ReviewForm.jsx
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { message, Modal } from "antd";
import { fetchWithAuth } from "../Auth/fetchWithAuth";

const ReviewForm = ({ singleProduct }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      let res = await fetchWithAuth(`${apiUrl}/api/auth/me`);
      if (res.status === 401) return;
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch {
      // sessiz
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleRatingChange = (e, newRating) => {
    e.preventDefault();
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo)
      return message.warning("Yorum yapabilmek için giriş yapmalısınız!");
    if (rating === 0) return message.warning("Puan seçiniz!");
    if (!isAccepted)
      return message.warning(
        "Yorum yapabilmek için kuralları kabul etmelisiniz!"
      );

    try {
      const res = await fetchWithAuth(
        `${apiUrl}/api/products/${singleProduct._id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: review, rating }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Yorum eklenemedi.");
      }
      message.success("Yorumunuz alındı, onaylandıktan sonra yayınlanacaktır.");
      setReview("");
      setRating(0);
      setIsAccepted(false);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-rating">
          <label>
            Puanınız<span className="required">*</span>
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
                  <i className="bi bi-star-fill" key={i} />
                ))}
              </a>
            ))}
          </div>
        </div>

        <div className="comment-form-comment form-comment">
          <label htmlFor="comment">
            Yorumunuz<span className="required">*</span>
          </label>
          <textarea
            id="comment"
            rows={5}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>

        <div className="comment-form-cookies">
          <input
            type="checkbox"
            checked={isAccepted}
            onChange={() => setIsAccepted((p) => !p)}
          />
          <label>
            <span
              style={{
                color: "#1890ff",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setIsRulesModalVisible(true)}
            >
              Yorum yapma kurallarını
            </span>{" "}
            okudum, anladım ve kabul ediyorum<span className="required">*</span>
          </label>
        </div>

        <div className="form-submit">
          <input type="submit" className="btn submit" />
        </div>
      </form>

      {/* KURALLAR MODALI */}
      <Modal
        title={null}
        open={isRulesModalVisible}
        onCancel={() => setIsRulesModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{ padding: "32px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2
            style={{ fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}
          >
            Yorum Yapma Kuralları
          </h2>
          <p style={{ color: "#555", fontSize: "15px", margin: 0 }}>
            Platformumuzda paylaştığınız her yorum, topluluk kalitemizi
            artırmamıza yardımcı olur. Aşağıdaki kuralları kabul ederek yapıcı
            katkıda bulunabilirsiniz.
          </p>
        </div>

        <ul
          style={{
            paddingLeft: "1.5rem",
            fontSize: "15px",
            color: "#333",
            lineHeight: "1.8rem",
          }}
        >
          <li>
            <strong>Saygılı dil kullanımı:</strong> Küfür, argo, hakaret ve
            aşağılayıcı ifadeler kesinlikle yasaktır.
          </li>
          <li>
            <strong>Gerçek deneyim:</strong> Sadece gerçekten satın alıp
            deneyimlediğiniz ürünler hakkında yorum yapınız.
          </li>
          <li>
            <strong>Reklam yasağı:</strong> Yorumlarda telefon numarası, web
            sitesi ya da sosyal medya bilgisi paylaşmak yasaktır.
          </li>
          <li>
            <strong>Yinelenen yorumlar:</strong> Aynı içeriğe sahip tekrarlayan
            yorumlar yayınlanmaz.
          </li>
          <li>
            <strong>Spam içerik:</strong> İçerikle alakasız yorumlar ve link
            içeren paylaşımlar engellenir.
          </li>
          <li>
            <strong>Denetim süreci:</strong> Tüm yorumlar, kalite politikamız
            gereği kontrol edildikten sonra yayına alınır.
          </li>
        </ul>
      </Modal>
    </>
  );
};

ReviewForm.propTypes = {
  singleProduct: PropTypes.object.isRequired,
};

export default ReviewForm;
