import Headers from './../../../components/headers/Headers';
import Footers from './../../../components/footers/Footers';
import DashboardSidebar from './../../../components/otherPages/DashboardSidebar';
import Dashboards from '../../../components/otherPages/Dashboards';

export default function AccountPage() {
  return (
    <>
    
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Tài khoản của tôi</h2>
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
