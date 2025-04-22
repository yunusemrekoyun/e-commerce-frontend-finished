/********************************************************
 * frontend/src/components/Reviews/Reviews.jsx
 ********************************************************/
import PropTypes from "prop-types";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import "./Reviews.css";

const Reviews = ({ active, singleProduct, setSingleProduct }) => {
  const reviews = singleProduct.reviews || [];

  return (
    <div className={`tab-panel-reviews ${active}`}>
      {reviews.length === 0 ? (
        <p className="no-comments">Henüz yorum yok...</p>
      ) : (
        <ul className="comment-list">
          {reviews.map((r) => (
            <ReviewItem reviewItem={r} key={r._id} />
          ))}
        </ul>
      )}

      <h1 className="add-review-title">Bu ürün hakkında yorum yapın.</h1>
      <ReviewForm
        singleProduct={singleProduct}
        setSingleProduct={setSingleProduct}
      />
    </div>
  );
};

Reviews.propTypes = {
  active: PropTypes.string.isRequired,
  singleProduct: PropTypes.shape({
    reviews: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setSingleProduct: PropTypes.func.isRequired,
};

export default Reviews;
