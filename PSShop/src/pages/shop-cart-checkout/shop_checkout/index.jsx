import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import Checkout from "../../../components/shopCartandCheckout/Checkout";
import ChectoutSteps from "../../../components/shopCartandCheckout/ChectoutSteps";


export default function ShopCheckoutPage() {
  return (
    <>

      <Headers />
      <main className="page-wrapper">
        
        <section className="shop-checkout container">
          <h2 className="page-title">Shipping and Checkout</h2>
          <ChectoutSteps />
          <Checkout />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
