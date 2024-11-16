



import Headers from "../../../components/headers/Headers";
import MetaComponent from "../../../components/common/MetaComponent";
import DashboardSidebar from "../../../components/otherPages/DashboardSidebar";
import Footers from "../../../components/footers/Footers";
import EditAccount from "../../../components/otherPages/EditAccount";
const metadata = {
  title: "Dashboard Account Edit || Uomo eCommerce Reactjs Template",
  description: "Uomo eCommerce Reactjs Template",
};
export default function AccountEditPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers/>
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Tài khoản của tôi</h2>
          <div className="row">
            <DashboardSidebar />
            <EditAccount />
          </div>
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
