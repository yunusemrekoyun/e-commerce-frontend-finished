import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CartContext from "./CartContext";

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : []
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem) => {
    setCartItems((prevCart) => {
      // Aynı ürün, aynı renk ve boyda mı?
      const existingItem = prevCart.find(
        (item) =>
          item._id === newItem._id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize
      );
  
      if (existingItem) {
        // Aynı ürün var, sadece miktarını artır
        return prevCart.map((item) =>
          item._id === newItem._id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Farklı renk veya boyutta yeni ürün ekle
        return [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) =>
      prevCart.filter((cartItem) => cartItem._id !== itemId)
    );
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity, // ✅ BURAYA EKLENDİ
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};

export default CartProvider;