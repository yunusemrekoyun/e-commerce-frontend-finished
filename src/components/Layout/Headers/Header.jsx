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

  const token = localStorage.getItem("token");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

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

  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <header>
      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            <div className="header-mobile">
              <i className="bi bi-list" id="btn-menu" onClick={toggleMenu}></i>
            </div>

            <div className="header-left">
              <Link to="/" className="logo">
                ÜNKO KOZMETİK
              </Link>
            </div>

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

                  {/* MAĞAZA */}
                  <li
                    className="menu-list-item megamenu-wrapper"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link
                      to={"/shop"}
                      className={`menu-link ${
                        pathname === "/shop" ? "active" : ""
                      }`}
                    >
                      MAĞAZA
                      <i className="bi bi-chevron-down"></i>
                    </Link>
                    {isDropdownOpen && (
                      <div className="menu-dropdown-wrapper">
                        <div className="menu-dropdown-megamenu">
                          <div className="megamenu-links">
                            {/* Saç bakımı */}
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Saç bakımı
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/saç-bakımı">Saç Bakımı</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-şekillenendiriciler">
                                    Saç Şekillendiriciler
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/şampuan">Şampuan</a>
                                </li>
                                <li>
                                  <a href="/shop/erkek-saç-bakımı">
                                    Erkek Saç Bakımı
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/saç-boyaları">Saç Boyaları</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-açıcılar">Saç Açıcılar</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-maskesi">Saç Maskesi</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-serumu">Saç Serumu</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-kremi">Saç Kremi</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-bakım-yagı">
                                    Saç Bakım Yağı
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/saç-spreyi">Saç Spreyi</a>
                                </li>
                              </ul>
                            </div>

                            {/* Cilt Bakımı */}
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

                            {/* El ve Ayak Bakımı */}
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                El ve Ayak Bakımı
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/el-ve-ayak-bakımı">
                                    El ve Ayak Bakımı
                                  </a>
                                </li>
                              </ul>
                            </div>

                            {/* Elektronik */}
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Elektronik
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="/shop/sac-maşaları">Saç Maşaları</a>
                                </li>
                                <li>
                                  <a href="/shop/saç-duzlestiricisi">
                                    Saç Düzleştiriciler
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/saç-kesim-makinalari">
                                    Saç Kesim Makinaları
                                  </a>
                                </li>
                                <li>
                                  <a href="/shop/fön-makinalari">
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

              <i
                className="bi bi-x-circle"
                id="close-sidebar"
                onClick={() => setIsMenuOpen(false)}
              ></i>
            </div>

            <div className="header-right">
              <div className="header-right-links">
                <Link
                  to={token ? "/account" : "/auth"}
                  className="header-account"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-person"></i>
                </Link>

                <button
                  className="search-button"
                  onClick={() => setIsSearchShow(true)}
                >
                  <i className="bi bi-search"></i>
                </button>

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
