/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Products/ProductFilter.jsx
 ********************************************************/
import { useState, useEffect } from "react";
import "./ProductFilter.css";

const ProductFilter = () => {
  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "New Balance",
    "Under Armour",
    "Asics",
  ];
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(true); // Mobilde aç/kapa

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedBrands((prev) => [...prev, value]);
    } else {
      setSelectedBrands((prev) => prev.filter((brand) => brand !== value));
    }
  };

  return (
    <aside className="product-filter">
      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => isMobile && setIsBrandOpen(!isBrandOpen)}
          style={{ cursor: isMobile ? "pointer" : "default" }}
        >
          Marka {isMobile && <span>{isBrandOpen ? "▲" : "▼"}</span>}
        </div>

        {/* Mobilde toggle edilir */}
        {(!isMobile || isBrandOpen) && (
          <ul className="filter-list">
            {brands.map((brand) => (
              <li key={brand} className="filter-item">
                <label>
                  <input
                    type="checkbox"
                    value={brand}
                    onChange={handleBrandChange}
                    checked={selectedBrands.includes(brand)}
                  />
                  <span>{brand}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ProductFilter;
