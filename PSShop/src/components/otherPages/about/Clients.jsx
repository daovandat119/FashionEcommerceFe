export const brandImages2 = [
  { src: "/images/stradivarius.png", width: 100, height: 50 },
  { src: "/images/adidas.png", width: 120, height: 60 },
  { src: "/images/bershka.png", width: 110, height: 55 },
  { src: "/images/mango.png", width: 90, height: 45 },
  { src: "/images/zara.png", width: 130, height: 70 },
];

export default function Clients() {
  return (
    <section className="brands-carousel container">
      <h5 className="mb-3 mb-xl-5">Company Partners</h5>
      <div className="position-relative"  style={{ display: 'flex', justifyContent:'space-between', alignItems: 'center' }}>
        {brandImages2.map((brand, index) => (
          <div key={index} className="swiper swiper-container swiper-initialized swiper-horizontal js-swiper-slider" 
         >
            <img
              src={brand.src} 
              alt={`Brand ${index + 1}`} 
              width={brand.width} 
              height={brand.height} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
