// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../components/login/LoginContext"; // Import LoginContext
import { toast } from "react-toastify"; // Chỉ import toast
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
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    // Giả lập loading trong 1 giây
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    if (successMessage) {
      toast.success(successMessage); // Sử dụng toast để hiển thị thông báo thành công
    }

    if (errorMessage) {
      toast.error(errorMessage); // Sử dụng toast để hiển thị thông báo lỗi
    }
  }, [successMessage, errorMessage]); // Theo dõi sự thay đổi của successMessage và errorMessage

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Lấy token từ query params
    if (token) {
        localStorage.setItem('token', token); // Lưu token vào localStorage
    }
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <Headers />
      <Banners />
      <BlogCards />
      <br /><br />
      <Products_Trendy />
      <CountDown />
      <br /><br />
      <Products_Limited />
      <Support />
      <Footers />
    </div>
  );
};

export default HomePages;
