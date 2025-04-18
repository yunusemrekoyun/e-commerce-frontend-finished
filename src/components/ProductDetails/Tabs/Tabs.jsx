import { useState } from "react";
import PropTypes from "prop-types";
import Reviews from "../../Reviews/Reviews";
import "./Tabs.css";

const Tabs = ({ singleProduct, setSingleProduct }) => {
  const [activeTab, setActiveTab] = useState("desc");

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
            className={`tab-button ${activeTab === "desc" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "desc")}
          >
            Description
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "info" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "info")}
          >
            Additional Information
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "reviews")}
          >
            Reviews
          </a>
        </li>
      </ul>

      <div className="tab-panel">
        {/* Description Tab */}
        <div
          className={`tab-panel-descriptions content ${
            activeTab === "desc" ? "active" : ""
          }`}
        >
          <div
            className="product-description"
            dangerouslySetInnerHTML={{
              __html: singleProduct.description || "No description available.",
            }}
          ></div>
        </div>

        {/* Additional Info Tab */}
        <div
          className={`tab-panel-information content ${
            activeTab === "info" ? "active" : ""
          }`}
        >
          <h3>Additional Information</h3>
          <table>
            <tbody>
              {singleProduct.brand && (
                <tr>
                  <th>Brand</th>
                  <td>{singleProduct.brand}</td>
                </tr>
              )}
              {singleProduct.colors?.length > 0 && (
                <tr>
                  <th>Colors</th>
                  <td>
                    {singleProduct.colors.map((color, index) => (
                      <span key={index}>
                        {color}
                        {index < singleProduct.colors.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                </tr>
              )}
              {singleProduct.sizes?.length > 0 && (
                <tr>
                  <th>Sizes</th>
                  <td>
                    {singleProduct.sizes.map((size, index) => (
                      <span key={index}>
                        {size.toUpperCase()}
                        {index < singleProduct.sizes.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reviews Tab */}
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