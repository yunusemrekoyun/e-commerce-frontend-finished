/********************************************************
/Applications/Works/kozmetik/frontend/src/components/Categories/CategoryItem.jsx
 ********************************************************/

import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./CategoryItem.css";

const CategoryItem = ({ category }) => {
  const slug = category.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <li className="category-item">
      <NavLink to={`/shop/${slug}`} className="category-link">
        <span className="category-title">{category.name}</span>
      </NavLink>
    </li>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoryItem;
