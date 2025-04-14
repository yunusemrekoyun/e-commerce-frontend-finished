import React from "react";
import Policy from "../Policy/Policy";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <React.Fragment>
      <Policy />
      <footer className="footer">
        <div className="widgets-row">
          <div className="container">
            <div className="footer-widgets">
              <div className="widget-nav-menu">
                <h4>Hızlı Erişim</h4>
                <ul className="menu-list">
                  <li>
                    <a href="#">Anasyfa</a>
                  </li>
                  <li>
                    <a href="#">Ürünlerimiz</a>
                  </li>
                  <li>
                    <a href="#">Hakkımızda</a>
                  </li>
                  <li>
                    <a href="#">İletişim</a>
                  </li>
                </ul>
              </div>
              <div className="brand-info">
                <div className="footer-logo">
                  <Link to={"/"} className="logo">
                    LOGO
                  </Link>
                </div>
                <div className="footer-desc">
                  <p>
                    {" "}
                    Quis ipsum suspendisse ultrices gravida. Risus commodo
                    viverra maecenas accumsan lacus vel facilisis in termapol.
                  </p>
                </div>
                <div className="footer-contact">
                  <p>
                    <a href="tel:555 555 55 55">(+800) 1234 5678 90</a> –{" "}
                    <a href="mailto:info@example.com">info@example.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-row">
          <div className="container">
            <div className="footer-copyright">
              <div className="site-copyright">
                <p>2025 ©️ Tüm hakları saklıdır.</p>
              </div>
              <a href="#">
                <img src="/img/footer/cards.png" alt="" />
              </a>
              <div className="footer-menu">
                <ul className="footer-menu-list">
                  <li className="list-item">
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li className="list-item">
                    <a href="#">Terms and Conditions</a>
                  </li>
                  <li className="list-item">
                    <a href="#">Returns Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
