/********************************************************
 * /components/Products/ProductItem.jsx
 ********************************************************/
import PropTypes from "prop-types";
import { useState } from "react";
// import  CartContext  from "../../context/CartProvider";
import "./ProductItem.css";
import ProductDetailsModal from "../ProductDetails/ProductDetailsModal";

const ProductItem = ({ productItem }) => {
  // const { cartItems } = useContext(CartContext);

  // const filteredCart = cartItems.find(
  //   (cartItem) => cartItem._id === productItem._id
  // );

  const originalPrice = productItem.price.current;
  const discountPercentage = productItem.price.discount;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCardClick = () => {
    window.location.href = `/product/${productItem._id}`;
  };

  return (
    <>
      <div
        className="product-item glide__slide glide__slide--active"
        onClick={handleCardClick}
      >
        <div
          className="product-image"
          onClick={(e) => {
            e.stopPropagation(); // Kart yönlendirmesini engelle
            handleOpenModal();
          }}
        >
          <img src={productItem.img[0]} alt={productItem.name} />
        </div>

        <div className="product-info">
          <a href="#!" className="product-title">
            {productItem.name}
          </a>
          <ul className="product-star">
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-full"></i>
            </li>
          </ul>
          <div className="product-prices">
            <strong className="new-price">${discountedPrice.toFixed(2)}</strong>
            <span className="old-price">${originalPrice.toFixed(2)}</span>
          </div>
          <span className="product-discount">-{discountPercentage}%</span>
        </div>
      </div>

      <ProductDetailsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        singleProduct={productItem}
        setSingleProduct={() => {}}
      />
    </>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.object.isRequired,
};

export default ProductItem;
