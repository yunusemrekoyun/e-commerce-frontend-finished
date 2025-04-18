import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CartContext from "./CartContext"; // ✅ buradan alıyoruz artık

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
      const existingItem = prevCart.find((item) => item._id === newItem._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) =>
      prevCart.filter((cartItem) => cartItem._id !== itemId)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};

export default CartProvider;
