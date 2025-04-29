import PropTypes from "prop-types";
import "./Info.css";
import { useContext, useRef, useState } from "react";
import CartContext from "../../../context/CartContext";

const Info = ({ singleProduct, compact = false }) => {
  const quantityRef = useRef();
  const { cartItems, addToCart } = useContext(CartContext);

  const originalPrice = singleProduct?.price?.current ?? 0;
  const discountPercentage = singleProduct?.price?.discount ?? 0;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const colors = Array.isArray(singleProduct?.colors)
    ? singleProduct.colors
    : [];
  const sizes = Array.isArray(singleProduct?.sizes) ? singleProduct.sizes : [];

  // Sepette varsa aynı ürünün varyantlarından ilkini al, yoksa boş bırak
  const existing =
    cartItems.find((item) => item._id === singleProduct?._id) || {};
  const [selectedColor, setSelectedColor] = useState(
    existing.selectedColor || ""
  );
  const [selectedSize, setSelectedSize] = useState(existing.selectedSize || "");
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  // Artık calculateAverageRating yok, DB'den gelen değeri kullanıyoruz
  const averageRating = singleProduct?.averageRating ?? 0;
  const reviewsCount = singleProduct?.reviews?.length ?? 0;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <ul className="product-star">
        {[...Array(full)].map((_, i) => (
          <li key={`f-${i}`}>
            <i className="bi bi-star-fill" />
          </li>
        ))}
        {half && (
          <li key="half">
            <i className="bi bi-star-half" />
          </li>
        )}
        {[...Array(empty)].map((_, i) => (
          <li key={`e-${i}`}>
            <i className="bi bi-star" />
          </li>
        ))}
      </ul>
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setColorError(false);
  };

  const handleAddToCart = () => {
    let valid = true;
    if (colors.length > 0 && !selectedColor) {
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
  };

  return (
    <div className="product-info">
      <h1 className="product-title">{singleProduct?.name}</h1>

      {!compact && (
        <div className="product-review">
          {renderStars(averageRating)}
          <span>
            {reviewsCount === 0 ? "Henüz yorum yok" : `${reviewsCount} Yorum`}
          </span>
        </div>
      )}

      <div className="product-price">
        <s className="old-price">₺{originalPrice.toFixed(2)}</s>
        <strong className="new-price">₺{discountedPrice.toFixed(2)}</strong>
      </div>

      {/* Yıldızların altında Ürün Bilgisi kısmı */}
      <div className="product-description">
        <p>{singleProduct?.description}</p>{" "}
        {/* Ürün açıklaması buraya gelecek */}
      </div>

      <form className="variations-form">
        <div className="variations">
          {colors.length > 0 && (
            <div className="colors">
              <div className="colors-wrapper">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`color-button ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
              {colorError && (
                <div className="error-message">Renk seçmek zorunludur.</div>
              )}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="sizes">
              <div className="values-list">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`size-button ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
              {sizeError && (
                <div className="error-message">Boyut seçmek zorunludur.</div>
              )}
            </div>
          )}

          <div className="cart-button">
            <input type="number" defaultValue="1" min="1" ref={quantityRef} />
            <button
              type="button"
              className="btn btn-lg btn-primary"
              onClick={handleAddToCart}
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

Info.propTypes = {
  singleProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.shape({
      current: PropTypes.number,
      discount: PropTypes.number,
    }),
    colors: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    reviews: PropTypes.array,
    averageRating: PropTypes.number,
    description: PropTypes.string, // Ürün açıklamasını da ekliyoruz
  }).isRequired,
  compact: PropTypes.bool,
};

export default Info;
