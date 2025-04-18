/********************************************************
 * /src/components/ProductDetails/Info/Info.jsx
 ********************************************************/
import PropTypes from "prop-types";
import "./Info.css";
import { useContext, useRef } from "react";
import CartContext from "../../../context/CartContext";

const Info = ({ singleProduct }) => {
  const quantityRef = useRef();
  const { addToCart } = useContext(CartContext);

  // Guard + varsayılan değerler
  const originalPrice = singleProduct?.price?.current ?? 0;
  const discountPercentage = singleProduct?.price?.discount ?? 0;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const colors = Array.isArray(singleProduct?.colors)
    ? singleProduct.colors
    : [];
  const sizes = Array.isArray(singleProduct?.sizes) ? singleProduct.sizes : [];

  return (
    <div className="product-info">
      <h1 className="product-title">{singleProduct?.name}</h1>

      <div className="product-review">
        <ul className="product-star">
          {[...Array(4)].map((_, i) => (
            <li key={i}>
              <i className="bi bi-star-fill"></i>
            </li>
          ))}
          <li>
            <i className="bi bi-star-half"></i>
          </li>
        </ul>
        <span>{singleProduct?.reviews?.length ?? 0} reviews</span>
      </div>

      <div className="product-price">
        <s className="old-price">${originalPrice.toFixed(2)}</s>
        <strong className="new-price">${discountedPrice.toFixed(2)}</strong>
      </div>

      <div
        className="product-description"
        dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
      />

      <form className="variations-form">
        <div className="variations">
          <div className="colors">
            <div className="colors-wrapper">
              {colors.map((color, idx) => (
                <label
                  key={idx}
                  className="color-wrapper"
                  style={{ backgroundColor: `#${color}` }}
                >
                  <input type="radio" name="product-color" />
                </label>
              ))}
            </div>
          </div>

          <div className="values-list">
            {sizes.map((size, idx) => (
              <span key={idx}>{size.toUpperCase()}</span>
            ))}
          </div>

          <div className="cart-button">
            <input type="number" defaultValue="1" min="1" ref={quantityRef} />
            <button
              type="button"
              className="btn btn-lg btn-primary"
              onClick={() =>
                addToCart({
                  ...singleProduct,
                  price: discountedPrice,
                  quantity: parseInt(quantityRef.current.value, 10) || 1,
                })
              }
            >
              Add to cart
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

Info.propTypes = {
  singleProduct: PropTypes.object,
};

export default Info;
