import { brandImages2 } from "./Services";

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
