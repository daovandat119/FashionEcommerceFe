import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import DashboardSidebar from "../../../components/otherPages/DashboardSidebar";
import EditAddress from "../../../components/otherPages/EditAddress";

export default function AccountEditAddressPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        
        <section className="my-account container">
          <h2 className="page-title">Địa chỉ</h2>
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
