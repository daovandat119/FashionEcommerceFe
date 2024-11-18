import Headers from './../../../components/headers/Headers';
import AccountOrders from './../../../components/otherPages/AccountOrders';
import Footers from './../../../components/footers/Footers';
import DashboardSidebar from '../../../components/otherPages/DashboardSidebar';
import { OrderProvider } from '../../../components/otherPages/OrderContext';

export default function AccountOrderPage() {
  return (
    <>

      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Đơn hàng </h2>
          <div className="row">
            <DashboardSidebar />
            <OrderProvider>
            <AccountOrders />
           </OrderProvider>
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
