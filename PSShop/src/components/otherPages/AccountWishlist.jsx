import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function AccountWishlist() {
  const { 
    wishlistProducts, 
    removeFromWishlist, 
    fetchWishlistItems,
    loading 
  } = useContextElement();

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy"
      });

      if (result.isConfirmed) {
        await removeFromWishlist(wishlistId);
        await fetchWishlistItems(); // Cập nhật lại danh sách sau khi xóa
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Đã có lỗi xảy ra khi xóa sản phẩm",
        icon: "error"
      });
    }
  };

  if (loading) {
    return (
      <div className="col-lg-9">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__wishlist">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((item) => (
              <div key={item.WishlistID} className="relative group">
                <div className="relative bg-white rounded-lg shadow-sm overflow-hidden 
                  transition-shadow duration-300 hover:shadow-md max-w-[280px] mx-auto
                  border border-gray-200">
                  {/* Nút xóa */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.WishlistID)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center 
                      bg-white rounded-full shadow-md hover:bg-red-50 
                      transition-all duration-300 group"
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    <i className="fas fa-times text-red-500 group-hover:scale-110 
                      transition-transform duration-300"></i>
                  </button>

                  {/* Ảnh sản phẩm - Thêm viền */}
                  <Link 
                    to={`/shop-detail/${item.ProductID}`} 
                    className="block relative pt-[100%] overflow-hidden
                      border-b border-gray-100">
                    <img
                      src={item.MainImageURL}
                      alt={item.ProductName}
                      className="absolute inset-0 w-full h-full object-cover 
                        transition-transform duration-300 group-hover:scale-105
                        p-2"
                      loading="lazy"
                    />
                  </Link>

                  {/* Thông tin sản phẩm */}
                  <div className="p-3 bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">
                      {item.category_name}
                    </div>
                    <h2 className="text-sm font-medium mb-1 line-clamp-2">
                      <Link 
                        to={`/shop-detail/${item.ProductID}`}
                        className="text-gray-800 hover:text-gray-600 transition-colors"
                      >
                        {item.ProductName}
                      </Link>
                    </h2>
                    <div className="text-base font-semibold text-gray-900">
                      ${item.Price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-lg mb-4">
              Chưa có sản phẩm nào trong danh sách yêu thích
            </div>
            <Link 
              to="/shop" 
              className="inline-block px-6 py-2 bg-black text-white rounded-lg
                hover:bg-gray-800 transition-colors duration-300"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
