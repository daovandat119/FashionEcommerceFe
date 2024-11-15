import React, { useState } from 'react';
import { Card, Typography, Button, Input, Select, Option, Textarea } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const UpdateOrder = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    orderId: '20240515-08165590',
    orderDate: '2024-05-15',
    customerName: 'Paul K Jensen',
    address: '123 Main St, Springfield',
    quantity: 1,
    totalAmount: 176400,
    paymentMethod: 'ATM',
    paymentStatus: 'Paid',
    orderStatus: 'Đã giao', 
    notes: ''
  });

  const products = [
    {
      id: 1,
      photo: 'https://via.placeholder.com/50',
      description: 'Insight Cosmetics 3D Highlighter',
      sku: 'SKU12345',
      deliveryType: 'Home Delivery',
      qty: 3,
      price: 58800,
      total: 176400,
    },
  ];

  const summary = {
    subTotal: 176400,
    tax: 0,
    shipping: 0,
    coupon: 0,
    total: 176400,
  };

  const handleUpdate = () => {
    console.log("Updated Order:", orderData);
  };

  const handleCancel = () => {
    navigate('/admin/orders');
  };

  return (
    <Card className="w-[90%] mx-auto mt-10 p-6 shadow-lg rounded-lg">
      <Typography variant="h5" className="mb-6 text-gray-800 font-bold">
        Chi tiết đơn hàng
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Mã đơn hàng"
          value={orderData.orderId}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Ngày đặt hàng"
          value={orderData.orderDate}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Tên khách hàng"
          value={orderData.customerName}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Địa chỉ"
          value={orderData.address}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Số lượng"
          type="number"
          value={orderData.quantity}
          readOnly
          className="!bg-gray-100"
          style={{ backgroundColor: '#f3f4f6' }}
        />
        <Input
          label="Tổng tiền"
          type="number"
          value={orderData.totalAmount}
          readOnly
          className="!bg-gray-100"
          style={{ backgroundColor: '#f3f4f6' }}
        />

        {/* Phương thức thanh toán */}
        <div className="">
          <label className="text-gray-700 font-medium mb-1">Phương thức thanh toán</label>
          <Select
            value={orderData.paymentMethod}
            disabled
            className="!bg-gray-100"
          >
            <Option value="ATM">ATM</Option>
            <Option value="COD">COD</Option>
            <Option value="Credit Card">Credit Card</Option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-medium mb-1">Tình trạng thanh toán</label>
          <Select
            value={orderData.paymentStatus}
            disabled
            className="!bg-gray-100"
          >
            <Option value="Paid">Paid</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Refunded">Refunded</Option>
          </Select>
        </div>

        <Select
          label="Trạng thái đơn hàng"
          value={orderData.orderStatus}
          onChange={(value) => setOrderData({ ...orderData, orderStatus: value })}
          className="mb-4"
        >
          <Option value="Đang xử lý">Đang xử lý</Option>
          <Option value="Đã giao">Đã giao</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>
     
      </div>

      {/* Bảng chi tiết sản phẩm */}
      <Typography variant="h6" className="mt-10 text-gray-800 font-bold">
        Sản Phẩm
      </Typography>
      <div className="overflow-x-auto mt-4 ">
        <table className="min-w-full  rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-center ">
              <th className="p-4 border-b border-gray-300 text-center font-medium">#</th>
              <th className="p-4 border-b border-gray-300 text-center font-medium">Photo</th>
              <th className="p-4 border-b border-gray-300 text-left font-medium">Description</th>
              <th className="p-4 border-b border-gray-300 text-center font-medium">Delivery Type</th>
              <th className="p-4 border-b border-gray-300 text-center font-medium">QTY</th>
              <th className="p-4 border-b border-gray-300 text-center font-medium">Price</th>
              <th className="p-4 border-b border-gray-300 text-center font-medium">Total</th>
            </tr>
          </thead>
          <tbody className='border border-gray-300 '>
            {products.map((product, index) => (
              <tr key={product.id} className="text-center border-b border-gray-100">
                <td className="p-4 ">{index + 1}</td>
                <td className="p-4 ">
                  <img src={product.photo} alt="Product" className="w-12 h-12 object-cover mx-auto rounded" />
                </td>
                <td className="p-4 border-r border-gray-300 text-left">
                  <p className="font-semibold">{product.description}</p>
                  <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
                </td>
                <td className="p-4 border-r border-gray-300">{product.deliveryType}</td>
                <td className="p-4 border-r border-gray-300">{product.qty}</td>
                <td className="p-4 border-r border-gray-300">${(product.price / 1000).toFixed(3)}</td>
                <td className="p-4">${(product.total / 1000).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tóm tắt đơn hàng */}
        <div className="mt-6 text-right">
          <p className="text-gray-700"><strong>Sub Total:</strong> ${summary.subTotal.toLocaleString()}</p>
          <p className="text-gray-700"><strong>Tax:</strong> ${summary.tax.toLocaleString()}</p>
          <p className="text-gray-700"><strong>Shipping:</strong> ${summary.shipping.toLocaleString()}</p>
          <p className="text-gray-700"><strong>Coupon:</strong> ${summary.coupon.toLocaleString()}</p>
          <Typography variant="h6" className="mt-2 text-gray-800 font-semibold">
            Total: ${summary.total.toLocaleString()}
          </Typography>
        </div>
        <div className="flex justify-end mt-4">
          <Button color="blue" onClick={handleUpdate} className="mr-2">
            Cập nhật trạng thái đơn hàng
          </Button>
          <Button color="red" onClick={handleCancel}>Hủy</Button>
        </div>
      </div>
    </Card>
  );
};

export default UpdateOrder;
