import { useEffect, useState } from "react";
import "./BlogDetails.css";

const BlogDetails = () => {
  const [brands, setBrands] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setBrands(data.brands))
      .catch((err) => console.error("Marka verisi alınamadı", err));
  }, []);

  const handleBrandClick = (imgPath) => {
    setZoomedImage(imgPath);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <section className="blog-details">
      <div className="container">
        <div className="section-title">
          <h2>Markalarımız</h2>
          <p>Bizimle çalışan seçkin markalar</p>
        </div>

        <div className="brand-grid">
          {brands.map((brand) => (
            <div
              className="brand-item"
              key={brand.id}
              onClick={() => handleBrandClick(brand.img)}
            >
              <img src={`/${brand.img}`} alt={brand.name} />
            </div>
          ))}
        </div>

        <div className="brand-description">
          <p>
            Biz, farklı sektörlerden birçok güçlü markayla birlikte çalışarak
            kalitenin ve güvenin simgesi olmayı sürdürüyoruz. İş ortaklarımızla
            kurduğumuz bu bağ, müşteri memnuniyetine verdiğimiz önemin bir
            göstergesidir.
          </p>
        </div>

        {zoomedImage && (
          <div className="image-zoom-overlay" onClick={closeZoom}>
            <img
              src={`/${zoomedImage}`}
              alt="Zoomed Brand"
              className="zoomed-img"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogDetails;
