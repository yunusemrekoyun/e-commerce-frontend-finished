/********************************************************
 * frontend/src/components/Reviews/ReviewItem.jsx
 ********************************************************/
import PropTypes from "prop-types";

const ReviewItem = ({ reviewItem }) => {
  const { text, rating, user, createdAt } = reviewItem;
  const formattedDate = new Date(createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li className="comment-item">
      {/* <div className="comment-avatar">
        <img
          src={user.avatar}
          alt={user.username}
          width={60}
          height={60}
          style={{ borderRadius: "50%" }}
        />
      </div> */}
      <div className="comment-text">
        <ul className="comment-star">
          {Array.from({ length: rating }).map((_, i) => (
            <li key={i}>
              <i className="bi bi-star-fill"></i>
            </li>
          ))}
        </ul>
        <div className="comment-meta">
          <strong>{user.username}</strong> – <time>{formattedDate}</time>
        </div>
        <div className="comment-description">
          <p>{text}</p>
        </div>
      </div>
    </li>
  );
};

ReviewItem.propTypes = {
  reviewItem: PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string,
    rating: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.string,
    }),
    createdAt: PropTypes.string,
  }).isRequired,
};

export default ReviewItem;
