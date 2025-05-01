/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Cart/CartTable.jsx
 ********************************************************/
import { useContext } from "react";
import CartItem from "./CartItem";
import CartContext from "../../context/CartContext";

const CartTable = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <div>
      <table className="shop-table">
        {/* 6 sütunu SABİT uzunlukta tanımlıyoruz */}
        <colgroup>
          <col style={{ width: "90px" }} /> {/* resim */}
          <col style={{ width: "32%" }} /> {/* ürün adı */}
          <col style={{ width: "18%" }} /> {/* özellik */}
          <col style={{ width: "12%" }} /> {/* fiyat */}
          <col style={{ width: "120px" }} /> {/* adet (buton grubu) */}
          <col style={{ width: "14%" }} /> {/* toplam */}
        </colgroup>

        <thead>
          <tr>
            <th />
            <th>Ürün</th>
            <th>Ürün Özellikleri</th>
            <th>Fiyat</th>
            <th>Adet</th>
            <th>Toplam Tutar</th>
          </tr>
        </thead>

        <tbody>
          {cartItems.map((item) => (
            <CartItem key={item._id} cartItem={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
