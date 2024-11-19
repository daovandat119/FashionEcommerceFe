import React, { useState } from 'react';
import OrderBarChart from './OrderBarChart';
import RevenueChart from './RevenueChart';
import ProductSalesTable from './ProductSalesChart';

function StatisticalProducts() {
    const [chartType, setChartType] = useState('line');

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    return (
        <div>
            <h1 className='text-2xl font-semibold ml-5 pt-5'>Thống Kê Sản Phẩm</h1>
            <div className="filter-section p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg">Bộ lọc</h3>
                <div className="flex justify-between">
                    <div className="w-[20%]">
                       
                    </div>
                    <div className="flex justify-end gap-2 w-[100%]">
                        <div className="w-[35%]">
                            <label className="block mb-1">Khoảng thời gian</label>
                            <input
                                type="text"
                                placeholder="01-01-2020 - 30-06-2020"
                                className="border rounded-md p-2 w-full"
                            />
                        </div>
                        <div className="w-[25%]">
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
                            placeholder="Nhập mã đơn hàng"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="w-[95%] mx-auto">
                
                {<OrderBarChart />}
            </div>

            <div className="w-[95%] mx-auto mt-5">
                <RevenueChart />
            </div>
            <div>
            <ProductSalesTable/>
            </div>
        </div>
    );
}

export default StatisticalProducts;
