import Pagination1 from "../common/Pagination1";

export default function Blog1() {


  return (
    <>
      <section className="blog-page-title mb-4 mb-xl-5">
        <div className="title-bg">
          <img
            loading="lazy"
            src="/assets/images/bn4.jpg"
            width="1780"
            height="420"
            alt="hình ảnh"
          />
        </div>
      </section>
      <section className="blog-page container">
        <h2 className="d-none">Bài viết</h2>
        <p className="mb-5 text-center fw-medium">
          HIỂN THỊ 36 trong số 497 bài viết
        </p>
        <Pagination1 />

        <div className="text-center">
          <a className="btn-link btn-link_lg text-uppercase fw-medium" href="#">
            Hiển thị thêm
          </a>
        </div>
      </section>
    </>
  );
}
