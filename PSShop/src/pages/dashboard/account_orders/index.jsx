
import MetaComponent from './../../../components/common/MetaComponent';
import Headers from './../../../components/headers/Headers';

import AccountOrders from './../../../components/otherPages/AccountOrders';
import Footers from './../../../components/footers/Footers';
import DashboardSidebar from '../../../components/otherPages/DashboardSidebar';
const metadata = {
  title: "Dashboard Account Orders || Uomo eCommerce Reactjs Template",
  description: "Uomo eCommerce Reactjs Template",
};
export default function AccountOrderPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Orders</h2>
          <div className="row">
            <DashboardSidebar />
            <AccountOrders />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
