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
  // Burada activeImg'i string olarak tutuyoruz (base64).
  const [activeImg, setActiveImg] = useState({
    img: "",
    imgIndex: 0,
  });

  useEffect(() => {
    // singleProduct.img => array of { _id, base64 } veya boş dizi
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
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
  };

  if (!singleProduct.img) {
    return null; // veya bir loading ya da boş durum göstergesi
  }

  return (
    <div className="product-gallery">
      <div className="single-image-wrapper">
        {/* Aktif resmi göster */}
        <img src={activeImg.img} id="single-image" alt="product" />
      </div>

      <div className="product-thumb">
        <div className="glide__track" data-glide-el="track">
          <ol className="gallery-thumbs glide__slides">
            <Slider {...sliderSettings}>
              {singleProduct.img.map((imageObj, index) => (
                <li
                  className="glide__slide glide__slide--active"
                  key={imageObj._id || index} // subdoc._id varsa
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
        <div className="glide__arrows" data-glide-el="controls"></div>
      </div>
    </div>
  );
};

export default Gallery;

Gallery.propTypes = {
  singleProduct: PropTypes.object,
};
