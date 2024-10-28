import { useEffect } from "react";
import { useContextElement } from "../../../context/Context";

export default function CartLength() {
  const { cartProducts, fetchCartItems } = useContextElement();

  useEffect(() => {
    fetchCartItems(); // Fetch cart data when component mounts
  }, [fetchCartItems]);

  return <>{Array.isArray(cartProducts) ? cartProducts.length : 0}</>;
}
