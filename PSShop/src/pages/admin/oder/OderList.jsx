import React from 'react';
import { Card, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom"; 
import { Button } from "@material-tailwind/react";
import { EyeIcon, ArrowDownIcon, TrashIcon } from "@heroicons/react/24/solid";

const OrderList = () => {
  return (
    <>
      <div className="text-2xl font-bold p-4">
        LIST ORDER
      </div>
      <Card className="w-[98%] mx-auto p-2 shadow-lg rounded-lg">
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="min-w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700 ">
                <th className="w-[10%] py-2 border-b border-gray-300 text-center font-medium">Mã đơn hàng</th>
                <th className="w-[11%] py-2 border-b border-gray-300 text-center font-medium">Date</th>
                <th className="w-[8%] py-2 border-b border-gray-300 text-center font-medium">Users</th>
                <th className="w-[6%] py-2 border-b border-gray-300 text-center font-medium">Quantity</th>
                <th className="w-[8%] py-2 border-b border-gray-300 text-center font-medium">Tổng tiền</th>
                <th className="w-[13%] py-2 border-b border-gray-300 text-center font-medium">Phương thức</th>
                <th className="w-[16%] py-2 border-b border-gray-300 text-center font-medium">Thanh toán</th>
                <th className="w-[16%] py-2 border-b border-gray-300 text-center font-medium">Trạng thái</th>
                <th className="w-[6%] py-2 border-b border-gray-300 text-center font-medium">Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 text-center">
                <td className="w-[10%] border-r border-gray-300">20240515-08165590</td>
                <td className="w-[10%] border-r border-gray-300">2024-05-15</td>
                <td className="w-[8%] border-r border-gray-300">Paul K Jensen</td>
                <td className="w-[6%] border-r border-gray-300">10</td>
                <td className="w-[8%] border-r border-gray-300">$176.400</td>
                <td className="w-[13%] border-r border-gray-300">ATM Banking</td>
                <td className="w-[16%] border-r border-gray-300">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">Đã Thanh Toán</span>
                </td>
                <td className="p-4 border-r border-gray-300">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">Đã Giao</span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <Link to="/admin/orders/update" className="p-2 rounded-full shadow-md bg-blue-200 text-blue-500">
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Button size="sm" color="purple" className="p-2 bg-purple-400 rounded-full shadow-md">
                    <ArrowDownIcon className="h-5 w-5" />
                  </Button>
                  <Button size="sm" color="red" className="p-2 rounded-full shadow-md">
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
              {/* Thêm các hàng khác ở đây nếu cần */}
              <tr className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 text-center">
                <td className="p-4 border-r border-gray-300">20240515-08165590</td>
                <td className="p-4 border-r border-gray-300">2024-05-15</td>
                <td className="p-4 border-r border-gray-300">HoangHai</td>
                <td className="p-4 border-r border-gray-300">3</td>
                <td className="p-4 border-r border-gray-300">$286.400</td>
                <td className="p-4 border-r border-gray-300">Thanh toán khi nhận hàng</td>
                <td className="p-4 border-r border-gray-300">
                  <span className="bg-yellow-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">Chưa Thanh Toán</span>
                </td>
                <td className="p-4 border-r border-gray-300">
                  <span className="bg-yellow-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">Đang Giao Hàng</span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <Link to="/admin/orders/update" className="p-2 rounded-full shadow-md bg-blue-200 text-blue-500">
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Button size="sm" color="purple" className="p-2 text-white bg-purple-400 rounded-full shadow-md">
                    <ArrowDownIcon className="h-5 w-5" />
                  </Button>
                  <Button size="sm" color="red" className="p-2 rounded-full shadow-md">
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default OrderList;
