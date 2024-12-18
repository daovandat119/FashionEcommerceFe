import Footers from "../../../components/footers/Footers";
import Headers from "../../../components/headers/Headers";
import Cart from "../../../components/shopCartandCheckout/Cart";
import ChectoutSteps from "../../../components/shopCartandCheckout/ChectoutSteps";


export default function ShopCartPage() {
  return (
    <>
      
      <Headers/>
      <main className="page-wrapper">
        
        <section className="shop-checkout container">
          <h2 className="page-title">Giỏ hàng</h2>
          <ChectoutSteps />
          <Cart />
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
