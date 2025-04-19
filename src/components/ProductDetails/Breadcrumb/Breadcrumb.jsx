/********************************************************
 * frontend/src/components/ProductDetails/Breadcrumb/Breadcrumb.jsx
 ********************************************************/
import PropTypes from "prop-types";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";

const Breadcrumb = ({ category, brand, productName }) => {
  // Eğer category bir obje ise name'ini, değilse olduğu gibi string olarak al
  const categoryName =
    category && typeof category === "object" && category.name
      ? category.name
      : category;

  // Aynı mantığı brand için de uygulayabilirsin (eğer marka da obje geldiyse .name üzerinden)
  const brandName =
    brand && typeof brand === "object" && brand.name ? brand.name : brand;

  return (
    <div className="single-topbar">
      <nav className="breadcrumb">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {categoryName && <li>{categoryName}</li>}
          {brandName && <li>{brandName}</li>}
          <li>{productName}</li>
        </ul>
      </nav>
      <h1>{productName}</h1>
    </div>
  );
};

Breadcrumb.propTypes = {
  category: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ]),
  brand: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ]),
  productName: PropTypes.string.isRequired,
};

export default Breadcrumb;