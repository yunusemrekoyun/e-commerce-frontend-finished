import { useState, useEffect } from "react";
import SliderItem from "./SliderItem";
import "./Sliders.css";

const Sliders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide değişimini sağlamak için bir fonksiyon
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3);
  };

  // useEffect içinde setInterval ile geçişi otomatik hale getirmek
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // 6 saniyede bir otomatik geçiş

    // cleanup function, component unmount olduğunda interval'i temizler
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider">
      <div className="slider-elements">
        {currentSlide === 0 && (
          <SliderItem imageSrc="img/slider/slider1.jpg" brand="kategori" />
        )}
        {currentSlide === 1 && (
          <SliderItem imageSrc="img/slider/slider2.jpg" brand="CLEAR" />
        )}
        {currentSlide === 2 && (
          <SliderItem imageSrc="img/slider/slider3.jpg" brand="Head & Shoulder" />
        )}

        {/* Butonları kaldırdık */}
        {/* <div className="slider-buttons">
          <button onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Sliders;