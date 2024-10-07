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
        <a href="#" className={`navigation__link`}>
          Home
        </a>
      </li>
      <li className="navigation__item">
        <a
          href="#"
          className={`navigation__link
           ${isActiveParentMenu(shopList) ? "menu-active" : ""}
           ${isActiveParentMenu(shopDetails) ? "menu-active" : ""}
           ${isActiveParentMenu(additionalShopPageitems) ? "menu-active" : ""}
          `}
        >
          Shop
        </a>
        <div className="mega-menu">
          <div className="container d-flex">
            <div className="col pe-4">
              <a href="#" className="sub-menu__title">
                Shop List
              </a>
              <ul className="sub-menu__list list-unstyled">
                {shopList.map((elm, i) => (
                  <li key={i} className="sub-menu__item">
                    <Link
                      to={elm.href}
                      className={`menu-link menu-link_us-s ${
                        isMenuActive(elm.href) ? "menu-active" : ""
                      }`}
                    >
                      {elm.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col pe-4">
              <a href="#" className="sub-menu__title">
                Shop Detail
              </a>
              <ul className="sub-menu__list list-unstyled">
                {shopDetails.map((elm, i) => (
                  <li key={i} className="sub-menu__item">
                    <Link
                      to={elm.href}
                      className={`menu-link menu-link_us-s ${
                        isMenuActive(elm.href) ? "menu-active" : ""
                      }`}
                    >
                      {elm.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col pe-4">
              <a href="#" className="sub-menu__title">
                Other Pages
              </a>
              <ul className="sub-menu__list list-unstyled">
                {additionalShopPageitems.map((elm, i) => (
                  <li key={i} className="sub-menu__item">
                    <Link
                      to={elm.href}
                      className={`menu-link menu-link_us-s ${
                        isMenuActive(elm.href) ? "menu-active" : ""
                      }`}
                    >
                      {elm.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mega-menu__media col">
              <div className="position-relative">
                <img
                  loading="lazy"
                  className="mega-menu__img"
                  src="/assets/images/mega-menu-item.jpg"
                  width={902}
                  height={990}
                  style={{ height: "fit-content" }}
                  alt="New Horizons"
                />
                <div className="mega-menu__media-content content_abs content_left content_bottom">
                  <h3>NEW</h3>
                  <h3 className="mb-0">HORIZONS</h3>
                  <Link
                    to="/shop-1"
                    className="btn-link default-underline fw-medium"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- /.container d-flex --> */}
        </div>
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
