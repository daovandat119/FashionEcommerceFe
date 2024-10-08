// src/pages/ProductDetailsPage2.jsx hoặc nơi bạn muốn sử dụng Tabs

import { Tabs, Tab } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import Products_Detail from "../Products_Detail";
import RelatedSlider from "../RelatedSlider";

import Headers from "../../headers/Headers";
import Footers from "../../footers/Footers";
import { allProducts } from "../../../data/products";
import MetaComponent from '../../common/MetaComponent';

const metadata = {
  title: "Pro Shirt Shop",
  description: "Wellcome",
};

export default function ProductDetailsPage2() {
  let params = useParams();
  const productId = params.id;
  const product =
    allProducts.find((elm) => elm.id === productId) || allProducts[0];

  return (
    <>
      <MetaComponent meta={metadata} />
      <Headers />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <Products_Detail product={product} />
        <RelatedSlider />
      </main>
      <Footers />
    </>
  );
}
