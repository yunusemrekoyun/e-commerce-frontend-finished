/********************************************************
 * /src/components/ProductDetails/Tabs/Tabs.jsx
 ********************************************************/
import { useState } from "react";
import PropTypes from "prop-types";
import Reviews from "../../Reviews/Reviews";
import "./Tabs.css";

const Tabs = ({ singleProduct, setSingleProduct }) => {
  const [activeTab, setActiveTab] = useState("reviews");

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div className="single-tabs">
      <ul className="tab-list">
        <li>
          <a
            href="#"
            className={
              activeTab === "reviews" ? "tab-button active" : "tab-button"
            }
            onClick={(e) => handleTabClick(e, "reviews")}
          >
            Ürün Yorumları
          </a>
        </li>
      </ul>

      <div className="tab-panel">
        <Reviews
          active={activeTab === "reviews" ? "content active" : "content"}
          singleProduct={singleProduct}
          setSingleProduct={setSingleProduct}
        />
      </div>
    </div>
  );
};

Tabs.propTypes = {
  singleProduct: PropTypes.object,
  setSingleProduct: PropTypes.func,
};

export default Tabs;