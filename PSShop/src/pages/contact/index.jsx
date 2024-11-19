import Contact from "../../components/contact/Contact";
import Footers from "../../components/footers/Footers";
import Headers from "../../components/headers/Headers";

export default function ContactPage() {
  return (
    <>

      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="contact-us container">
          <div className="mw-930">
            <h2 className="page-title">CONTACT US</h2>
          </div>
        </section>

        <section className="google-map mb-5">
          <h2 className="d-none">Contact US</h2>
        </section>
        <Contact />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
