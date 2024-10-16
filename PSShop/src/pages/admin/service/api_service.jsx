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

export { LoginAdmin, ListCategories, AddCategory };
