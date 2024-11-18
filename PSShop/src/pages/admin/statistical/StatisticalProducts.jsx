import React from 'react';
import OrderChart from './OrderChart';

function StatisticalProducts() {
    return (
        <div>
            <div className="filter-section p-4 bg-gray-100 rounded-md">
                 <h3 className="text-lg">Bộ lọc</h3>
                
               
                 <div className="flex justify-between">
                 <div className="w-[15%]">
                        <label className="block mb-1">Chọn loại biểu đồ</label>
                        <select className="border rounded-md p-2 w-full">
                            <option value="line">Biểu đồ đường</option>
                            <option value="bar">Biểu đồ cột</option>
                        </select>
                    </div>
               <div className="flex justify-end gap-2 w-[100%]">
               <div className="w-[30%]">
                        <label className="block mb-1">Khoảng thời gian</label>
                        <input
                            type="text"
                            placeholder="01-01-2020 - 30-06-2020"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="w-[30%]">
                        <label className="block mb-1">Ngày</label>
                        <input
                            type="date"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
               </div>
                 </div>
                 <div className="flex justify-between w-[100%]">
                 <div className="w-[49%]">
                        <label className="block mb-1">Loại đơn hàng</label>
                        <select className="border rounded-md p-2 w-full">
                            <option value="all">Tất cả đơn hàng</option>
                            <option value="new">Đơn hàng mới</option>
                            <option value="in_transit">Đang vận chuyển</option>
                            <option value="delivered">Đã Giao</option>
                            <option value="canceled">Đơn hàng bị hủy</option>
                        </select>
                    </div>
                    
                    <div className="w-[49%]">
                        <label className="block mb-1">Mã Đơn hàng</label>
                        <input
                            type="text"
                            placeholder="Nhập tài khoản nhân viên"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                 </div>
               
            </div>
           
           <OrderChart />
          
        </div>
    );
}

export default StatisticalProducts;
