import React from 'react'

const Banner = () => {
  return (
    <div className="bg-pink-100">
            <main className="relative">
                <div className="container mx-auto flex items-center justify-between py-20">
                    <div className="space-y-4">
                        <div className="text-red-500 text-sm">
                            NEW TREND
                        </div>
                        <h1 className="text-5xl font-bold">
                            SUMMER SALE STYLISH
                        </h1>
                        <h2 className="text-6xl font-bold text-gray-900">
                            WOMENS
                        </h2>
                        <a className="text-dark underline" href="#">
                            DISCOVER MORE
                        </a>
                    </div>
                    <div>
                        <img alt="Woman in stylish brown sweater looking down" className="w-full h-auto" height="800" src="https://placehold.co/800x600" width="600" />
                    </div>
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-4 text-gray-700">
                    <a className="block" href="#">
                        <i className="fab fa-facebook-f">
                        </i>
                    </a>
                    <a className="block" href="#">
                        <i className="fab fa-twitter">
                        </i>
                    </a>
                    <a className="block" href="#">
                        <i className="fab fa-instagram">
                        </i>
                    </a>
                    <div className="text-xs rotate-90 transform origin-left">
                        FOLLOW US
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 transform rotate-90 origin-bottom-right text-gray-700 text-xs">
                    SCROLL
                </div>
            </main>
        </div>
  )
}

export default Banner
