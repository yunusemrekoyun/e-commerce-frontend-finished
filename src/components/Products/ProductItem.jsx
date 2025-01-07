/********************************************************
 * /components/Products/ProductItem.jsx
 ********************************************************/
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartProvider";
import "./ProductItem.css";
import { Link } from "react-router-dom";
import ProductDetailsModal from "../ProductDetails/ProductDetailsModal";

const ProductItem = ({ productItem }) => {
  const { cartItems, addToCart } = useContext(CartContext);

  const filteredCart = cartItems.find(
    (cartItem) => cartItem._id === productItem._id
  );

  const originalPrice = productItem.price.current;
  const discountPercentage = productItem.price.discount;
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  // Modal görünürlük state
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Göz ikonuna tıklanınca modal aç
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  // Modal kapanınca
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="product-item glide__slide glide__slide--active">
        {/* Ürün görselleri */}
        <div className="product-image">
          <Link to={`/product/${productItem._id}`}>
            <img src={productItem.img[0]} alt="" className="img1" />
            <img src={productItem.img[1]} alt="" className="img2" />
          </Link>
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
              <i className="bi bi-star-half"></i>
            </li>
          </ul>
          <div className="product-prices">
            <strong className="new-price">${discountedPrice.toFixed(2)}</strong>
            <span className="old-price">${originalPrice.toFixed(2)}</span>
          </div>
          <span className="product-discount">
            -{productItem.price.discount}%
          </span>

          <div className="product-links">
            {/* Sepete ekle butonu */}
            <button
              className="add-to-cart"
              onClick={() =>
                addToCart({
                  ...productItem,
                  price: discountedPrice,
                })
              }
              disabled={filteredCart}
            >
              <i className="bi bi-basket-fill"></i>
            </button>

            <button>
              <i className="bi bi-heart-fill"></i>
            </button>

            {/* Göz ikonu: Modal açar */}
            <button className="product-link" onClick={handleOpenModal}>
              <i className="bi bi-eye-fill"></i>
            </button>

            <a href="#!">
              <i className="bi bi-share-fill"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Ürün Detay Modal */}
      <ProductDetailsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        singleProduct={productItem} 
        // => DİKKAT: normalde productItem'da full data (description, vs.) var mı?
        setSingleProduct={() => {}}
      />
    </>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.object.isRequired,
};

export default ProductItem;