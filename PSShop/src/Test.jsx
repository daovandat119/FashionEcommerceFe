import { useEffect, useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // State để lưu thông tin sản phẩm đã chọn

    useEffect(() => {
        // Gọi API PHP từ React
        axios.get('http://127.0.0.1:8000/api/products') // Nếu bạn đã cấu hình proxy
            .then(response => {
                console.log('Response data:', response.data);
                setProducts(response.data.data || response.data); // Điều chỉnh nếu cần
                setLoading(false);
            })
            .catch(error => {
                console.error("Có lỗi xảy ra khi gọi API", error);
                setError("Không thể tải sản phẩm.");
                setLoading(false);
            });
    }, []);

    const getProductDetails = (id) => {
        // Gọi API để lấy chi tiết sản phẩm theo ID
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
            .then(response => {
                setSelectedProduct(response.data.data || response.data); // Giả định rằng dữ liệu trả về là mảng
            })
            .catch(error => {
                console.error("Có lỗi xảy ra khi lấy chi tiết sản phẩm", error);
                setError("Không thể tải chi tiết sản phẩm.");
            });
    };

    return (
        <div>
            <div>
                <h1 className='text-3xl'>Danh sách sản phẩm</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : products.length === 0 ? (
                    <p>Không có sản phẩm nào.</p>
                ) : (
                    <ul>
                        {products.map(product => (
                            <li key={product.ProductID} className="flex justify-between items-center">
                                {product.ProductName} - {product.Price} VND
                                <button 
                                    onClick={() => getProductDetails(product.ProductID)}
                                    className="ml-4 bg-blue-500 text-white py-1 px-3 rounded"
                                >
                                    Chi tiết
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedProduct && (
                <div className="mt-6">
                    <h2 className='text-2xl'>Chi tiết sản phẩm</h2>
                    <p>Tên sản phẩm: {selectedProduct.ProductName}</p>
                    <p>Giá: {selectedProduct.Price} VND</p>
                    <p>Mô tả: {selectedProduct.Description}</p>
                    {/* Hiển thị thông tin khác nếu cần */}
                </div>
            )}
        </div>
    );
}

export default Test;