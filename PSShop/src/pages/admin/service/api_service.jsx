import axios from "./axios_customize";

const LoginAdmin = (Email, Password) => {
  return axios.post("/api/admin/login", { Email, Password });
};

const ListCategories = (page, search = "") => {
  return axios.get(
    `/api/categories/admin?Page=${page}&Search=${encodeURIComponent(search)}`
  ); // Thêm tham số tìm kiếm
};

const AddCategory = (CategoryName) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.post(
    "/api/categories",
    { CategoryName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const GetCategoryById = (CategoryID) => {
  const token = localStorage.getItem("token");
  return axios.get(`/api/categories/${CategoryID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UpdateCategory = (CategoryID, CategoryName) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.put(
    `/api/categories/${CategoryID}`,
    { CategoryName },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    }
  );
};

const DeleteCategories = (ids) => {
  const idsString = Array.isArray(ids) ? ids.join(",") : ids;
  return axios.delete(`/api/categories`, { data: { ids: idsString } });
};

const ListProducts = (page, search = "") => {
  return axios.post(
    `/api/products/admin?Page=${page}&Search=${encodeURIComponent(search)}`
  ); // Thêm tham số tìm kiếm
};

const DeleteProducts = (ids) => {
  const idsString = Array.isArray(ids) ? ids.join(",") : ids;
  return axios.delete(`/api/products`, { data: { ids: idsString } });
};

const AddProduct = (productData) => {
  console.log(productData);
  return axios.post("/api/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const GetProductById = (ProductID, token) => {
  return axios.get(`/api/products/${ProductID}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm token xác thực nếu cần
    },
  });
};
const UpdateProduct = async (ProductID, productData) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.post(`/api/products/${ProductID}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // Thêm token vào header
    },
  });
};

const ListColors = (page) => {
  return axios.get(`/api/colors?Page=${page}`);
};

const DeleteColors = (ColorID) => {
  return axios.delete(`/api/colors/${ColorID}`);
};

const AddColor = (ColorName) => {
  return axios.post("/api/colors", { ColorName });
};

const GetColorById = (ColorID) => {
  return axios.get(`/api/colors/${ColorID}`);
};

const UpdateColor = (ColorID, ColorName) => {
  return axios.put(`/api/colors/${ColorID}`, { ColorName });
};

// Liệt kê tất cả kích thước
const ListSizes = (page) => {
  return axios.get(`/api/sizes?Page=${page}`);
};
const GetSizeById = async (SizeID) => {
  return axios.get(`/api/sizes/${SizeID}`);
};

// Cập nhật kích thưc
const UpdateSize = (SizeID, SizeName) => {
  return axios.put(`/api/sizes/${SizeID}`, { SizeName });
};
// Thêm kích thước mới
const AddSize = (SizeName) => {
  return axios.post("/api/sizes", { SizeName });
};

const DeleteSizes = (SizeID) => {
  return axios.delete(`/api/sizes/${SizeID}`);
};

const AddProductVariant = (variantData) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  console.log(variantData);
  return axios.post("/api/product-variants", variantData, {
    headers: {
      Authorization: `Bearer ${token}`, // Thêm token vào header
    },
  });
};

const GetProductVariants = (ProductID) => {
  return axios.post(`/api/product-variants/productID`, { ProductID }); // Sử dụng POST để gửi ProductID
};
const ListUsers = (page) => {
  return axios.get(`/api/users?page=${page}`);
};

const DeleteProductVariant = (VariantID) => {
  return axios.delete(`/api/product-variants/${VariantID}`);
};

const GetProductVariantById = (VariantID) => {
  return axios.get(`/api/product-variants/${VariantID}`);
};

const UpdateProductVariant = (variantData) => {
  return axios.put(`/api/product-variants`, variantData); // Gửi đến api/product-variants
};

const UpdateProductStatus = (ProductID, data) => {
  return axios.post(`/api/products/status/${ProductID}`, data); // Gửi yêu cầu POST
};

const UpdateCategoryStatus = (CategoryID, data) => {
  return axios.post(`/api/categories/status/${CategoryID}`, data); // Gửi yêu cầu POST
};

const GetUserById = (UserID) => {
  return axios.get(`/api/users/${UserID}`); // Gọi API để lấy chi tiết người dùng
};

const BlockedUser = (UserID) => {
  return axios.delete(`/api/users/${UserID}`); // Sử dụng DELETE để chặn người dùng
};

const UpdateUserStatus = (UserID, data = null) => {
  // Nếu data không được cung cp, gọi API để khôi phục người dùng
  if (!data) {
    return axios.post(`/api/users/restore/${UserID}`); // Gửi yêu cầu POST để khôi phục người dùng
  } else {
    return axios.post(`/api/users/restore/${UserID}`, data); // Gọi API để cập nhật trạng thái người dùng
  }
};

const GetCoupons = () => {
  const token = localStorage.getItem("token");
  return axios.post(
    "/api/coupons/checkCoupon",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const GetCouponDetails = (id) => {
  return axios.get(`/api/coupons/${id}`);
};

const AddVouchers = (voucherData) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.post("/api/coupons", voucherData, {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token trong header
    },
  });
};

const UpdateVouchers = (VoucherID, voucherData) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.put(`/api/coupons/${VoucherID}`, voucherData, {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token trong header
    },
  });
};

const DeleteVouchers = (ids) => {
  const idsString = Array.isArray(ids) ? ids.join(",") : ids; // Chuyển đổi mảng ID thành chuỗi
  return axios.delete(`/api/coupons?ids=${idsString}`); // Gọi API xóa voucher
};

// Hàm để lấy địa chỉ của người dùng dựa trên token
const GetAddressByUserId = async () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.get(`/api/address`, {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token trong header
    },
  });
};
// Hàm để lấy danh sách tỉnh
const GetProvinces = () => {
  return axios.get("/api/provinces");
};

const GetAddressId = (AddressID) => {
  return axios.get(`/api/address/${AddressID}`);
};

// Hàm để lấy danh sách huyện theo ID tỉnh
const GetDistricts = (provinceId) => {
  return axios.post("/api/districts", { province_id: provinceId });
};

// Hàm để lấy danh sách xã theo ID huyện
const GetWards = (districtId) => {
  return axios.post("/api/wards", { district_id: districtId });
};

// Function to update user address
const UpdateAddress = (addressId, addressData) => {
  return axios.put(`/api/address/${addressId}`, addressData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
    },
  });
};

// Hàm để lấy ơn hàng
const GetOrders = async () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.post(
    "/api/order/views",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    }
  );
};

// Hàm để lấy đơn hàng theo ID
const GetOrderById = async (orderId) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.get(`/api/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token trong header
    },
  });
};

