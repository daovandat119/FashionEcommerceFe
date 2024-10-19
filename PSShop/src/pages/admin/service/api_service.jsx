import axios from "./axios_customize";

const LoginAdmin = (Email, Password) => {
  return axios.post("/api/login", { Email, Password });
};

const ListCategories = (page) => {
  return axios.get(`/api/categories?Page=${page}`);
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

const ListProducts = (page) => {
  return axios.get(`/api/products?Page=${page}`);
};

// Thêm hàm DeleteProducts
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

// Thêm các hàm mới này nếu chưa có
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

// Cập nhật kích thước
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
};
