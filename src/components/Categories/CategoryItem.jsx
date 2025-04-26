/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Categories/CategoryItem.jsx
 ********************************************************/
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./CategoryItem.css";

const CategoryItem = ({ category }) => {
  return (
    <li className="category-item">
      {/* Eski <a href="#"> kaldır, yerine Link */}
      <Link to={`/shop?category=${encodeURIComponent(category.name)}`}>
        <img src={category.img} alt="" className="category-image" />
        <span className="category-title">{category.name}</span>
      </Link>
    </li>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.object,
};

export default CategoryItem;


