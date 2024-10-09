// mockServicePromotions.js
export const servicePromotions = [
  {
    icon: "./src/assets/icon/9025885_shopping_cart_icon.svg", // Đường dẫn icon của bạn
    title: "Fast and Free Delivery",
    content: "Free delivery for all orders over $140",
  },
  {
    icon: "./src/assets/icon/5288414_earphone_earphones_headphone_headphones_headset_icon.svg",
    title: "24/7 Customer Support",
    content: "Friendly 24/7 customer support",
  },
  {
    icon: "./src/assets/icon/9004687_shield_security_safety_secure_protect_icon.svg",
    title: "Money Back Guarantee",
    content: "We return money within 30 days",
  },
];

// mockBrandImages.js
export const brandImages2 = [
  { src: "/images/stradivarius.png", width: 100, height: 50 },
  { src: "/images/adidas.png", width: 120, height: 60 },
  { src: "/images/bershka.png", width: 110, height: 55 },
  { src: "/images/mango.png", width: 90, height: 45 },
  { src: "/images/zara.png", width: 130, height: 70 },
];

export default function Services() {
return (
  <section className="service-promotion horizontal container mw-930 pt-0 mb-md-4 pb-md-4 mb-xl-5">
    <div className="row">
      {servicePromotions.map((service, index) => (
        <div key={index} className="col-md-4 text-center mb-5 mb-md-0">
          <div className="service-promotion__icon mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={service.icon} alt={service.title} width={52} height={52}  />
          </div>
          <h3 className="service-promotion__title fs-6 text-uppercase">{service.title}</h3>
          <p className="service-promotion__content text-secondary">{service.content}</p>
        </div>
      ))}
    </div>
  </section>
);
}
