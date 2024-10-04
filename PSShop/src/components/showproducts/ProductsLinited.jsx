import React from 'react'

const ProductsLinited = () => {
  return (
    <div>
            <h2 className="text-3xl font-normal text-center mb-8 px-1">
                LIMITED
                <span className="font-bold p-3 ">
                    EDITION
                </span>
            </h2>
            <div className="container mx-auto px-4 py-8">
                <div className="relative">
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-chevron-left text-2xl">
                        </i>
                    </button>
                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fas fa-chevron-right text-2xl">
                        </i>
                    </button>
                    <div className="grid grid-cols-4 gap-4 mx-8">
                        <div className="text-left">
                            <img alt="Black bracelet with metal clasp" className="mx-auto mb-4" height="300" src="https://storage.googleapis.com/a1aa/image/gCKu03EpP34eW628YKim82eUHSs4H0UNL0dZWblAnFxdDfFnA.jpg" width="350" />
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Dresses
                                </p>
                                <button className="text-gray-500">
                                    <i className="far fa-heart">
                                    </i>
                                </button>
                            </div>
                            <p className="font-semibold">
                                Hub Accent Mirror
                            </p>
                            <p className="text-gray-700">
                                $17
                            </p>
                        </div>
                        <div className="text-left">
                            <img alt="Black baseball cap" className="mx-auto mb-4" height="300" src="https://storage.googleapis.com/a1aa/image/e7Dt6iB2KjVej0ORLDXeZAx3tlwXiM7A2z8fRofo9kxzb4XcC.jpg" width="350" />
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Dresses
                                </p>
                                <button className="text-gray-500">
                                    <i className="far fa-heart">
                                    </i>
                                </button>
                            </div>
                            <p className="font-semibold">
                                Hosking Blue Area Rug
                            </p>
                            <p className="text-gray-700">
                                $29
                            </p>
                            <div className="flex items-center mt-2">
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
                                <span className="text-gray-500 ml-2">
                                    8k+ reviews
                                </span>
                            </div>
                        </div>
                        <div className="text-left">
                            <img alt="Black duffle bag with blue and white stripes" className="mx-auto mb-4" height="300" src="https://storage.googleapis.com/a1aa/image/OXgADxRwHDKgJNKl89nvL51pXDN6esQrfcyaRQAu3n6hDfFnA.jpg" width="350" />
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Dresses
                                </p>
                                <button className="text-gray-500">
                                    <i className="far fa-heart">
                                    </i>
                                </button>
                            </div>
                            <p className="font-semibold">
                                Hanneman Pouf
                            </p>
                            <p className="text-gray-700">
                                $62
                            </p>
                        </div>
                        <div className="text-left">
                            <img alt="Black leather belt with metal buckle" className="mx-auto mb-4" height="300" src="https://storage.googleapis.com/a1aa/image/lnfihmLGsV3ofEplyxCThfh7A0Hu1zrid1uMfoeXdovEc4XcC.jpg" width="350" />
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Dresses
                                </p>
                                <button className="text-gray-500">
                                    <i className="far fa-heart">
                                    </i>
                                </button>
                            </div>
                            <p className="font-semibold">
                                Cushion Futon Slipcover
                            </p>
                            <p className="text-gray-700">
                                $62
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-8">
                    <button className="text-gray-500 mx-2">
                        <i className="fas fa-circle text-xs">
                        </i>
                    </button>
                    <button className="text-gray-500 mx-2">
                        <i className="far fa-circle text-xs">
                        </i>
                    </button>
                    <button className="text-gray-500 mx-2">
                        <i className="far fa-circle text-xs">
                        </i>
                    </button>
                </div>
            </div>
        </div>
  )
}

export default ProductsLinited
