import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import PropTypes from "prop-types";
import "./Reviews.css";
import { useEffect, useState } from "react";
import { message } from "antd";

const Reviews = ({ active, singleProduct, setSingleProduct }) => {
  const [users, setUsers] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // GET /api/users => kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          message.error("Kullanıcı verileri alınamadı.");
        }
      } catch (error) {
        console.log("fetchUsers hata:", error);
      }
    };
    fetchUsers();
  }, [apiUrl]);

  // reviews dizisini güvenli şekilde al (null/undefined ise boş dizi)
  const reviews = singleProduct?.reviews || [];

  // "thisReview" => her review'a karşılık user eşleştirmesi
  const thisReview = [];
  reviews.forEach((review) => {
    const matchingUsers = users.filter((user) => user._id === review.user);
    matchingUsers.forEach((matchingUser) => {
      thisReview.push({
        review,
        user: matchingUser,
      });
    });
  });

  return (
    <div className={`tab-panel-reviews ${active}`}>
      {reviews.length > 0 ? (
        <>
          {/* Burada 2 reviews for ... yerine dynamic bir örnek */}
          <h3>
            {reviews.length} review
            {reviews.length > 1 ? "s" : ""} for{" "}
            {singleProduct?.name || "Product"}
          </h3>

          <div className="comments">
            <ol className="comment-list">
              {thisReview.map((item, index) => (
                <ReviewItem key={index} item={item} reviewItem={item} />
              ))}
            </ol>
          </div>
        </>
      ) : (
        <h3>Hiç yorum yok...</h3>
      )}

      <div className="review-form-wrapper">
        <h2>Add a review</h2>
        <ReviewForm
          singleProduct={singleProduct}
          setSingleProduct={setSingleProduct}
        />
      </div>
    </div>
  );
};

export default Reviews;

Reviews.propTypes = {
  active: PropTypes.string,
  singleProduct: PropTypes.object,
  setSingleProduct: PropTypes.func,
};
