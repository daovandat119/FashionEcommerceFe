import { useParams } from "react-router-dom";
import Products_Detail from "../Products_Detail";
import RelatedSlider from "../RelatedSlider";
import Headers from "../../headers/Headers";
import Footers from "../../footers/Footers";
import MetaComponent from '../../common/MetaComponent';
import { useEffect, useState } from "react";

const metadata = {
  title: "Pro Shirt Shop",
  description: "Wellcome",
};

export default function ProductDetailsPage2() {
  let params = useParams();
  const productId = params.id;
  const [product] = useState(null);

  useEffect(() => {
    // Bỏ phần gọi API ở đây nếu đã có trong Products_Detail.jsx
    // const fetchProduct = async () => {
    //   ...
    // };

    // fetchProduct();
  }, [productId]);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
          <Products_Detail product={product} />
        <RelatedSlider />
        <br />
      </main>
      <Footers />
    </>
  );
}
