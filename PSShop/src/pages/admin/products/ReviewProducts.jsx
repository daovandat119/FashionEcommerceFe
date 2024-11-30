import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ReviewsProducts() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async (id) => {
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

  useEffect(() => {
    fetchReviews(id);
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/reviews",
        {
          ProductID: id,
          ReviewContent: replyContent.trim(),
          ParentReviewID: replyTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setReplyContent("");
      setReplyTo(null);
      fetchReviews(id);
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
            index < (interactive ? hoverRating : rating)
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Đánh giá sản phẩm</h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.ReviewID}
            className="flex gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
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
                <h6 className="font-semibold text-lg">{review.Username}</h6>
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
              <button
                onClick={() =>
                  setReplyTo(
                    replyTo === review.ReviewID ? null : review.ReviewID
                  )
                }
                className="text-blue-500 mt-2 flex items-center justify-end w-full hover:underline"
              >
                Trả lời
              </button>
              {replyTo === review.ReviewID && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, review.ReviewID)}
                  className="mt-2"
                >
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập nội dung trả lời..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-600 text-white py-1 px-4 rounded-md flex hover:bg-blue-700 transition-colors duration-200"
                  >
                    Gửi
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
