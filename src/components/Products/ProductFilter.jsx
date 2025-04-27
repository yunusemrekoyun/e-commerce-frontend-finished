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
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams(); //  /shop/:category varsa

  /* URL → state senkronu --------------------------------------------------- */
  useEffect(() => {
    const s = new URLSearchParams(location.search);
    const urlB = s.get("brand");

    if (urlB) {
      const brandList = urlB
        .split(",")
        .map((b) => decodeURIComponent(b).trim().toLowerCase());
      if (
        JSON.stringify(brandList.sort()) !==
        JSON.stringify([...selectedBrands].sort())
      ) {
        setSelectedBrands(brandList);
      }
    } else if (selectedBrands.length) {
      setSelectedBrands([]); // Eğer URL'deki brand parametreleri silindiyse, state'i sıfırlıyoruz.
    }
  }, [location.search, selectedBrands, setSelectedBrands]);

  /* mobil ekran kontrolü --------------------------------------------------- */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        const data = await res.json();
  
        if (categoryName) {
          const cat = data.find((c) => c.name === categoryName);
          setBrands((cat?.brands || []).map((b) => b.trim().toLowerCase()));
        } else if (selectedBrands.length > 0) {
          setBrands(selectedBrands);
        } else {
          const all = data.flatMap((c) => c.brands);
          setBrands([...new Set(all.map((b) => b.trim().toLowerCase()))]);
        }
      } catch (err) {
        console.error("Marka alınamadı:", err);
      }
    };
  
    if (categoryName !== "") {   // ⬅️ Burayı ekledik, kategori ismi hazırsa çalışacak!
      fetchAll();
    }
  }, [categoryName, selectedBrands]);

  /* checkbox tıklandığında ------------------------------------------------- */
  const handleBrandChange = (e) => {
    const { value, checked } = e.target; // value zaten küçük-harf
    let updated;
    if (checked) {
      updated = [...new Set([...selectedBrands, value])]; // tekrar eklenmez
    } else {
      updated = selectedBrands.filter((b) => b !== value);
    }
    setSelectedBrands(updated);

    const p = new URLSearchParams(location.search);
    updated.length ? p.set("brand", updated.join(",")) : p.delete("brand");

    const base = category ? `/shop/${category}` : "/shop";
    navigate(p.toString() ? `${base}?${p}` : base);
  };

  return (
    <aside className="product-filter">
      <div className="filter-section">
        <div
          className="filter-title"
          onClick={() => isMobile && setIsBrandOpen(!isBrandOpen)}
          style={{ cursor: isMobile ? "pointer" : "default" }}
        >
          Markalar {isMobile && <span>{isBrandOpen ? "▲" : "▼"}</span>}
        </div>

        {(!isMobile || isBrandOpen) && (
          <ul className="filter-list">
            {brands.map((b) => (
              <li key={b} className="filter-item">
                <label>
                  <input
                    type="checkbox"
                    value={b}
                    checked={selectedBrands.includes(b)}
                    onChange={handleBrandChange}
                  />
                  <span>{b.toUpperCase()}</span> {/* ekranda büyük göster */}
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