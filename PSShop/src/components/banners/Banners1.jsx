//import { Link } from "react-router-dom";

// import BannerLinks from "../shop/BannerLinks";

export default function Banner1() {
  return (
    <section className="full-width_padding">
      <div
        className="full-width_border border-2"
        style={{ borderColor: "#eeeeee" }}
      >
        <div className="shop-banner position-relative">
          <div
            className="background-img"
            style={{ backgroundColor: "#eeeeee" }}
          >
            <img
              loading="lazy"
              src="https://t4.ftcdn.net/jpg/04/12/63/51/360_F_412635103_crZRbjCFpXACc8NBjZHWoFxvYmcLKpKm.jpg"
              width="1759"
              height="420"
              alt="Hình nền"
              className="slideshow-bg__img object-fit-cover scale-x-[-1]"
            />
          </div>

          <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
            <h2 className="stroke-text h1 smooth-16 text-uppercase text-blue-300 fw-bold mb-3 mb-xl-4 mb-xl-5">
              Áo quần sport đa dạng
            </h2>
            {/* <ul className="d-flex flex-wrap list-unstyled text-uppercase h6">
              <BannerLinks />
            </ul> */}
          </div>
          {/* <!-- /.shop-banner__content --> */}
        </div>
        {/* <!-- /.shop-banner position-relative --> */}
      </div>
      {/* <!-- /.full-width_border --> */}
    </section>
  );
}