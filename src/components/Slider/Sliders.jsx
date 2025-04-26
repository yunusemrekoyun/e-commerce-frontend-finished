import { useEffect, useState } from "react";
import SliderItem from "./SliderItem";
import "./Sliders.css";

const Sliders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Otomatik geçiş için
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 6000); // 4 saniyede bir geçiş

    return () => clearInterval(interval); // componentWillUnmount
  }, []);

  return (
    <section className="slider">
      <div className="slider-elements">
        {currentSlide === 0 && (
          <SliderItem imageSrc="img/slider/slider1.jpg" />
        )}
        {currentSlide === 1 && (
          <SliderItem imageSrc="img/slider/slider2.jpg" />
        )}
        {currentSlide === 2 && (
          <SliderItem imageSrc="img/slider/slider3.jpg" />
        )}
      </div>
    </section>
  );
};

export default Sliders;