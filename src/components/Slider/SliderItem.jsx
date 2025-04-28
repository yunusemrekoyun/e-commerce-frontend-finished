import PropTypes from "prop-types";

const SliderItem = ({ imageSrc, brand }) => {
  const brandSlug = brand.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return (
    <div className="slider-item fade">
      <div className="slider-image">
        <img src={imageSrc} className="img-fluid" alt={brand} />
      </div>
      <div className="container">
        <p className="slider-heading">{brand}</p>
        <h2 className="slider-title">Marka Ürünlerde</h2>
        <h2 className="slider-title">Net %20 </h2>

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