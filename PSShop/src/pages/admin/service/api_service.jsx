import axios from "./axios_customize";

const LoginAdmin = (Email, Password) => {
  return axios.post("/api/admin/login", { Email, Password });
};

const ListCategories = (page, search = "") => {
  return axios.get(
    `/api/categories?Page=${page}&Search=${encodeURIComponent(search)}`
  ); // Thêm tham số tìm kiếm
};

const AddCategory = (CategoryName) => {
  return axios.post("/api/categories", { CategoryName });
};

const GetCategoryById = (CategoryID) => {
  return axios.get(`/api/categories/${CategoryID}`);
};

const UpdateCategory = (CategoryID, CategoryName) => {
  return axios.put(`/api/categories/${CategoryID}`, { CategoryName });
};

const DeleteCategories = (ids) => {
  const idsString = Array.isArray(ids) ? ids.join(",") : ids;
  return axios.delete(`/api/categories`, { data: { ids: idsString } });
};

const ListProducts = (page, search = "") => {
  return axios.get(
    `/api/products?Page=${page}&Search=${encodeURIComponent(search)}`
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

const GetProductById = (ProductID) => {
  return axios.get(`/api/products/${ProductID}`);
};

const UpdateProduct = async (ProductID, productData) => {
  return axios.post(`/api/products/${ProductID}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
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
  console.log(variantData);
  return axios.post("/api/product-variants", variantData);
};

const GetProductVariants = (ProductID) => {
  return axios.post(`/api/product-variants/productID`, { ProductID });
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
  // Nếu data không được cung cấp, gọi API để khôi phục người dùng
  if (!data) {
    return axios.post(`/api/users/restore/${UserID}`); // Gửi yêu cầu POST để khôi phục người dùng
  } else {
    return axios.post(`/api/users/restore/${UserID}`, data); // Gọi API để cập nhật trạng thái người dùng
  }
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
  UpdateUserStatus
};
