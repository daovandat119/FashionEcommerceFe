import { Link } from "react-router-dom";


export default function Nav() {
 
  return (
    <>
      <li className="navigation__item">
        <a href="/" className={`navigation__link`}>
          Home
        </a>
      </li>
      <li className="navigation__item">
        <a href="/shop" className={`navigation__link`}>
          Sản phẩm
        </a>
      </li>
      <li className="navigation__item">
        <a href="/blogs" className={`navigation__link`}>
          Blog
        </a>
      </li>
      <li className="navigation__item">
        <Link to="/about" className={`navigation__link`}>
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