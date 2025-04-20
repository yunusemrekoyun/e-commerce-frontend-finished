import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "./Gallery.css";

function PrevBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--left"
      data-glide-dir="<"
      onClick={onClick}
      style={{ zIndex: 2 }}
    >
      <i className="bi bi-chevron-left"></i>
    </button>
  );
}

function NextBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--right"
      data-glide-dir=">"
      onClick={onClick}
      style={{ zIndex: 2 }}
    >
      <i className="bi bi-chevron-right"></i>
    </button>
  );
}

NextBtn.propTypes = {
  onClick: PropTypes.func,
};

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Gallery = ({ singleProduct }) => {
  const [activeImg, setActiveImg] = useState({
    img: "",
    imgIndex: 0,
  });

  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  useEffect(() => {
    if (singleProduct.img && singleProduct.img.length > 0) {
      setActiveImg({
        img: singleProduct.img[0].base64,
        imgIndex: 0,
      });
    } else {
      setActiveImg({
        img: "",
        imgIndex: 0,
      });
    }
  }, [singleProduct.img]);

  const sliderSettings = {
    dots: false,
    infinite: singleProduct.img.length > 1, // 🔥 Bu satır önemli
    slidesToShow: Math.min(3, singleProduct.img.length), // Az foto varsa ona göre
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
  };

  const handleClick = (e) => {
    setZoomed(!zoomed);

    if (!zoomed) {
      const rect = e.target.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const newOriginX = (offsetX / rect.width) * 100;
      const newOriginY = (offsetY / rect.height) * 100;
      setTransformOrigin(`${newOriginX}% ${newOriginY}%`);
    } else {
      setTransformOrigin("center center");
    }
  };

  if (!singleProduct.img) {
    return null;
  }

  return (
    <div className="product-gallery">
      <div className="single-image-wrapper">
        <img
          src={activeImg.img}
          id="single-image"
          alt="product"
          onClick={handleClick}
          style={{
            cursor: zoomed ? "zoom-out" : "zoom-in",
            transform: zoomed ? "scale(2)" : "scale(1)",
            transformOrigin: transformOrigin,
            transition: "transform 0.3s ease",
          }}
        />
      </div>

      <div className="product-thumb">
        <div className="glide__track" data-glide-el="track">
          <ol className="gallery-thumbs glide__slides">
            <Slider {...sliderSettings}>
              {singleProduct.img.map((imageObj, index) => (
                <li
                  className="glide__slide glide__slide--active"
                  key={imageObj._id || index}
                  onClick={() =>
                    setActiveImg({
                      img: imageObj.base64,
                      imgIndex: index,
                    })
                  }
                >
                  <img
                    src={imageObj.base64}
                    alt=""
                    className={`img-fluid ${
                      activeImg.imgIndex === index ? "active" : ""
                    }`}
                  />
                </li>
              ))}
            </Slider>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

Gallery.propTypes = {
  singleProduct: PropTypes.object,
};