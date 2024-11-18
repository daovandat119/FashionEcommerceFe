import React, { useState } from 'react';

const ProductSalesTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const products = [
        { name: 'Apple iPad Air 2 Cellular 16Gb cũ 99%', quantity: 1, price: 12000000, total: 12000000 },
        { name: 'Giày thể thao', quantity: 1, price: 100000, total: 100000 },
        // Thêm các sản phẩm khác nếu cần
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 bg-white">
            <h2 className="text-xl font-bold mb-4">Thống kê sản phẩm bán ra</h2>
            
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <label className="mr-2">Filter:</label>
                    <input
                        type="text"
                        placeholder="Type to filter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>
                <div className="flex items-center">
                    <label className="mr-2">Show:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                </div>
            </div>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Tên sản phẩm</th>
                        <th className="border border-gray-300 p-2">Số lượng bán ra</th>
                        <th className="border border-gray-300 p-2">Giá bán</th>
                        <th className="border border-gray-300 p-2">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.slice(0, itemsPerPage).map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{product.name}</td>
                            <td className="border border-gray-300 p-2">{product.quantity}</td>
                            <td className="border border-gray-300 p-2">{product.price.toLocaleString()} đ</td>
                            <td className="border border-gray-300 p-2">{product.total.toLocaleString()} đ</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductSalesTable;