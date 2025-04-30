import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CategoryHeader.css";

const CategoryHeader = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Hata durumunu ekliyoruz

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        if (!response.ok) {
          throw new Error("Kategori verileri alınırken bir hata oluştu");
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        setError(error.message); // Hata mesajını tutuyoruz
        console.error("Kategori alınamadı:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="category-header">
      <div className="category-header-row">
        <div className="container">
          <div className="category-header-wrapper">
            <nav className="category-navigation">
              <ul className="category-menu-list">
                {isLoading ? (
                  <li className="category-menu-list-item">Yükleniyor...</li>
                ) : error ? (
                  <li className="category-menu-list-item">Hata: {error}</li> // Hata durumunu gösteriyoruz
                ) : (
                  categories.map((cat) => {
                    const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <li key={cat._id} className="category-menu-list-item">
                        <NavLink
                          to={`/shop/${slug}`}
                          className={({ isActive }) =>
                            `category-menu-link${isActive ? " active" : ""}`
                          }
                        >
                          {cat.name}
                        </NavLink>
                      </li>
                    );
                  })
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CategoryHeader;