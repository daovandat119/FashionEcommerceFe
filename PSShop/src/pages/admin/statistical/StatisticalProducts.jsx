import React, { useState } from 'react';
import OrderChart from './OrderChart';
import OrderBarChart from './OrderBarChart';
import RevenueChart from './RevenueChart';
import ProductSalesTable from './ProductSalesChart';

function StatisticalProducts() {
    const [chartType, setChartType] = useState('line');
    const [timePeriod, setTimePeriod] = useState('');

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleTimePeriodChange = (e) => {
        setTimePeriod(e.target.value);
    };

    return (
        <div>
            <h1 className='text-2xl font-semibold ml-5 pt-5'>Thống Kê Sản Phẩm</h1>
            <div className="filter-section p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg">Bộ lọc</h3>
                <div className="flex justify-between">
                    <div className="w-[20%]">
                        <label className="block mb-1">Chọn loại biểu đồ</label>
                        <select className="border rounded-md p-2 w-full" onChange={handleChartTypeChange}>
                            <option value="line">Biểu đồ đường</option>
                            <option value="bar">Biểu đồ cột</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 w-[100%]">
                        <div className="w-[35%]">
                            <label className="block mb-1">Khoảng thời gian</label>
                            <select
                                value={timePeriod}
                                onChange={handleTimePeriodChange}
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Chọn khoảng thời gian</option>
                                <option value="today">Hôm nay</option>
                                <option value="this_week">Tuần này</option>
                                <option value="last_month">1 tháng gần nhất</option>
                                <option value="last_3_months">3 tháng gần nhất</option>
                                <option value="last_6_months">6 tháng gần nhất</option>
                            </select>
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
                            placeholder="Nhập tài khoản nhân viên"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="w-[95%] mx-auto">
                {chartType === 'line' ? <OrderChart /> : <OrderBarChart />}
            </div>

            <div className="w-[95%] mx-auto mt-5">
                <RevenueChart />
            </div>
            <div>
                <ProductSalesTable />
            </div>
        </div>
    );
}

export default StatisticalProducts;
