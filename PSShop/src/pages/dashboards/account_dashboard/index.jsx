import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import Dashboard1 from "../../../components/otherPages/Dashboard1";
import DashboardSidebar from "../../../components/otherPages/DashboardSidebar";

export default function AccountPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">My Account</h2>
          <div className="row">
          <DashboardSidebar />
            <Dashboard1 />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
