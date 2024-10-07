import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  useLocation();

  return (
    <>
      <li className="navigation__item">
        <a href="#" className={`navigation__link`}>
          Home
        </a>
      </li>

      <li className="navigation__item">
        <a href="#" className={`navigation__link`}>
          Shop
        </a>
      </li>

      <li className="navigation__item">
        <a href="#" className={`navigation__link`}>
          Blog
        </a>
      </li>

      <li className="navigation__item">
        <a href="#" className={`navigation__link`}>
          Pages
        </a>
      </li>

      <li className="navigation__item">
        <Link to="/about" className={`navigation__link` }>
          About
        </Link>
      </li>

      <li className="navigation__item">
        <Link to="/contact" className={`navigation__link`}>
          Contact
        </Link>
      </li>
    </>
  );
}
