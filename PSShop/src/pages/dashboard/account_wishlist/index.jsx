import MetaComponent from "../../../components/common/MetaComponent";
import Headers from "../../../components/headers/Headers";
import DashboardSidebar from './../../../components/otherPages/DashboardSidebar';
import AccountWishlist from './../../../components/otherPages/AccountWishlist';
import Footers from "../../../components/footers/Footers";

const metadata = {
  title: "Dashboard Account Wishlist || Uomo eCommerce Reactjs Template",
  description: "Uomo eCommerce Reactjs Template",
};
export default function AccountWishlistPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Sản phẩm yêu thích</h2>
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
