import PropTypes from "prop-types";

const SliderItem = ({ imageSrc }) => {
  return (
    <div className="slider-item fade">
      <div className="slider-image">
        <img src={imageSrc} className="img-fluid" alt="" />
      </div>
      <div className="container slider-content">
        <p className="slider-title">Tüm Kozmetik Ürünlerinde</p>
        <h2 className="slider-heading">İlk Alışverişinize Net %30</h2>
        <a href="shop" className="btn btn-lg btn-primary">
          Alışverişe Başla
        </a>
      </div>
    </div>
  );
};

export default SliderItem;

SliderItem.propTypes = {
  imageSrc: PropTypes.string,
};