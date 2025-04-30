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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
                ÜNKO KOZMETİK
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
                  <li className="menu-list-item megamenu-wrapper">
                    <Link
                      to={"/shop"}
                      className={`menu-link ${
                        pathname === "/shop" ? "active" : ""
                      }`}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                      MAĞAZA
                      <i className="bi bi-chevron-down"></i>
                    </Link>
                    {isDropdownOpen && (
                      <div className="menu-dropdown-wrapper">
                        <div className="menu-dropdown-megamenu">
                          <div className="megamenu-links">
                          <div className="megamenu-products">
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Saç bakımı
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/saç-bakımı">Saç Bakımı</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-sekllenendiriciler">Saç Şekillendiriciler</a>
                                  <a href="/shop/sac-sekllenendiriciler">
                                    Saç Şekillendiriciler
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/sampuan">Şampuan</a>
                                </li>
                                <li>
                                  <a href="/shop/erkek-sac-bakimi">Erkek Saç Bakımı</a>
                                  <a href="/shop/erkek-sac-bakimi">
                                    Erkek Saç Bakımı
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/sac-boyalari">Saç Boyaları</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-acicilar">Saç Açıcılar</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-maskesi">Saç Maskesi</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-serumu">Saç Serumu</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-kremi">Saç Kremi</a>
                                </li>
                                <li>
<<<<<<< HEAD
                                  <a href="/shop/sac-bakim-yagi">Saç Bakım Yağı</a>
                                  <a href="/shop/sac-bakim-yagi">
                                    Saç Bakım Yağı
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/sac-spreyi">Saç Spreyi</a>
                                </li>
                              </ul>
                            </div>

                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Cilt Bakımı
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/yuz-maskesi">Yüz Maskesi</a>
                                </li>
                                <li>
                                  <a href="/shop/serumlar">Serumlar</a>
                                </li>
                              </ul>
                            </div>

                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                El ve Ayak Bakımı
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/el-ve-ayak-bakimi">El ve Ayak Bakımı</a>
                                  <a href="/shop/el-ve-ayak-bakimi">
                                    El ve Ayak Bakımı
                                  </a>
                                </li>
                              </ul>
                            </div>

                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Elektronik
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/sac-masalar">Saç Maşaları</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-duzlestiriciler">Saç Düzleştiriciler</a>
                                </li>
                                <li>
                                  <a href="/shop/sac-kesim-makinalari">Saç Kesim Makinaları</a>
                                </li>
                                <li>
                                  <a href="/shop/fon-makinalari">Fön Makinaları</a>
                                  <a href="/shop/sac-duzlestiriciler">
                                    Saç Düzleştiriciler
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/sac-kesim-makinalari">
                                    Saç Kesim Makinaları
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/fon-makinalari">
                                    Fön Makinaları
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

export default Header;export default Header;
