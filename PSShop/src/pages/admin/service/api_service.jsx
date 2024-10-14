
import axios from "./axios_customize";

const LoginAdmin = (Email, Password) => {
  const URL_BACKEND = "/api/login";
  const data = {
    Email: Email,
    Password: Password,
  };
  return axios.post(URL_BACKEND, data);
};

const ListCategories = () => {
  const URL_BACKEND = "/api/categories";
 return axios.get(URL_BACKEND)
};

export {LoginAdmin ,ListCategories};
