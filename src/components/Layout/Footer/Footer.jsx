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
                    <a href="/">Anasayfa</a>
                  </li>
                  <li>
                    <a href="shop">Ürünlerimiz</a>
                  </li>
                  <li>
                    <a href="blog">Hakkımızda</a>
                  </li>
                  <li>
                    <a href="contact">İletişim</a>
                  </li>
                </ul>
              </div>
              <div className="brand-info">
                <div className="footer-logo">
                  <Link to={"/"} className="logo">
                    ÜNKO Kozmetik
                  </Link>
                </div>
                <div className="footer-desc">
                  <p>
                    {" "}
                    ÜNKO Kozmetik, güzelliğin doğallıkla buluştuğu yerdir.
                    Kaliteyi cildinize, güveni ruhunuza sunar.{" "}
                  </p>
                </div>
                <div className="footer-contact">
                  <p>
                    <a href="tel:+9005525395910">(+90)552 539 59 10</a> –{" "}
                    <a href="info@ünkokozmetik.com">info@ünkokozmetik.com</a>
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
                    <Link to="/policy#gizlilik">Gizlilik Politikası</Link>
                  </li>
                  <li className="list-item">
                    <Link to="/policy#kosullar">Şartlar ve Koşullar</Link>
                  </li>
                  <li className="list-item">
                    <Link to="/policy#iade">İade Politikası</Link>
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
