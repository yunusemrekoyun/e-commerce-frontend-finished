/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Layout/Header/Header.jsx
 ********************************************************/
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "antd";
import CartContext from "../../../context/CartContext"; // sadece bu import kalmalı
import "./Header.css";

const { confirm } = Modal;

const Header = ({ setIsSearchShow }) => {
  const { cartItems } = useContext(CartContext);
  const { pathname } = useLocation();

  // Her render'da güncel token'ı oku
  const token = localStorage.getItem("token");

  // Menü açık/kapalı state'i
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Gerçek çıkış işlemi
  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  // AntD confirm modal ile sorma
  const showLogoutConfirm = () => {
    confirm({
      title: "Çıkış Yap",
      content: "Çıkış yapmak istediğinize emin misiniz?",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: doLogout,
    });
  };

  // 🔥 Toplam ürün adedi (çeşit değil, toplam)
  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <header>
      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            {/* Hamburger ikon */}
            <div className="header-mobile">
              <i className="bi bi-list" id="btn-menu" onClick={toggleMenu}></i>
            </div>

            {/* Logo */}
            <div className="header-left">
              <Link to="/" className="logo">
                ÜNKO Kozmetik
              </Link>
            </div>

            {/* Navigasyon */}
            <div
              className={`header-center ${isMenuOpen ? "open" : ""}`}
              id="sidebar"
            >
              <nav className="navigation">
                <ul className="menu-list">
                  <li>
                    <Link
                      to="/"
                      className={`menu-link ${
                        pathname === "/" ? "active" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ANA SAYFA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      className={`menu-link ${
                        pathname.startsWith("/shop") ? "active" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      MAĞAZA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className={`menu-link ${
                        pathname === "/blog" ? "active" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      HAKKIMIZDA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className={`menu-link ${
                        pathname === "/contact" ? "active" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İLETİŞİM
                    </Link>
                  </li>
                </ul>
              </nav>
              {/* Kapatma ikonu */}
              <i
                className="bi bi-x-circle"
                id="close-sidebar"
                onClick={() => setIsMenuOpen(false)}
              ></i>
            </div>

            {/* Sağ simgeler */}
            <div className="header-right">
              <div className="header-right-links">
                {/* Profil / Giriş */}
                <Link
                  to={token ? "/account" : "/auth"}
                  className="header-account"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-person"></i>
                </Link>

                {/* Arama butonu */}
                <button
                  className="search-button"
                  onClick={() => setIsSearchShow(true)}
                >
                  <i className="bi bi-search"></i>
                </button>

                {/* Sepet */}
                <div className="header-cart">
                  <Link
                    to="/cart"
                    className="header-cart-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="bi bi-bag"></i>
                    <span className="header-cart-count">{totalItems}</span>
                  </Link>
                </div>

                {/* Çıkış butonu */}
                {token && (
                  <button className="exit-button" onClick={showLogoutConfirm}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  setIsSearchShow: PropTypes.func,
};

export default Header;