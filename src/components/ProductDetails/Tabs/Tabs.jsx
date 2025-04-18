/********************************************************
 * /src/components/ProductDetails/Tabs/Tabs.jsx
 ********************************************************/
import { useState } from "react";
import PropTypes from "prop-types";
import Reviews from "../../Reviews/Reviews";
import "./Tabs.css";

const Tabs = ({ singleProduct, setSingleProduct }) => {
  const [activeTab, setActiveTab] = useState("desc");
  const colors = Array.isArray(singleProduct?.colors)
    ? singleProduct.colors
    : [];
  const sizes = Array.isArray(singleProduct?.sizes) ? singleProduct.sizes : [];

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
              activeTab === "desc" ? "tab-button active" : "tab-button"
            }
            onClick={(e) => handleTabClick(e, "desc")}
          >
            Description
          </a>
        </li>
        <li>
          <a
            href="#"
            className={
              activeTab === "info" ? "tab-button active" : "tab-button"
            }
            onClick={(e) => handleTabClick(e, "info")}
          >
            Additional information
          </a>
        </li>
        <li>
          <a
            href="#"
            className={
              activeTab === "reviews" ? "tab-button active" : "tab-button"
            }
            onClick={(e) => handleTabClick(e, "reviews")}
          >
            Reviews
          </a>
        </li>
      </ul>

      <div className="tab-panel">
        <div className={activeTab === "desc" ? "content active" : "content"}>
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
          />
        </div>

        <div className={activeTab === "info" ? "content active" : "content"}>
          <h3>Additional information</h3>
          <table>
            <tbody>
              <tr>
                <th>Color</th>
                <td>{colors.join(", ") || "-"}</td>
              </tr>
              <tr>
                <th>Size</th>
                <td>
                  {sizes.map((s, i) => (
                    <span key={i}>
                      {s.toUpperCase()}
                      {i < sizes.length - 1 && ", "}
                    </span>
                  )) || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
