import Headers from './../../../components/headers/Headers';
import Footers from './../../../components/footers/Footers';
import MetaComponent from "../../../components/common/MetaComponent";
import DashboardSidebar from './../../../components/otherPages/DashboardSidebar';
import Dashboards from '../../../components/otherPages/Dashboards';
const metadata = {
  title: "Dashboard-account || Uomo eCommerce Reactjs Template",
  description: "Uomo eCommerce Reactjs Template",
};
export default function AccountPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">My Account</h2>
          <div className="row">
            <DashboardSidebar />
            <Dashboards />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
