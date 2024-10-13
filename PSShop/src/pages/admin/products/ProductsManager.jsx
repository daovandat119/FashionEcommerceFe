import UpdateProducts from "./UpdateProducts";
import ProductsList from "./ProductsList";
import AddProducts from "./AddProducts";

const ProductsManager = () => {
  return (
    <>
      <ProductsList />
      <AddProducts />
      <UpdateProducts />
    </>
  );
};

export default ProductsManager;
