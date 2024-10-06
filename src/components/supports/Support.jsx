import React from 'react'

const Support = () => {
    return (
        <div className="flex justify-center items-center space-x-64 py-12">

            <div className="text-center">
                <i className="fas fa-shipping-fast text-5xl mb-4"></i>
                <h3 className="font-bold text-lg">FAST AND FREE DELIVERY</h3>
                <p className="text-gray-600">Free delivery for all orders over $140</p>
            </div>

            <div className="text-center">
                <i className="fas fa-headset text-5xl mb-4"></i>
                <h3 className="font-bold text-lg">24/7 CUSTOMER SUPPORT</h3>
                <p className="text-gray-600">Friendly 24/7 customer support</p>
            </div>

            <div className="text-center">
                <i className="fas fa-shield-alt text-5xl mb-4"></i>
                <h3 className="font-bold text-lg">MONEY BACK GUARANTEE</h3>
                <p className="text-gray-600">We return money within 30 days</p>
            </div>
        </div>
    )
}

export default Support
