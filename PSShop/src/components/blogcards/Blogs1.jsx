import { useState } from "react";
import Pagination1 from "../common/Pagination1";

export default function Blog1() {
  const [expandedPosts, setExpandedPosts] = useState([]);

  const toggleExpand = (id) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  const posts = [
    {
      id: 1,
      title: "Áo đấu bóng rổ thương hiệu adidas mới ra mắt ",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Áo đấu bóng rổ thương hiệu adidas mới ra mắt năm nay khiên rất nhiều người mong đợi...",
      fullText:
        "Áo đấu bóng rổ thương hiệu adidas mới ra mắt năm nay khiến rất nhiều người mong đợi. Được biết, adidas đã kết hợp với cầu thủ bóng rổ MPAPE để ra mắt sản phẩm với chất liệu cao cấp, thiết kế đột phá và phù hợp với mọi đối tượng người dùng.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlYEkdxEKtAg8y1sYsDeFW95Z1Xn0Lsxl5dA&s",
    },
    {
      id: 2,
      title: "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt...",
      fullText:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt cho người hâm mộ. Áo được sản xuất với số lượng giới hạn 10.000 chiếc trên toàn thế giới. Thiết kế kết hợp các yếu tố cổ điển và hiện đại, tạo nên sức hút khó cưỡng.",
      image:
        "https://anh.24h.com.vn/upload/1-2015/images/2015-03-17/1426560433-m-2.jpg",
    },
    // Thêm các bài viết khác
    
    {
      id: 3,
      title: "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt...",
      fullText:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt cho người hâm mộ. Áo được sản xuất với số lượng giới hạn 10.000 chiếc trên toàn thế giới. Thiết kế kết hợp các yếu tố cổ điển và hiện đại, tạo nên sức hút khó cưỡng.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEWKmlWf0GOnAWZhCxjeO6UVW-20BF5-oSeg&s",
    },
    {
      id: 4,
      title: "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt...",
      fullText:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt cho người hâm mộ. Áo được sản xuất với số lượng giới hạn 10.000 chiếc trên toàn thế giới. Thiết kế kết hợp các yếu tố cổ điển và hiện đại, tạo nên sức hút khó cưỡng.",
      image:
        "https://aocaulongthietke.com/wp-content/uploads/2021/06/Banner-trang-chu-ao-bong-chuyen-thiet-ke.jpg",
    },
    {
      id: 5,
      title: "Áo đấu bóng rổ thương hiệu adidas mới ra mắt ",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Áo đấu bóng rổ thương hiệu adidas mới ra mắt năm nay khiên rất nhiều người mong đợi...",
      fullText:
        "Áo đấu bóng rổ thương hiệu adidas mới ra mắt năm nay khiến rất nhiều người mong đợi. Được biết, adidas đã kết hợp với cầu thủ bóng rổ MPAPE để ra mắt sản phẩm với chất liệu cao cấp, thiết kế đột phá và phù hợp với mọi đối tượng người dùng.",
      image:
        "https://img.freepik.com/free-vector/flat-design-paddle-tennis-twitter-header_23-2151030697.jpg",
    },
    {
      id: 6,
      title: "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới",
      date: "20 Tháng 11, 2024",
      author: "Admin",
      excerpt:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt...",
      fullText:
        "Messi kết hợp với thương hiệu Kapolo ra mắt áo đá bóng mới gây sốt cho người hâm mộ. Áo được sản xuất với số lượng giới hạn 10.000 chiếc trên toàn thế giới. Thiết kế kết hợp các yếu tố cổ điển và hiện đại, tạo nên sức hút khó cưỡng.",
      image:
        "https://media.licdn.com/dms/image/v2/C5112AQErnMljR1ceUw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520103659973?e=2147483647&v=beta&t=AWwwss3FuEpLNgT6WDgKIKJVN7_V-5cu7L-hUWhRTt0",
    },
  ];

  return (
    <>
      <section className="blog-page-title mb-4 mb-xl-5">
        <div className="title-bg">
          <img
            loading="lazy"
            src="https://as2.ftcdn.net/v2/jpg/04/00/60/95/1000_F_400609516_qvTueh8qbZOaOB6VLMQjldnpB2jjplMV.jpg"
            width="1780"
            height="520"
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
                <p className="text-gray-700 mt-3">
                  {expandedPosts.includes(post.id) ? post.fullText : post.excerpt}
                </p>
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="text-blue-500 hover:underline mt-4 inline-block"
                >
                  {expandedPosts.includes(post.id) ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
