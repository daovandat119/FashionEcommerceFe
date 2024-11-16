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
              <div
                className="background-img"
                style={{
                  backgroundImage: "url(/assets/images/4.jpg)",
                }}
              ></div>
              <div className="content_abs content_bottom content_left content_bottom-md content_left-md">
                <p className="text-uppercase text-white mb-1">Danh Sách Nổi Bật</p>
                <h3 className="text-uppercase text-white">
                  <strong>Bộ Sưu Tập Nữ</strong> 
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
              <div
                className="background-img"
                style={{
                  backgroundImage: "url(/assets/images/2.jpg)",
                }}
              ></div>
              <div className="content_abs content_bottom content_left content_bottom-md content_left-md">
                <p className="text-uppercase mb-1 text-white">Danh Sách Nổi Bật</p>
                <h3 className="text-uppercase text-white">
                  <strong>Bộ Sưu Tập Nam</strong> 
                </h3>
                <Link
                  to="/shop"
                  className="btn-link default-underline text-uppercase text-white fw-medium"
                >
                  Mua Ngay
                </Link>
              </div>
            </div>
            <div className="position-relative flex-grow-1 mt-lg-1">
              <div className="row h-md-100">
                <div className="col-md-6 h-md-100">
                  <div className="collection-grid__item h-md-100 position-relative">
                    <div
                      className="background-img"
                      style={{
                        backgroundImage: "url(/assets/images/3.jpg)",
                      }}
                    ></div>
                    <div className="content_abs content_bottom content_left content_bottom-md content_left-md">
                      <p className="text-uppercase text-white mb-1">Danh Sách Nổi Bật</p>
                      <h3 className="text-uppercase text-white">
                        <strong>Bộ Sưu Tập Trẻ Em</strong>
                      </h3>
                      <Link
                        to="/shop"
                        className="btn-link default-underline text-white text-uppercase fw-medium"
                      >
                        Mua Ngay
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 h-md-100">
                  <div className="collection-grid__item h-md-100 position-relative">
                    <div
                      className="background-img"
                      style={{ backgroundColor: "#f5e6e0" }}
                    ></div>
                    <div className="content_abs content_bottom content_left content_bottom-md content_left-md">
                      <h3 className="text-uppercase">
                        <strong>Thẻ Quà Tặng</strong> Điện Tử
                      </h3>
                      <p className="mb-1">
                        Tặng một món quà mà họ thực sự muốn.
                        <br />
                        Hãy làm họ bất ngờ ngay!
                      </p>
                      <Link
                        to="/shop-1"
                        className="btn-link default-underline text-uppercase fw-medium"
                      >
                        Mua Ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
