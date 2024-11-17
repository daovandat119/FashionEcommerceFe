// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from "react";
import { LoginContext } from "../../components/login/LoginContext"; // Import LoginContext
import { ToastContainer, toast } from "react-toastify"; // Thêm ToastContainer và toast
import Headers from "../../components/headers/Headers";
import Banners from "../../components/banners/Banners";
import Footers from "../../components/footers/Footers";
import Products_Limited from "../../components/showproducts/Products_Limited";
import Support from "../../components/supports/Support";
import Products_Trendy from "../../components/showproducts/Products_Trendy";
import BlogCards from "../../components/blogcards/BlogCards";
import CountDown from "../../components/cowndown/CountDown";

const HomePages = () => {
  const { successMessage, errorMessage } = useContext(LoginContext); // Sử dụng LoginContext

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage); // Sử dụng toast để hiển thị thông báo thành công
    }

    if (errorMessage) {
      toast.error(errorMessage); // Sử dụng toast để hiển thị thông báo lỗi
    }
  }, [successMessage, errorMessage]); // Theo dõi sự thay đổi của successMessage và errorMessage

  return (
    <div>
      <ToastContainer /> {/* Thêm ToastContainer vào đây */}
      <Headers />
      <Banners />
      <br />
      <BlogCards />
      <br />
      <Products_Trendy />
      <br />
      <CountDown />
      <br />
      <br />
      <Products_Limited />
      <Support />
      <Footers />
    </div>
  );
};

export default HomePages;
