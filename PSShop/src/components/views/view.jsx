export const handleViewProduct = async (productId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/view/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: productId }), // Nếu API yêu cầu body
        });
        const data = await response.json();
        if (data.status === 'success') {
            console.log('Product viewed:', data.product);
            // Có thể thêm logic để hiển thị thông tin sản phẩm nếu cần
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};