import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <>
      <li className="navigation__item">
        <a
          href="/"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Trang chủ
        </a>
      </li>
      <li className="navigation__item">
        <a
          href="/shop"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Sản phẩm
        </a>
      </li>
      <li className="navigation__item">
        <a
          href="/blogs"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Blog
        </a>
      </li>
      <li className="navigation__item">
        <Link
          to="/about"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          About
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          to="/contact"
          className="navigation__link text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Liên hệ
        </Link>
      </li>
    </>
  );
}
