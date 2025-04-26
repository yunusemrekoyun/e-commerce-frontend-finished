import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./CategoryItem.css";

const CategoryItem = ({ category, index }) => {
  const slug = category.name.toLowerCase().replace(/\s+/g, "-");
  const localImagePath = `/img/categories/${index + 1}.jpg`;

  return (
    <li className="category-item">
      <NavLink
        to={`/shop/${slug}`}
        className="category-link" // eğer özel bir stil vereceksen
      >
        <img
          src={localImagePath}
          alt={category.name}
          className="category-image"
          onError={(e) => (e.target.style.display = "none")}
        />
        <span className="category-title">{category.name}</span>
      </NavLink>
    </li>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.object,
  index: PropTypes.number,
};

export default CategoryItem;
