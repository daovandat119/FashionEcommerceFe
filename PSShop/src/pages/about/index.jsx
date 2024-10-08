import Footers from "../../components/footers/Footers";

import Headers from "../../components/headers/Headers";
import About from "../../components/otherPages/about/About";
import Clients from "../../components/otherPages/about/Clients";
import Services from "../../components/otherPages/about/Services";

export default function AboutPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />
        <Services />
        <Clients/>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}


