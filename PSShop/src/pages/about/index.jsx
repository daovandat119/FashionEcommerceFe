import Footers from "../../components/footers/Footers";

import Headers from "../../components/headers/Headers";
import About from "../../components/otherPages/about/About";

import Support from "../../components/supports/Support";
import Clients from "../../components/otherPages/about/Clients";



export default function AboutPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />

        <Support/>
      

       
        <Clients/>

      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}


