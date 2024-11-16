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

      
        await removeFromWishlist(wishlistId);
        await fetchWishlistItems(); // Cập nhật lại danh sách sau khi xóa
      
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

 // ... existing code ...
return (
  <div className="col-lg-9">
    <div className="page-content my-account__wishlist">
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistProducts.map((item) => (
            <div key={item.WishlistID} className="relative group transition-transform transform ">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden 
                transition-shadow duration-300 hover:shadow-2xl max-w-[320px] mx-auto border border-gray-300">
                {/* Nút xóa */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.WishlistID)}
                  className="absolute top-2  right-2 z-10 w-6  h-6 flex items-center justify-center 
                    bg-red-600 rounded-full shadow-md hover:bg-red-700 
                    transition-all duration-300"
                  title="Xóa khỏi danh sách yêu thích"
                >
                  <i className="fas fa-times text-white"></i>
                </button>

                {/* Ảnh sản phẩm */}
                <Link 
                  to={`/shop-detail/${item.ProductID}`} 
                  className="block relative pt-[100%] overflow-hidden border-b border-gray-200">
                  <img
                    src={item.MainImageURL}
                    alt={item.ProductName}
                    className="absolute inset-0 w-full h-full"
                  />
                </Link>

                {/* Thông tin sản phẩm */}
               <div className="mb-3 justify-center  flex align-items-center gap-3">
                    <div className="text-xs font-light">
                      {item.category_name}
                    </div>
                    <h2 className="text-lg font-semibold  text-gray-900">
                      <Link 
                        to={`/shop-detail/${item.ProductID}`}
                        className="text-dark"
                      >
                        {item.ProductName}
                      </Link>
                    </h2>
                    <div className="text-lg font-bold text-gray-900">
                      ${item.Price}
                    </div>
                  </div>
                </div>
              </div>
          ))} 
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-2xl mb-4 font-semibold text-gray-700">
            Danh sách yêu thích trống
          </div>
          <Link 
            to="/shop" 
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors duration-300"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  </div>
);
// ... existing code ...
}
