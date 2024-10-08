import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import ChectoutSteps from "../../../components/shopCartandCheckout/ChectoutSteps";
import OrderCompleted from "../../../components/shopCartandCheckout/OrderCompleted";

export default function ShopOrderConplate() {
  return (
    <>
    
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="shop-checkout container">
          <h2 className="page-title">ORDER RECEIVED</h2>
          <ChectoutSteps />
          <OrderCompleted />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
