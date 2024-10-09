import { Link, useLocation } from "react-router-dom";
import { shopList } from "../../../data/menu";
import { shopDetails } from "../../../data/menu";
import { additionalShopPageitems } from "../../../data/menu";

export default function Nav() {
  useLocation();
  const { pathname } = useLocation();

  const isMenuActive = (menu) => {
    return menu.split("/")[1] == pathname.split("/")[1];
  };
  const isActiveParentMenu = (menus) => {
    return menus.some(
      (menu) => menu.href.split("/")[1] == pathname.split("/")[1]
    );
  };
  return (
    <>
      <li className="navigation__item">
        <a href="/" className={`navigation__link`}>
          Home
        </a>
      </li>
      <li className="navigation__item">
        <a href="/shop" className={`navigation__link`}>
          Shop
        </a>
      </li>

      <li className="navigation__item">
        <a href="blogs" className={`navigation__link`}>
          Blog
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
