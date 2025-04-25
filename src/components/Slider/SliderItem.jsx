import PropTypes from "prop-types";

const SliderItem = ({ imageSrc, brand }) => {
  const brandSlug = brand.toLowerCase(); // URL için normalize

  return (
    <div className="slider-item fade">
      <div className="slider-image">
        <img src={imageSrc} className="img-fluid" alt={brand} />
      </div>
      <div className="container">
        <p className="slider-title">{brand} Marka Ürünlerde</p>
        <h2 className="slider-heading">İlk Alışverişinize Net %30</h2>
        <a href={`/shop?brand=${brandSlug}`} className="btn btn-lg btn-primary">
          Alışverişe Başla
        </a>
      </div>
    </div>
  );
};

SliderItem.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
};

export default SliderItem;
