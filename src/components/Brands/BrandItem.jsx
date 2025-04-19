import { useEffect, useState } from "react";

// global set: tekrar marka seçilmesin
let usedIndexes = new Set();

const BrandItem = () => {
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        const availableIndexes = data.brands
          .map((_, index) => index)
          .filter((index) => !usedIndexes.has(index));

        if (availableIndexes.length === 0) {
          usedIndexes.clear();
        }

        const freshIndexes = data.brands
          .map((_, index) => index)
          .filter((index) => !usedIndexes.has(index));

        const randomIndex =
          freshIndexes[Math.floor(Math.random() * freshIndexes.length)];

        usedIndexes.add(randomIndex);
        setBrand(data.brands[randomIndex]);
      })
      .catch((err) => console.error("Brand verisi alınamadı", err));
  }, []);

  if (!brand) return null;

  return (
    <li className="brand-item" style={{ width: "100px", height: "auto" }}>
      <div style={{ display: "inline-block", width: "100%" }}>
        <img
          src={`/${brand.img}`}
          alt={brand.name}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            filter: "grayscale(100%)",
            opacity: 0.85,
            transition: "transform 0.3s ease, filter 0.3s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.filter = "grayscale(0%)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "grayscale(100%)";
            e.currentTarget.style.opacity = "0.85";
          }}
        />
      </div>
    </li>
  );
};

export default BrandItem;
