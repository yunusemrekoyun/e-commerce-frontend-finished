import { useContext } from "react";
import CartItem from "./CartItem";
import CartContext from "../../context/CartContext";

const CartTable = () => {
  const { cartItems } = useContext(CartContext);

  // Toplam fiyat hesaplama
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <table className="shop-table">
        <thead>
          <tr>
            <th className="product-thumbnail">&nbsp;</th>
            <th className="product-name">Ürün</th>
            <th className="product-price">Ürün Özellikleri</th>
            <th className="product-quantity">Fiyat</th>
            <th className="product-subtotal">Adet</th>
            <th className="product-options">Toplam Tutar</th></tr>
        </thead>
        <tbody className="cart-wrapper">
          {cartItems.map((item) => (
            <CartItem cartItem={item} key={item._id} />
          ))}
        </tbody>
      </table>


    </div>
  );
};

export default CartTable;