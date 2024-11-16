// src/pages/ProductDetailsPage2.jsx hoặc nơi bạn muốn sử dụng Tabs

// import { Tabs, Tab } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import Products_Detail from "../Products_Detail";
import RelatedSlider from "../RelatedSlider";

import Headers from "../../headers/Headers";
import Footers from "../../footers/Footers";
// import { allProducts } from "../../../data/products";
import MetaComponent from '../../common/MetaComponent';
import { useEffect, useState } from "react";

const metadata = {
  title: "Pro Shirt Shop",
  description: "Wellcome",
};

export default function ProductDetailsPage2() {
  let params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
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
