/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Layout/Header/Header.jsx
 ********************************************************/

import { useContext, useState } from "react";
import Proptypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../../../context/CartProvider";
import "./Header.css";

const Header = ({ setIsSearchShow }) => {
  const { cartItems } = useContext(CartContext);
  const { pathname } = useLocation();

  const [token] = useState(localStorage.getItem("token") || "");

  // ✅ Menü açık mı?
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAdmin");
      window.location.href = "/";
    }
  };

  return (
    <header>
      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            {/* Hamburger ikon */}
            <div className="header-mobile">
              <i className="bi bi-list" id="btn-menu" onClick={toggleMenu}></i>
            </div>

            <div className="header-left">
              <Link to={"/"} className="logo">
                LOGO
              </Link>
            </div>

            {/* Menü içerik - responsive */}
            <div className={`header-center ${isMenuOpen ? "open" : ""}`} id="sidebar">
              <nav className="navigation">
                <ul className="menu-list">
                  <li>
                    <Link
                      to={"/"}
                      className={`menu-link ${pathname === "/" && "active"}`}
                      onClick={() => setIsMenuOpen(false)} // ✅ Menü kapansın
                    >
                      ANA SAYFA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/shop"}
                      className={`menu-link ${pathname === "/shop" && "active"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      MAĞAZA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/blog"}
                      className={`menu-link ${pathname === "/blog" && "active"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      HAKKIMIZDA
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/contact"}
                      className={`menu-link ${pathname === "/contact" && "active"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      İLETİŞİM
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Kapatma ikonu */}
              <i
                className="bi-x-circle"
                id="close-sidebar"
                onClick={() => setIsMenuOpen(false)}
              ></i>
            </div>

            {/* Sağ simgeler */}
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
                    to={"/cart"}
                    className="header-cart-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="bi bi-bag"></i>
                    <span className="header-cart-count">{cartItems.length}</span>
                  </Link>
                </div>
                {token && (
                  <button className="exit-button" onClick={handleLogout}>
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
  setIsSearchShow: Proptypes.func,
};

export default Header;