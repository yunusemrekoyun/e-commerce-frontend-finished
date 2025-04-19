import PropTypes from "prop-types";
import "./Info.css";
import { useContext, useEffect, useRef, useState } from "react";
import CartContext from "../../../context/CartContext";

const Info = ({ singleProduct, compact = false }) => {
  const quantityRef = useRef();
  const { addToCart } = useContext(CartContext);

  const originalPrice = singleProduct?.price?.current ?? 0;
  const discountPercentage = singleProduct?.price?.discount ?? 0;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const colors = Array.isArray(singleProduct?.colors) ? singleProduct.colors : [];
  const sizes = Array.isArray(singleProduct?.sizes) ? singleProduct.sizes : [];

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem(`selectedColor-${singleProduct?.id}`);
    const savedSize = localStorage.getItem(`selectedSize-${singleProduct?.id}`);

    if (savedColor) setSelectedColor(savedColor);
    if (savedSize) setSelectedSize(savedSize);
  }, [singleProduct?.id]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    let totalRating = 0;
    let totalReviews = 0;

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      if (review.rating) {
        totalRating += review.rating;
        totalReviews += 1;
      }
    }

    return totalReviews === 0 ? 0 : (totalRating / totalReviews).toFixed(1);
  };

  const averageRating = calculateAverageRating(singleProduct?.reviews);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <ul className="product-star">
        {[...Array(full)].map((_, i) => (
          <li key={`f-${i}`}>
            <i className="bi bi-star-fill"></i>
          </li>
        ))}
        {half && (
          <li key="half">
            <i className="bi bi-star-half"></i>
          </li>
        )}
        {[...Array(empty)].map((_, i) => (
          <li key={`e-${i}`}>
            <i className="bi bi-star"></i>
          </li>
        ))}
      </ul>
    );
  };

  const reviewsCount = singleProduct?.reviews?.length ?? 0;

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    localStorage.setItem(`selectedSize-${singleProduct?.id}`, size);
    setSizeError(false);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    localStorage.setItem(`selectedColor-${singleProduct?.id}`, color);
    setColorError(false);
  };

  const handleAddToCart = () => {
    let valid = true;

    if (colors.length > 0 && colors.some(color => color !== "0" && color !== "") && !selectedColor) {
      setColorError(true);
      valid = false;
    }

    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      valid = false;
    }

    if (!valid) return;

    addToCart({
      ...singleProduct,
      price: discountedPrice,
      quantity: parseInt(quantityRef.current.value, 10) || 1,
      ...(selectedColor && { selectedColor }),
      ...(selectedSize && { selectedSize }),
    });

    // Opsiyonel: seçimleri sıfırlamak istersen yorum satırlarını aç
    // localStorage.removeItem(`selectedColor-${singleProduct?.id}`);
    // localStorage.removeItem(`selectedSize-${singleProduct?.id}`);
  };

  return (
    <div className="product-info">
      <h1 className="product-title">{singleProduct?.name}</h1>

      {!compact && (
        <div className="product-review">
          {renderStars(averageRating)}
          <span>{reviewsCount} reviews</span>
        </div>
      )}

      <div className="product-price">
        <s className="old-price">${originalPrice.toFixed(2)}</s>
        <strong className="new-price">${discountedPrice.toFixed(2)}</strong>
      </div>

      <form className="variations-form">
        <div className="variations">
          {colors.length > 0 && colors.some(color => color !== "0" && color !== "") && (
            <div className="colors">
              <div className="colors-wrapper">
                {colors
                  .filter(color => color !== "0" && color !== "")
                  .map((color, idx) => (
                    <button
                      key={idx}
                      className={`color-button ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      type="button"
                    />
                  ))}
              </div>
              {colorError && <div className="error-message">Renk seçmek zorunludur.</div>}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="sizes">
              <div className="values-list">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => handleSizeChange(size)}
                    type="button"
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
              {sizeError && <div className="error-message">Boyut seçmek zorunludur.</div>}
            </div>
          )}

          <div className="cart-button">
            <input type="number" defaultValue="1" min="1" ref={quantityRef} />
            <button
              type="button"
              className="btn btn-lg btn-primary"
              onClick={handleAddToCart}
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
  compact: PropTypes.bool,
};

export default Info;