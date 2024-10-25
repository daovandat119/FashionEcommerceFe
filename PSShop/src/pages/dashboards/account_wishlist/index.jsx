import Footers from "../../../components/footers/Footers";

import Headers from "../../../components/headers/Headers";
import AccountWishlist from "../../../components/otherPages/AccountWishlist";
import DashboardSidebar from "../../../components/otherPages/DashboardSidebar";


export default function AccountWishlistPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Wishlist</h2>
          <div className="row">
            <DashboardSidebar />
            <AccountWishlist />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
