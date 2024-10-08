import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import OrderTrack from "../../../components/shopCartandCheckout/OrderTrack";

export default function ShopOrderTrackingPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <OrderTrack />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
