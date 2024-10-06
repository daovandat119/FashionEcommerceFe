import React from 'react'

const Products_Trendy = () => {
  return (
    <div>
       <div> 
        <main className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-normal text-center mb-8 px-1">
                OUR TRENDY
                <span className="font-bold p-3">
                    PRODUCTS
                </span>
            </h2>
            <div className="flex justify-center space-x-8 mb-8">
                <a className="text-black border-b-2 border-black" href="#">
                    ALL
                </a>
                <a className="text-gray-500" href="#">
                    NEW ARRIVALS
                </a>
                <a className="text-gray-500" href="#">
                    BEST SELLER
                </a>
                <a className="text-gray-500" href="#">
                    TOP RATED
                </a>
            </div>
            <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
                    <div className="relative">
                        <img alt="Woman wearing a cropped faux leather jacket" className="w-full" height="400" src="https://placehold.co/300x400" width="300" />
                        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2">
                            ADD TO CART
                        </button>
                    </div>
                    <p className="text-gray-500 mt-4">
                        Dresses
                    </p>
                    <p className="text-black font-bold">
                        Cropped Faux Leather Jacket
                    </p>
                    <p className="text-black">
                        $29
                    </p>
                    <div className="flex justify-center items-center mt-2">
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <p className="text-gray-500 ml-2">
                            8k+ reviews
                        </p>
                    </div>
                </div>
                <div className="text-center">
                    <img alt="Woman wearing a cropped faux leather jacket" className="w-full" height="400" src="https://placehold.co/300x400" width="300" />
                    <p className="text-gray-500 mt-4">
                        Dresses
                    </p>
                    <p className="text-black font-bold">
                        Calvin Shorts
                    </p>
                    <p className="text-black">
                        $62
                    </p>
                    <div className="flex justify-center items-center mt-2">
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                    </div>
                </div>
                <div className="text-center">
                    <img alt="Woman wearing a Kirby T-shirt" className="w-full" height="400" src="https://placehold.co/300x400" width="300" />
                    <p className="text-gray-500 mt-4">
                        Dresses
                    </p>
                    <p className="text-black font-bold">
                        Kirby T-Shirt
                    </p>
                    <p className="text-black">
                        $17
                    </p>
                    <div className="flex justify-center items-center mt-2">
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                    </div>
                </div>
                <div className="text-center">
                    <img alt="Man wearing a cableknit shawl" className="w-full" height="400" src="https://placehold.co/300x400" width="300" />
                    <p className="text-gray-500 mt-4">
                        Dresses
                    </p>
                    <p className="text-black font-bold">
                        Cableknit Shawl
                    </p>
                    <p className="text-black">
                        $99
                    </p>
                    <div className="flex justify-center items-center mt-2">
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                        <i className="fas fa-star text-yellow-500">
                        </i>
                    </div>
                </div>
                <br />
            </div>
            <div className="text-center mt-8">
                <a className="text-black font-semibold" href="#">
                    DISCOVER MORE
                </a>
            </div>
        </main>
        </div>
    </div>
  )
}

export default Products_Trendy
