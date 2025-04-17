import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CategoryHeader.css";

const CategoryHeader = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Kategori alınamadı:", err));
  }, []);

  return (
    <header className="category-header">
      <div className="category-header-row">
        <div className="container">
          <div className="category-header-wrapper">
            <nav className="category-navigation">
              <ul className="category-menu-list">
                {categories.map((cat) => {
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
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CategoryHeader;
