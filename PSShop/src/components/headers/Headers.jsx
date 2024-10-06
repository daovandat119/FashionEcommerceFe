import React from 'react'

const Headers = () => {
  return (
    <div>
       <header className='bg-white'>
                <div className='container mx-auto px-4 py-4  flex justify-start items-center'>
                    <div className="text-3xl font-bold mr-8">
                        PRO SHIRT
                    </div>
                    <nav className='space-x-8 font-bold'>
                        <a className='text-gray-900 hover:text-red-500 text-lg' href="">HOME</a>
                        <a className='text-gray-900 hover:text-red-500 text-lg' href="">SHOP</a>
                        <a className='text-gray-900 hover:text-red-500 text-lg' href="">ABOUT</a>
                        <a className='text-gray-900 hover:text-red-500 text-lg' href="">CONTACT</a>
                        <a className='text-gray-900 hover:text-red-500 text-lg' href=""></a>
                        <a className='text-gray-900 hover:text-red-500 text-lg' href=""></a>
                    </nav>
                    <div className="ml-auto space-x-9">
                        <a href="#" className='text-gray-700 text-xl'>
                            <i className='fas fa-search'></i>
                        </a>
                        <a href="#" className='text-gray-700 text-xl'>
                            <i className='fas fa-user'></i>
                        </a>
                        <a href="#" className='text-gray-700 text-xl'>
                            <i className='fas fa-heart'></i>
                        </a>
                        <a href="#" className='text-gray-700 text-xl'>
                            <i className='fas fa-shopping-bag'></i>
                        </a>
                        <a href="#" className='text-gray-700 text-xl'>
                            <i className='fas fa-bars'></i>
                        </a>
                    </div>
                </div>
            </header>
    </div>
  )
}

export default Headers
