import { toast } from "react-hot-toast";

export default function CouponStore({
  onApplyCoupon,
  totalPrice,
  isOpen,
  onClose,
  coupons = [],
  isLoading = false,
}) {
  if (!isOpen) return null;

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Drawer */}
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="px-4 py-6 bg-gray-50 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Kho Mã Giảm Giá
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Đóng</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 py-6 px-4 sm:px-6 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                ) : coupons.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Không có mã giảm giá nào khả dụng
                  </p>
                ) : (
                  <div className="space-y-4">
                    {coupons.filter(coupon => coupon.UsageLimit > 0).map((coupon) => (
                      <div
                        key={coupon.CouponID}
                        className={`border rounded-lg p-4 relative ${
                          coupon.usable && !isExpired(coupon.ExpiresAt)
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                        } ${isExpired(coupon.ExpiresAt) ? "opacity-60" : ""}`}
                      >
                        {isExpired(coupon.ExpiresAt) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-500 text-white px-4 py-2 rounded-lg transform rotate-[-15deg] font-bold text-lg shadow-lg">
                              HẾT HẠN
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {coupon.Name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Giảm: {coupon.DiscountPercentage}%
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Giảm tối đa: {Number(coupon.MaxAmount).toLocaleString()} VND
                            </p>
                            {coupon.MinimumOrderValue && (
                              <p className="text-sm text-gray-500 mt-1">
                                Đơn tối thiểu:{" "}
                                {Number(
                                  coupon.MinimumOrderValue
                                ).toLocaleString()}
                                VND
                              </p>
                            )}
                            {coupon.ExpiresAt && (
                              <p
                                className={`text-sm mt-1 ${
                                  isExpired(coupon.ExpiresAt)
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {isExpired(coupon.ExpiresAt)
                                  ? `Đã hết hạn từ: ${new Date(
                                      coupon.ExpiresAt
                                    ).toLocaleDateString("vi-VN")}`
                                  : `Hết hạn: ${new Date(
                                      coupon.ExpiresAt
                                    ).toLocaleDateString("vi-VN")}`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (coupon.usable && !isExpired(coupon.ExpiresAt)) {
                                if (totalPrice >= coupon.MinimumOrderValue) {
                                  onApplyCoupon(coupon);
                                  onClose();
                                } else {
                                  toast.error("Cần thêm " + 
                                    (coupon.MinimumOrderValue - totalPrice).toLocaleString() + 
                                    " VND để sử dụng mã này");
                                }
                              } else {
                                toast.error("Mã giảm giá không khả dụng.");
                              }
                            }}
                            disabled={!coupon.usable || isExpired(coupon.ExpiresAt)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              coupon.usable && !isExpired(coupon.ExpiresAt)
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {isExpired(coupon.ExpiresAt)
                              ? "Đã hết hạn"
                              : coupon.usable
                              ? "Áp dụng"
                              : "Chưa đủ điều kiện"}
                          </button>
                        </div>
                        {!coupon.usable &&
                          !isExpired(coupon.ExpiresAt) &&
                          coupon.MinimumOrderValue > totalPrice && (
                            <p className="text-sm text-red-500 mt-2">
                              Cần thêm{" "}
                              {Number(
                                coupon.MinimumOrderValue - totalPrice
                              ).toLocaleString()}
                              VND để sử dụng mã này
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


