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
      const existingItem = prevCart.find(
        (item) =>
          item._id === newItem._id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === newItem._id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item._id === itemToRemove._id &&
            (item.selectedColor || "") === (itemToRemove.selectedColor || "") &&
            (item.selectedSize || "") === (itemToRemove.selectedSize || "")
          )
      )
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
        updateCartItemQuantity,
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
