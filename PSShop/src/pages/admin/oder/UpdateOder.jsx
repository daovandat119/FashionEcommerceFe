import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

import { Select as SelectMUI, MenuItem as MenuItemMUI } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetOrderDetails,
  GetOrderById,
  UpdateOrderStatus,
} from "../service/api_service";

const UpdateOrder = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { OrderID } = useParams();

  const fetchOrdersDetails = async () => {
    try {
      const response = await GetOrderDetails(OrderID);
      if (response.data) {
        setOrderDetails(response.data[0]);
        console.log("Order Details:", response.data[0]);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByID = async () => {
    try {
      const response = await GetOrderById(OrderID);
      if (response.data) {
        setOrders(response.data);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersByID();
    fetchOrdersDetails();
    console.log("Order Status ID:", orderDetails.OrderStatusID);
  }, []);

  const handleUpdate = () => {
    console.log("Updated Order:", orderDetails);
  };

  const handleCancel = () => {
    navigate("/admin/orders");
  };

  const handleChangeStatus = async (e) => {
    const selectedValue = e.target.value;
    console.log("Selected Order Status:", orderDetails.OrderID, selectedValue);

    try {
      const response = await UpdateOrderStatus(
        orderDetails.OrderID,
        selectedValue
      );
      console.log("Update response:", response);
    } catch (error) {
      console.error("Error updating order status:", error.message || error);
    } finally {
      setLoading(false);
    }
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      OrderStatusID: selectedValue,
    }));
  };

  return (
    <Card className="w-[90%] mx-auto mt-10 p-6 shadow-lg rounded-lg">
      <Typography variant="h5" className="mb-6 text-gray-800 font-bold">
        Chi tiết đơn hàng
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Mã đơn hàng"
          value={orderDetails.OrderCode}
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Ngày đặt hàng"
          value={orderDetails.OrderDate}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Tên khách hàng"
          value={orderDetails.Username}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Địa chỉ"
          value={orderDetails.Address}
          readOnly
          className="mb-4 !bg-gray-100"
        />
        <Input
          label="Số lượng"
          type="number"
          value={orderDetails.TotalQuantity}
          readOnly
          className="!bg-gray-100"
          style={{ backgroundColor: "#f3f4f6" }}
        />
        <Input
          label="Tổng tiền"
          type="number"
          value={orderDetails.TotalAmount}
          readOnly
          className="!bg-gray-100"
          style={{ backgroundColor: "#f3f4f6" }}
        />

        <Input
          label="Phương thức thanh toán"
          value={orderDetails.PaymentMethod}
          readOnly
          className="!bg-gray-100"
          style={{ backgroundColor: "#f3f4f6" }}
        />

        <Input
          label="Tình trạng thanh toán"
          value={orderDetails.PaymentStatus}
          readOnly
          className="!bg-gray-100"
          style={{ backgroundColor: "#f3f4f6" }}
        />
        {orderDetails.OrderStatusID == 1 && (
          <SelectMUI
            value={orderDetails.OrderStatusID || ""}
            className="!bg-gray-100"
            onChange={handleChangeStatus}
          >
            <MenuItemMUI value="1" disabled>
              Đang xử lý
            </MenuItemMUI>
            <MenuItemMUI value="2">Đang giao hàng</MenuItemMUI>
            <MenuItemMUI value="3" disabled>
              Đã giao
            </MenuItemMUI>
            <MenuItemMUI value="4" disabled>
              Đã hủy
            </MenuItemMUI>
          </SelectMUI>
        )}
        {orderDetails.OrderStatusID == 2 && (
          <SelectMUI
            value={orderDetails.OrderStatusID || ""}
            className="!bg-gray-100"
            onChange={handleChangeStatus}
          >
            <MenuItemMUI value="1" disabled>
              Đang xử lý
            </MenuItemMUI>
            <MenuItemMUI value="2" disabled>
              Đang giao hàng
            </MenuItemMUI>
            <MenuItemMUI value="3">Đã giao</MenuItemMUI>
            <MenuItemMUI value="4" disabled>
              Đã hủy
            </MenuItemMUI>
          </SelectMUI>
        )}
        {orderDetails.OrderStatusID == 3 && (
          <SelectMUI
            value={orderDetails.OrderStatusID || ""}
            className="!bg-gray-100"
            onChange={handleChangeStatus}
          >
            <MenuItemMUI value="1" disabled>
              Đang xử lý
            </MenuItemMUI>
            <MenuItemMUI value="2" disabled>
              Đang giao hàng
            </MenuItemMUI>
            <MenuItemMUI value="3" disabled>
              Đã giao
            </MenuItemMUI>
            <MenuItemMUI value="4" disabled>
              Đã hủy
            </MenuItemMUI>
          </SelectMUI>
        )}

        {orderDetails.OrderStatusID == 4 && (
          <SelectMUI
            value={orderDetails.OrderStatusID || ""}
            className="!bg-gray-100"
            onChange={handleChangeStatus}
          >
            <MenuItemMUI value="1" disabled>
              Đang xử lý
            </MenuItemMUI>
            <MenuItemMUI value="2" disabled>
              Đang giao hàng
            </MenuItemMUI>
            <MenuItemMUI value="3" disabled>
              Đã giao
            </MenuItemMUI>
            <MenuItemMUI value="4" disabled>
              Đã hủy
            </MenuItemMUI>
          </SelectMUI>
        )}
      </div>

      <Typography variant="h6" className="mt-10 text-gray-800 font-bold">
        Sản Phẩm
      </Typography>
      <div className="overflow-x-auto mt-4 ">
        <table className="min-w-full  rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-center ">
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                STT
              </th>
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                Sản Phẩm
              </th>
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                Hình Ảnh
              </th>
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                Màu sắc
              </th>
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                Kích cỡ
              </th>
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                Số lượng
              </th>
              <th className="p-4 border-b border-r border-gray-300 text-center font-medium">
                Giá
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-300 ">
            {orders.map((order, index) => (
              <tr
                key={order.OrderID}
                className="text-center border-b border-gray-100"
              >
                <td className="p-4 border-r border-gray-300">{index + 1}</td>
                <td className="border-r border-gray-300">
                  {order.ProductName}
                </td>
                <td className="p-4 border-r border-gray-300">
                  <img
                    src={order.MainImageURL}
                    alt="Product"
                    className="w-12 h-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-4 border-r border-gray-300">
                  {order.VariantColor}
                </td>
                <td className="p-4 border-r border-gray-300">
                  {order.VariantSize}
                </td>
                <td className="p-4 border-r border-gray-300">
                {Math.floor(order.TotalQuantity)} 
                </td>
                <td className="p-4 border-r border-gray-300">
                  {Math.floor(parseFloat(order.VariantPrice).toFixed(2)) } VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right">
          <p className="flex justify-between">
            <span className="font-medium">Tổng tiền sản phẩm:</span>
            <span>{Math.floor(orderDetails.TotalAmount)} VND</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Phí vận chuyển:</span>
            <span>{Math.floor(orderDetails.ShippingFee)} VND</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Giảm giá:</span>
            <span>{Math.floor(orderDetails.Discount)} VND</span>
          </p>
          <Typography
            variant="h6"
            className="mt-2 text-gray-800 font-semibold flex justify-between"
          >
            <span>Tổng tiền:</span>
            <span>{Math.floor(orderDetails.TotalProductAmount)} VND</span>
          </Typography>
        </div>
        <div className="flex justify-end mt-4">
          <Button color="blue" onClick={handleCancel}>
            Thoát
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UpdateOrder;
