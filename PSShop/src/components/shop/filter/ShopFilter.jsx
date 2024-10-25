import { useEffect, useRef } from "react";
import { closeModalShopFilter } from "../../../utlis/aside";
import FilterAll from "./FilterAll";

export default function ShopFilter() {
  const pageOverlayRef = useRef(null);

  useEffect(() => {
    const pageOverlay = pageOverlayRef.current;

    if (pageOverlay) {
      const handleClickOutside = () => {
        closeModalShopFilter();
      };

      pageOverlay.addEventListener("click", handleClickOutside);

      return () => {
        if (pageOverlay) {
          pageOverlay.removeEventListener("click", handleClickOutside);
        }
      };
    } else {
      console.error("Element with id 'pageOverlay' not found.");
    }
  }, []);

  return (
    <div className="aside-filters aside aside_right" id="shopFilterAside">
      <div className="aside-header d-flex align-items-center">
        <h3 className="text-uppercase fs-6 mb-0">Filter By</h3>
        <button
          onClick={() => closeModalShopFilter()}
          className="btn-close-lg js-close-aside btn-close-aside ms-auto"
        />
      </div>
      {/* /.aside-header */}
      <div className="aside-content" ref={pageOverlayRef}>
        <FilterAll />
      </div>
      {/* /.aside-content */}
    </div>
  );
}
