import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProductFilter.css";

const ProductFilter = ({
  categoryName = "",
  selectedBrands,
  setSelectedBrands,
}) => {
  const [brands, setBrands] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  // Mobil / desktop toggle
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Kategoriye göre (veya tümden) markaları ayarla
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/categories`
        );
        const data = await res.json();
        if (categoryName) {
          const cat = data.find((c) => c.name === categoryName);
          setBrands(cat?.brands || []);
        } else {
          const all = data.flatMap((c) => c.brands);
          setBrands([...new Set(all)]);
        }
      } catch (err) {
        console.error("Marka alınamadı:", err);
      }
    };
    fetchAll();
  }, [categoryName]);

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((b) => b !== value)
    );
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

ProductFilter.propTypes = {
  categoryName: PropTypes.string,
  selectedBrands: PropTypes.array.isRequired,
  setSelectedBrands: PropTypes.func.isRequired,
};

export default ProductFilter;
