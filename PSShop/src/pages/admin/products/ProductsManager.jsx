import UpdateProducts from "./UpdateProducts";
import ProductsList from "./ProductsList";
import AddProducts from "./AddProducts";
import UpdateVariant from "./UpdateVariant";

const ProductsManager = () => {
  return (
    <>
      <ProductsList />
      <AddProducts />
      <UpdateProducts />
      <UpdateVariant/>
    </>
  );
};

export default ProductsManager;
