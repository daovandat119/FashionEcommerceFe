import { Link } from "react-router-dom";

export default function BlogCards() {
  return (
    <section
      className="collections-grid collections-grid_masonry"
      id="section-collections-grid_masonry"
    >
      <div className="container h-md-100">
        <div className="row h-md-100">
          <div className="col-lg-6 h-md-100">
            <div className="collection-grid__item position-relative h-md-100">
              <div className="background-img">
                <img
                  className="h-[100%] w-[100%] object-cover"
                  src="https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/177066/Originals/poster-bong-da-1.jpg"
                />
              </div>
              <div className="content_abs content_bottom content_left content_bottom-md content_left-md">
                <p className="text-uppercase text-white mb-1">
                  Danh Sách Nổi Bật
                </p>
                <h3 className="text-uppercase text-white">
                  <strong>Bộ Sưu Tập Bóng Đá</strong>
                </h3>
                <Link
                  to="/shop"
                  className="btn-link default-underline text-uppercase text-white fw-medium"
                >
                  Mua Ngay
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex flex-column">
            <div className="collection-grid__item position-relative flex-grow-1 mb-lg-4">
              <div className="background-img">
                <img
                  className="h-[100%] w-[100%] object-cover"
                  src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/soccer-banner-template-design-a2b17ea0fb24a1d7a5e7a7a3afec4dbd_screen.jpg?ts=1622168275"
                />
              </div>
            </div>
            <div className="flex w-[50%] justify-center mx-auto gap-3 ">
              <img
                className=" relative w-[98%]  object-cover"
                src="https://cdn.luongsport.com/wp-content/uploads/2020/10/vot-cau-long-lining-banner.jpg"
              />

              <img
                className=" w-[98%]  object-cover"
                src="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ilMGpe.nT9oc/v3/-1x-1.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
