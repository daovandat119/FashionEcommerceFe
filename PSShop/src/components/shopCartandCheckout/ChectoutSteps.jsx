import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";


const steps = [
  {
    id: 1,
    href: "/shop_cart",
    number: "01",
    title: "Giỏ hàng",
    description: "Quản lý danh mục",
  },
  {
    id: 2,
    href: "/shop_checkout",
    number: "02",
    title: "Vận chuyển và thanh toán",
    description: "Kiểm tra danh sách các đơn hàng ",
  },
  {
    id: 3,
    href: "/shop_order_complete",
    number: "03",
    title: "Xác nhận",
    description: "Kiểm tra và gửi đơn hàng ",
  },
];

export default function ChectoutSteps() {
  const [activePathIndex, setactivePathIndex] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const activeTab = steps.filter((elm) => elm.href === pathname)[0];
    const activeTabIndex = steps.indexOf(activeTab);
    setactivePathIndex(activeTabIndex);
  }, [pathname]);

  const handleStepClick = (e, href) => {
    e.preventDefault();
    
    // Luôn cho phép quay lại giỏ hàng
    if (href === "/shop_cart") {
      navigate(href);
      return;
    }

    // Chỉ cho phép đi tới checkout nếu đang ở giỏ hàng
    if (href === "/shop_checkout" && activePathIndex === 0) {
      // toast.warning("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
      // navigate("/shop");
      return;
    }

    // Không cho phép truy cập trực tiếp vào trang order complete
    if (href === "/shop_order_complete") {
      return;
    }
  };

  return (
    <div className="checkout-steps">
      {steps.map((elm, i) => (
        <Link
          key={i}
          to={elm.href}
          onClick={(e) => handleStepClick(e, elm.href)}
          className={`checkout-steps__item ${
            activePathIndex >= i ? "active" : ""
          } ${
            (elm.href === "/shop_order_complete" || 
             (elm.href === "/shop_checkout" && activePathIndex < 0))
            ? "disabled"
            : ""
          }`}
        >
          <span className="checkout-steps__item-number">{elm.number}</span>
          <span className="checkout-steps__item-title">
            <span>{elm.title}</span>
            <em>{elm.description}</em>
          </span>
        </Link>
      ))}
    </div>
  );
}
