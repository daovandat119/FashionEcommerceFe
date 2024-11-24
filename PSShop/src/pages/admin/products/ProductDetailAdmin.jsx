/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ProductDetailAdmin = () => {
  const { id } = useParams();
  const [showDescription, setShowDescription] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const product = {
    ProductName: "Áo bóng đá 2024",
    MainImageURL:
      "https://res.cloudinary.com/djjvnmurf/image/upload/v1732009670/f1pprbofk3pqmwoxt9dt.png",
    Description: "Mô tả ngắn về sản phẩm.",
    Price: "123.00",
    SalePrice: "20.00",
    AdditionalImages: [
      "https://res.cloudinary.com/djjvnmurf/image/upload/v1732009673/wrt5rzbq3wzvf0lrzrr9.png",
      "https://res.cloudinary.com/djjvnmurf/image/upload/v1732009676/wdplkumgwysdesva0q1x.png",
      "https://res.cloudinary.com/djjvnmurf/image/upload/v1732009670/f1pprbofk3pqmwoxt9dt.png",
    ],
  };

  // Tính toán phần trăm giảm giá
  const discountPercentage = Math.round(
    ((product.Price - product.SalePrice) / product.Price) * 100
  );

  // Dữ liệu đánh giá tạm thời
  const reviews = [
    { rating: 5, count: 10 },
    { rating: 4, count: 4 },
    { rating: 3, count: 2 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ];

  const totalReviews = reviews.reduce((acc, review) => acc + review.count, 0);
  const averageRating = (
    reviews.reduce((acc, review) => acc + review.rating * review.count, 0) /
    totalReviews
  ).toFixed(1);

  return (
    <>
      <div className="container p-4 justify-center gap-5 w-[100%] flex relative">
        <div className="absolute top-2 left-2 bg-green-500 p-2 rounded-lg font-semibold">
      <Link to="/admin/products" className="mb-4 text-white hover:underline">
         LIST PRODUCTS
        </Link>
      </div>
        <div className="flex flex-row-reverse">
          <div className="w-[70%]">
            <img
              src={product.MainImageURL}
              alt={product.ProductName}
              className="w-[450px] h-[400px] object-cover"
            />
          </div>

          <div className="flex-col  w-[30%]">
            {product.AdditionalImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Additional ${index + 1}`}
                className="w-[130px] h-[130px] mt-1 object-cover border rounded"
              />
            ))}
          </div>
        </div>
        <div className="w-[20%] pl-4">
          <h1 className="text-2xl font-bold">{product.ProductName}</h1>
          <p className="text-xl text-red-500">{product.Price} VND</p>
          <div className="flex items-center">
            <p className="text-gray-500 line-through">
              {product.SalePrice} VND
            </p>
            <span className="bg-yellow-300 text-brown-800 px-2 py-1 rounded-full ml-2">
              -{discountPercentage}%
            </span>
          </div>
          <div className="mt-2">
            <p>Đánh giá trung bình:</p>
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <span key={index} className="text-yellow-500">
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold">Kích cỡ</h2>
            <div className="flex space-x-2">
              <button className="border rounded px-2 py-1">Small</button>
              <button className="border rounded px-2 py-1">Medium</button>
              <button className="border rounded px-2 py-1">Large</button>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold">Màu sắc</h2>
            <div className="flex space-x-2">
              <button className="w-6 h-6 bg-red-500 rounded-full"></button>
              <button className="w-6 h-6 bg-blue-500 rounded-full"></button>
              <button className="w-6 h-6 bg-green-500 rounded-full"></button>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold">Số lượng</h2>
            <div className="flex items-center">
              <button className="border px-2">-</button>
              <input
                type="number"
                className="border w-12 text-center"
                defaultValue="1"
              />
              <button className="border px-2">+</button>
            </div>
          </div>
          <button className="mt-4 bg-black text-white px-4 py-2 rounded">
            Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Phần hiển thị ảnh phụ */}

      <div className="flex justify-center items-center mt-4">
        <button
          className="text-gray-800 px-4 text-2xl py-2 hover:text-gray-500 rounded"
          onClick={() => {
            setShowDescription(true);
            setShowReview(false);
          }}
        >
          Mô tả
        </button>
        <p>|</p>
        <button
          className="text-gray-800 px-4 text-2xl py-2 hover:text-gray-500 rounded"
          onClick={() => {
            setShowDescription(false);
            setShowReview(true);
          }}
        >
          Đánh giá
        </button>
      </div>

      {showDescription && (
        <div className="mt-4 mx-auto w-[65%] bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-semibold text-xl border-b-2 pb-2">
            {product.ProductName}
          </h2>
          <p className="text-lg mt-2">
            <strong>Đặc điểm:</strong> Áo bóng đá được thiết kế với công nghệ
            thấm hút mồ hôi, giúp bạn luôn khô ráo.
          </p>
          <p className="text-lg mt-2">
            <strong>Chất vải:</strong> Chất liệu polyester cao cấp, bền bỉ và
            thoáng khí.
          </p>
          <p className="text-lg mt-2">
            <strong>Mô tả chi tiết:</strong> Áo có kiểu dáng thể thao, phù hợp
            cho các hoạt động ngoài trời và tập luyện.
          </p>
          <p className="text-lg mt-2">
            <strong>Thông tin bổ sung:</strong> Có nhiều kích cỡ và màu sắc để
            lựa chọn, dễ dàng giặt và bảo quản.
          </p>
        </div>
      )}

      {showReview && (
        <div>
          <div className="mt-4 w-[65%] mx-auto bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Đánh giá</h2>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{averageRating}</span>
              <div className="flex ml-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < Math.round(averageRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-500 ml-2">
                ({totalReviews} đánh giá)
              </span>
            </div>
            {reviews.map((review) => (
              <div key={review.rating} className="flex items-center mt-2 ">
                <span className="text-yellow-500 w-[5%]">
                  {review.rating} sao
                </span>
                <div className="w-full bg-gray-300 rounded-full h-2 mx-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full w-[10]"
                    style={{ width: `${(review.count / totalReviews) * 100}%` }}
                  />
                </div>
                <span>
                  ({((review.count / totalReviews) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
          <div className="my-4 mx-auto flex flex-col gap-2 w-[65%] h-[400px] overflow-y-auto px-3 bg-white p-4 rounded-lg shadow-md">
            <div className="border-b-2 border-gray-300 pb-2 flex flex-col gap-2">
              <div className="text-xl flex font-semibold gap-2 ">
                <p>Nguyễn Văn Hưng :</p>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <p className="text-lg w-[85%] ml-3">
                  Sản phẩm oke , mọi người nên mua , nên sử dụng sadnha mọi
                  người ơiSản phẩm oke , mọi người nên mua , nên sử dụng sadnha
                  mọi người ơi{" "}
                </p>
              </div>
              <button
                className="text-gray-500 text-sm text-right"
                onClick={() => setShowInput((prev) => !prev)}
              >
                trả lời
              </button>
              {showInput && (
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    placeholder="Nhập câu trả lời của bạn"
                    className="border rounded px-2 py-1 w-full"
                  />
                  <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded flex items-center">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              )}
            </div>
            <div className="border-b-2 border-gray-300 pb-2 flex flex-col gap-2">
              <div className="text-xl flex font-semibold gap-2 ">
                <p>Anh Hải :</p>
                <div className="flex">
                  {[...Array(1)].map((_, index) => (
                    <span key={index} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <p className="text-lg w-[85%] ml-3">Như Lồn</p>
              </div>
              <button
                className="text-gray-500 text-sm text-right"
                onClick={() => setShowInput((prev) => !prev)}
              >
                trả lời
              </button>
              {showInput && (
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    placeholder="Nhập câu trả lời của bạn"
                    className="border rounded px-2 py-1 w-full"
                  />
                  <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded flex items-center">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailAdmin;
