import Footers from "../../components/footers/Footers";

import Headers from "../../components/headers/Headers";
import About from "../../components/otherPages/about/About";
<<<<<<< HEAD
import Support from "../../components/supports/Support";

// import MetaComponent from "@/components/common/MetaComponent";
// const metadata = {
//   title: "About || Uomo eCommerce Reactjs Template",
//   description: "Uomo eCommerce Reactjs Template",
// };
=======
import Clients from "../../components/otherPages/about/Clients";
import Services from "../../components/otherPages/about/Services";

>>>>>>> c7dabb2458b847d936d482cfed38f9eed087e108
export default function AboutPage() {
  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />
<<<<<<< HEAD
        <Support/>
      
=======
        <Services />
        <Clients/>
>>>>>>> c7dabb2458b847d936d482cfed38f9eed087e108
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}


