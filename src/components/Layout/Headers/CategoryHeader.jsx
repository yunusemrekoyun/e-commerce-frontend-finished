/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Layout/Headers/CategoryHeader.jsx
 ********************************************************/
import { Link } from "react-router-dom";
import "./CategoryHeader.css";

const CategoryHeader = () => {
  const categories = ["Kadın", "Erkek", "Çocuk", "Aksesuar", "Ayakkabı", "Elektronik","Ev & Yaşam","Kozmetik", "Kitap", "Oyun", "Spor", "Hobi", "Teknoloji"];

  return (
    <header className="category-header">
      <div className="category-header-row">
        <div className="container">
          <div className="category-header-wrapper">
            <nav className="category-navigation">
              <ul className="category-menu-list">
                {categories.map((category, index) => (
                  <li key={index} className="category-menu-list-item">
                    <Link
                      to={`/category/${category.toLowerCase()}`}
                      className="category-menu-link"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CategoryHeader;
