import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { socialLinks } from "../../data/socials";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Hero() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  const slides = [
    {
      image:
        "https://graphicsfamily.com/wp-content/uploads/edd/2021/01/Web-banner-template-with-sports-concept-scaled.jpg",
    },
    {
      image:
        "https://file.hstatic.net/1000341630/collection/banner_vtt_93db1558afe149ad9e5f28b416957ef2.png",
    },
    {
      image:
        "https://dongduongsport.com/wp-content/uploads/2023/02/3-banner-thethao-dongduonsport-2023.jpg",
    },
    {
      image:
        "https://dongduongsport.com/wp-content/uploads/2023/02/3-banner-thethao-dongduonsport-2023.jpg",
    },
  ];

  return (
    <div className="hero-slider pb-10">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <div
              className=""
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%", // Set chiều rộng cho ảnh
                height: "500px", // Điều chỉnh chiều cao tùy ý
              }}
            >
              <div className="slide-content text-center text-white">
                <h6 className="text-uppercase text-red fs-base fw-medium">
                  {slide.text1}
                </h6>
                <h2 className="text-uppercase h1 fw-normal mb-0">
                  {slide.text2}
                </h2>
                {slide.text3 && (
                  <h2 className="text-uppercase h1 fw-bold">{slide.text3}</h2>
                )}
                {slide.text4 && (
                  <h6 className="text-uppercase mb-5">{slide.text4}</h6>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
