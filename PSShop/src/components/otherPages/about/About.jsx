export default function About() {
  return (
    <section className="about-us container">
      <div className="mw-930">
        <h2 className="page-title">GIỚI THIỆU VỀ CỬA HÀNG</h2>
      </div>
      <div className="about-us__content pb-5 mb-5">
        <p className="mb-5">
          <img
            style={{ height: "fit-content" }}
            loading="lazy"
            className="w-100 h-auto d-block"
            src="https://t3.ftcdn.net/jpg/08/93/46/40/360_F_893464019_ROpq7gXpHuMSUxa0fkHQmOVaGrabDfKR.jpg"
            width="1410"
            height="550"
            alt="hình ảnh"
          />
        </p>
        <div className="mw-930">
          <h3 className="mb-4">CÂU CHUYỆN CỦA CHÚNG TÔI</h3>
          <p className="fs-6 fw-medium mb-4">
            Chúng tôi luôn cam kết mang đến những sản phẩm và dịch vụ chất lượng tốt nhất cho khách hàng. Sứ mệnh của chúng tôi là đáp ứng các nhu cầu đa dạng và phong phú của bạn.
          </p>
          <p className="mb-4">
            Chúng tôi bắt đầu từ những ý tưởng nhỏ và đã phát triển thành một thương hiệu được nhiều người tin dùng. Mỗi sản phẩm chúng tôi tạo ra đều mang trong mình sự tận tâm và chú trọng đến từng chi tiết nhỏ.
          </p>
          <div className="row mb-3">
            <div className="col-md-6">
              <h5 className="mb-3">Sứ Mệnh Của Chúng Tôi</h5>
              <p className="mb-3">
              Đem đến sản phẩm và dịch vụ chất lượng cao, góp phần tạo nên cuộc sống tốt đẹp hơn cho khách hàng.
              </p>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Tầm Nhìn Của Chúng Tôi</h5>
              <p className="mb-3">
                Trở thành thương hiệu hàng đầu, được khách hàng tin yêu và lựa chọn trên toàn thế giới.
              </p>
            </div>
          </div>
        </div>
        <div className="mw-930 d-lg-flex align-items-lg-center">
          <div className="image-wrapper col-lg-6">
            <img
              style={{ height: "fit-content" }}
              className="h-auto"
              loading="lazy"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB3RSYl-wODdTm5snENrgYLh3jMMaGpgKEZw&s"
              width="450"
              height="500"
              alt="hình ảnh"
            />
          </div>
          <div className="content-wrapper col-lg-6 px-lg-4">
            <h5 className="mb-3">Về Công Ty</h5>
            <p>
              Chúng tôi là một tập thể gồm những con người đam mê, sáng tạo và không ngừng đổi mới. Với mục tiêu mang lại những giá trị bền vững cho khách hàng, chúng tôi luôn nỗ lực để cải tiến và nâng cao chất lượng sản phẩm.
            </p>
            <p>
              Công ty chúng tôi đặt khách hàng làm trung tâm của mọi hoạt động, nhằm mang đến những trải nghiệm vượt trội và sự hài lòng cao nhất.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
