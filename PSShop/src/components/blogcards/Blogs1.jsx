import Pagination1 from "../common/Pagination1";

export default function Blog1() {
  const posts = [
    {
      id: 1,
      title: "Bí quyết phối đồ thời thượng với áo sơ mi trắng",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Áo sơ mi trắng là món đồ không thể thiếu trong tủ đồ của bạn. Hãy khám phá cách phối áo sơ mi trắng để tạo nên phong cách thời thượng và đầy cuốn hút.",
      image: "/assets/images/ba1.jpg",
    },
    {
      id: 2,
      title: "Lựa chọn quần jean phù hợp với dáng người",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Quần jean luôn là lựa chọn hoàn hảo cho mọi dịp. Hãy cùng tìm hiểu cách chọn kiểu quần jean phù hợp để tôn lên vóc dáng của bạn.",
      image: "/assets/images/jeans.jpg",

    },
    {
      id: 3,
      title: "Những mẫu váy mùa hè không thể bỏ lỡ",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Mùa hè là thời điểm tuyệt vời để khoe dáng với những mẫu váy xinh xắn. Cùng chúng tôi khám phá những thiết kế váy mùa hè nổi bật nhất.",
      image: "/assets/images/v.jpg",
    },
    {
      id: 4,
      title: "Phụ kiện thời trang - Điểm nhấn hoàn hảo cho trang phục",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Phụ kiện là yếu tố quan trọng để hoàn thiện trang phục. Tìm hiểu cách kết hợp phụ kiện để tạo điểm nhấn cho phong cách của bạn.",

        image: "/assets/images/a.jpg",
    },
  ];


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg overflow-hidden bg-white">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  By {post.author} | {post.date}
                </p>
                <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                <p className="text-gray-700 mt-3">{post.excerpt}</p>
                <a
                  href="#"
                  className="text-blue-500 hover:underline mt-4 inline-block"
                >
                  Continue Reading
                </a>
              </div>
            </div>
          ))}
        </div>

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
