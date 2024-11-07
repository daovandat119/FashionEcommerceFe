import { Link } from "react-router-dom";
import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const CartList = () => {
  // Giả sử bạn có một danh sách đơn hàng trong giỏ hàng
  const cartItems = [
    { id: 1, name: "Product 1", price: 29.99, quantity: 2, status: "Pending" },
    { id: 2, name: "Product 2", price: 49.99, quantity: 1, status: "Shipped" },
    { id: 3, name: "Product 3", price: 19.99, quantity: 3, status: "Pending" },
  ];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Typography variant="h4" className="mb-4">
        Your Orders
      </Typography>
      <div className="w-full max-w-2xl">
        {cartItems.length === 0 ? (
          <Card className="p-4">
            <CardBody>
              <Typography>No items in your orders.</Typography>
              <Link to="/shop">
                <Button className="mt-4">Go to Shop</Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          cartItems.map(item => (
            <Card key={item.id} className="mb-4">
              <CardBody className="flex justify-between items-center">
                <div className="flex flex-col">
                  <Typography>{item.name}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Typography>Status: {item.status}</Typography>
                </div>
                <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
              </CardBody>
            </Card>
          ))
        )}
      </div>
      <div className="mt-4">
        <Typography variant="h6">Total: ${calculateTotal()}</Typography>
      </div>
      <Link to="/shop_checkout" className="mt-4">
        <Button>Proceed to Checkout</Button>
      </Link>
    </div>
  );
};

export default CartList;