import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Slider from "react-slick";
import PropTypes from "prop-types";
import "./Products.css";
import { message } from "antd";

function NextBtn({ onClick }) {
  return (
    <button className="glide__arrow glide__arrow--right" onClick={onClick}>
      <i className="bi bi-chevron-right"></i>
    </button>
  );
}

NextBtn.propTypes = {
  onClick: PropTypes.func,
};

function PrevBtn({ onClick }) {
  return (
    <button className="glide__arrow glide__arrow--left" onClick={onClick}>
      <i className="bi bi-chevron-left"></i>
    </button>
  );
}

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          message.error("Veri getirme başarısız.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      }
    };
    fetchProducts();
  }, [apiUrl]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    autoplay: true,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="products">
      <div className="container">
        <div className="section-title">
          <h1>Bu Hafta Öne Çıkanlar</h1>
        </div>
        <div className="product-wrapper product-carousel">
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <ProductItem productItem={product} key={product._id} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Products;
