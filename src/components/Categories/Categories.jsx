/********************************************************
/Applications/Works/kozmetik/frontend/src/components/Categories/Categories.jsx
 ********************************************************/

import { useEffect, useState } from "react";
import { message } from "antd";
import CategoryItem from "./CategoryItem";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  /* ► 12 rastgele kategori */
  useEffect(() => {
    (async () => {
      try {
        const res   = await fetch(`${apiUrl}/api/categories`);
        if (!res.ok) throw new Error();
        const data  = await res.json();
        const rand  = [...data].sort(() => 0.5 - Math.random()).slice(0, 12);
        setCategories(rand);
      } catch {
        message.error("Kategoriler alınamadı");
      }
    })();
  }, [apiUrl]);

  return (
    <section className="categories">
      <div className="container">
        {/*  >>> kaydırmayı yöneten sarmal  */}
        <div className="category-scroll">
          <ul className="category-list">
            {categories.map((c) => (
              <CategoryItem key={c._id} category={c} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Categories;