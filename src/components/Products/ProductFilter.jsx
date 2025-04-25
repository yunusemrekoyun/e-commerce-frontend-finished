import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams(); // /shop/:category varsa al

  // ✔️ Sayfa yüklendiğinde URL'deki brand parametresini selectedBrands'e aktar
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const brandParam = searchParams.get("brand");

    if (brandParam) {
      const brandList = brandParam.split(",");

      // Karşılaştırarak gereksiz setState’i engelle
      if (
        JSON.stringify(selectedBrands.sort()) !==
        JSON.stringify(brandList.sort())
      ) {
        setSelectedBrands(brandList);
      }
    } else {
      // URL'de yoksa varsa temizle
      if (selectedBrands.length > 0) {
        setSelectedBrands([]);
      }
    }
  }, [location.search, selectedBrands, setSelectedBrands]);

  // ✔️ Mobil mi değil mi kontrolü
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✔️ Kategoriye göre markaları çek
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

  // ✔️ Checkbox seçimi
  const handleBrandChange = (e) => {
    const { value, checked } = e.target;

    const updated = checked
      ? [...selectedBrands, value]
      : selectedBrands.filter((b) => b !== value);

    setSelectedBrands(updated);

    // URL'yi oluştur
    const params = new URLSearchParams(location.search);
    if (updated.length > 0) {
      params.set("brand", updated.join(","));
    } else {
      params.delete("brand");
    }

    const basePath = category ? `/shop/${category}` : `/shop`;
    const newUrl = params.toString() ? `${basePath}?${params}` : basePath;

    navigate(newUrl);
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
