import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <>
      <li className="navigation__item">
        <Link
          to="/"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Trang chủ
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          to="/shop"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Sản phẩm
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          to="/blogs"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Bài viết
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          to="/about"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Giới thiệu
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          to="/contact"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Liên hệ
        </Link>
      </li>
    </>
  );
}