const GetOrderDetails = async (orderId) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.get(`/api/order/details/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token trong header
    },
  });
};

const UpdateOrderStatus = (OrderID, OrderStatusID) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return axios.post(
    `/api/order/status/${OrderID}`,
    {
      OrderStatusID: OrderStatusID,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
      },
    }
  );
};

const GetProductStatistics = async (
  TimePeriod,
  startDate,
  endDate,
  productName,
  currentPage
) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return await axios.post(
    "/api/statistics/products-statistics",
    {
      timeFrame: TimePeriod,
      startDate: startDate,
      endDate: endDate,
      ProductName: productName,
      page: currentPage,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
      },
    }
  );
};

const GetProductVariantsStatistics = async (ProductID) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return await axios.get(
    `/api/statistics/product-variants-statistics/${ProductID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
      },
    }
  );
};

const GetOrdersStatistics = async (
  TimePeriod,
  startDate,
  endDate,
  currentPage,
  searchValue
) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  return await axios.post(
    "/api/statistics/orders-statistics",
    {
      timeFrame: TimePeriod,
      startDate: startDate,
      endDate: endDate,
      Page: currentPage,
      OrderCode: searchValue,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const GetUserStatistics = async (
  timePeriod,
  startDate,
  endDate,
  currentPage,
  searchValue
) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    "/api/statistics/user-statistics",
    {
      timeFrame: timePeriod,
      startDate: startDate,
      endDate: endDate,
      page: currentPage,
      UserName: searchValue,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export {
  LoginAdmin,
  ListCategories,
  AddCategory,
  GetCategoryById,
  UpdateCategory,
  DeleteCategories,
  ListProducts,
  DeleteProducts,
  AddProduct,
  GetProductById,
  UpdateProduct,
  ListColors,
  DeleteColors,
  AddColor,
  GetColorById,
  UpdateColor,
  ListSizes,
  AddSize,
  GetSizeById,
  UpdateSize,
  DeleteSizes,
  AddProductVariant,
  GetProductVariants,
  ListUsers,
  DeleteProductVariant,
  GetProductVariantById,
  UpdateProductVariant,
  UpdateProductStatus,
  UpdateCategoryStatus,
  GetUserById,
  BlockedUser,
  UpdateUserStatus,
  GetCoupons,
  GetCouponDetails,
  AddVouchers,
  UpdateVouchers,
  DeleteVouchers,
  GetAddressByUserId,
  GetProvinces, // Thêm hàm lấy tỉnh
  GetDistricts, // Thêm hàm lấy huyện
  GetWards, // Thêm hàm lấy xã
  UpdateAddress, // Add this line to export the function
  GetOrders, // Thêm hàm lấy đơn hàng
  GetOrderById, // Thêm hàm lấy đơn hàng theo ID
  GetOrderDetails, // Thêm hàm lấy chi tiết đơn hàng theo ID
  GetUserStatistics, // Thêm hàm GetUserStatistics vào export
  UpdateOrderStatus, // Thêm hàm UpdateOrderStatus vào export
  GetProductStatistics,
  GetProductVariantsStatistics,
  GetOrdersStatistics,
};
