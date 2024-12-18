import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [ratingLength, setRatingLength] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [canReview, setCanReview] = useState({
    checkOrder: false,
    checkReview: false,
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reviews/${id}`
      );
      if (response.data?.data) {
        setReviews(response.data.data);
      }
    } catch (error) {
      setReviews([]);
    }
  };

  const checkReviewPermission = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCanReview({ checkOrder: false, checkReview: false });
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/reviews/checkReview",
        { ProductID: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data?.data) {
        setCanReview(response.data.data);
      }
    } catch {
      setCanReview({ checkOrder: false, checkReview: false });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchReviews(), checkReviewPermission()]);
      setIsLoading(false);
    };

    initializeData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!ratingLength || !reviewContent.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/reviews",
        {
          ProductID: id,
          RatingLevelID: ratingLength,
          ReviewContent: reviewContent.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRatingLength(0);
      setReviewContent("");

      await checkReviewPermission();

      Swal.fire({
        title: "Thông báo",
        text: "Đánh giá của bạn đã được gửi thành công!",
        icon: "success",
        timer: 10000,
      });

      fetchReviews();
    } catch (error) {
      console.log(error);
    }
  };

  const StarRating = ({ rating, size = "w-5 h-5", interactive = false }) => (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`${size} ${
            interactive ? "cursor-pointer transition-colors duration-200" : ""
          } ${
            index < (interactive ? hoverRating || ratingLength : rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300 fill-current hover:text-yellow-400"
          }`}
          viewBox="0 0 24 24"
          {...(interactive
            ? {
                onClick: () => setRatingLength(index + 1),
                onMouseEnter: () => setHoverRating(index + 1),
                onMouseLeave: () => setHoverRating(0),
              }
            : {})}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.ReviewID}
            className="flex gap-4 p-4 bg-white rounded-lg shadow"
          >
            <div className="flex-shrink-0">
              <img
                src={review.image || "/assets/images/avatar.jpg"}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h6 className="font-semibold">{review.Username}</h6>
                <StarRating rating={review.RatingLevelID} />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(review.created_at).toLocaleDateString("vi-VN")}
              </div>
              <p className="text-gray-700">{review.ReviewContent}</p>
              <div className="mt-4">
                {review.children &&
                  review.children.map((reply) => (
                    <div
                      key={reply.ReviewID}
                      className="flex gap-4 p-2 bg-gray-100 rounded-lg mt-2"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={reply.image || "/assets/images/avatar.jpg"}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h6 className="font-semibold">{reply.Username}</h6>
                        </div>
                        <p className="text-gray-700">{reply.ReviewContent}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && canReview?.checkOrder && !canReview?.checkReview && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <h5 className="text-xl font-semibold mb-4">
              Viết đánh giá của bạn
            </h5>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn *
              </label>
              <StarRating
                rating={ratingLength}
                size="w-8 h-8"
                interactive={true}
              />
            </div>

            <div>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập nội dung đánh giá của bạn (tối thiểu 10 ký tự)"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows="6"
                required
                minLength="10"
              />
            </div>

            <button
              type="submit"
              disabled={!ratingLength || !reviewContent.trim()}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !ratingLength || !reviewContent.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              }`}
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
