/********************************************************
 * frontend/src/components/Modals/Search/Search.jsx
 ********************************************************/
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { message, Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import "./Search.css";

const Search = ({ isSearchShow, setIsSearchShow }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const debounceRef = useRef(null);

  const handleCloseModal = () => {
    setIsSearchShow(false);
    setSearchResults(null);
    setSearchTerm("");
  };

  // Canlı (debounce) arama
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/api/products/search/${encodeURIComponent(
            searchTerm.trim()
          )}`
        );
        if (!res.ok) {
          message.error("Ürün getirme hatası!");
          setSearchResults([]);
        } else {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error(error);
        message.error("Arama sırasında bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, apiUrl]);

  return (
    <div className={`modal-search ${isSearchShow ? "show" : ""}`}>
      <div className="modal-wrapper">
        <h3 className="modal-title">Ürün Ara</h3>
        <p className="modal-text">
          Aramak istediğiniz ürünün adını yazmaya başlayın.
        </p>
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Bir ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={handleCloseModal}>
            <i className="bi bi-x"></i>
          </button>
        </form>

        <div className="search-results">
          <div className="search-heading">
            <h3>ÜRÜNLERDE SONUÇLAR</h3>
          </div>
          <Spin spinning={loading}>
            <div
              className="results"
              style={{
                display:
                  !searchResults || searchResults.length === 0
                    ? "flex"
                    : "grid",
              }}
            >
              {!searchResults && (
                <b
                  className="result-item"
                  style={{ justifyContent: "center", width: "100%" }}
                >
                  Ürün Ara...
                </b>
              )}
              {searchResults && searchResults.length === 0 && (
                <div
                  className="result-item"
                  style={{ justifyContent: "center", width: "100%" }}
                >
                  😔 Aradığınız ürün bulunamadı 😔
                </div>
              )}
              {searchResults &&
                searchResults.map((item) => (
                  <Link
                    to={`/product/${item._id}`}
                    className="result-item"
                    key={item._id}
                    onClick={handleCloseModal}
                  >
                    <img
                      src={item.img[0]}
                      className="search-thumb"
                      alt={item.name}
                    />
                    <div className="search-info">
                      <h4>{item.name}</h4>
                      <span className="search-price">
                        {item.price?.current != null
                          ? `₺${item.price.current.toFixed(2)}`
                          : "-"}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </Spin>
        </div>
      </div>
      <div className="modal-overlay" onClick={handleCloseModal}></div>
    </div>
  );
};

Search.propTypes = {
  isSearchShow: PropTypes.bool,
  setIsSearchShow: PropTypes.func,
};

export default Search;