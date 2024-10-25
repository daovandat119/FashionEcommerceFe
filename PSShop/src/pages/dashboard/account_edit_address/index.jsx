import MetaComponent from "../../../components/common/MetaComponent";
import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import DashboardSidebar from "../../../components/otherPages/DashboardSidebar";
import EditAddress from "../../../components/otherPages/EditAddress";

const metadata = {
  title: "Dashboard Edit Address || Uomo eCommerce Reactjs Template",
  description: "Uomo eCommerce Reactjs Template",
};
export default function AccountEditAddressPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Addresses</h2>
          <div className="row">
            <DashboardSidebar />
            <EditAddress />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
