import React from 'react'

const Support = () => {
    return (
        <div className="flex justify-center items-center space-x-12 py-12">

            <div className="flex items-center space-x-4">
                <i className="fas fa-shipping-fast text-4xl"></i>
                <div>
                    <h4 className="font-bold text-base">GIAO HÀNG NHANH CHÓNG</h4>
                    <p className="text-gray-600 text-sm">Miễn phí giao hàng cho đơn trên 50VND</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <i className="fas fa-headset text-4xl"></i>
                <div>
                    <h4 className="font-bold text-base">HỖ TRỢ KHÁCH HÀNG 24/7</h4>
                    <p className="text-gray-600 text-sm">Hỗ trợ khách hàng thân thiện 24/7</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <i className="fas fa-shield-alt text-4xl"></i>
                <div>
                    <h4 className="font-bold text-base">ĐẢM BẢO HOÀN TIỀN</h4>
                    <p className="text-gray-600 text-sm">Chúng tôi hoàn tiền trong vòng 30 ngày</p>
                </div>
            </div>
        </div>
    )
}

export default Support
