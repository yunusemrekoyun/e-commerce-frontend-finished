import { useState } from "react";
import SliderItem from "./SliderItem";
import "./Sliders.css";

const Sliders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
  };
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3);
  };

  return (
    <section className="slider">
      <div className="slider-elements">
        {currentSlide === 0 && (
          <SliderItem imageSrc="img/slider/slider1.jpg" brand="NIVEA" />
        )}
        {currentSlide === 1 && (
          <SliderItem imageSrc="img/slider/slider2.jpg" brand="CLEAR" />
        )}
        {currentSlide === 2 && (
          <SliderItem imageSrc="img/slider/slider3.jpg" brand="Head & Shoulder" />
        )}

        <div className="slider-buttons">
          <button onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sliders;
