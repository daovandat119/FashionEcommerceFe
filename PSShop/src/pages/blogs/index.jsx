import Blog1 from "../../components/blogcards/Blogs1";
import Footers from "../../components/footers/Footers";
import Headers from "../../components/headers/Headers";

export default function BlogPage1() {
  return (
    <>

      <Headers />
      <main className="page-wrapper">
        <Blog1 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
