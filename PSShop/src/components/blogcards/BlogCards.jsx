/* eslint-disable no-unused-vars */
import React from 'react'

const BlogCards = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <!-- Women Collection --> */}
        <div className="relative">
          <img alt="Woman in stylish outfit" className="w-full h-full object-cover" height="400" src="https://placehold.co/600x400" width="600" />
          <div className="absolute bottom-4 left-4 text-left">
            <p className="text-sm text-gray-600">
              HOT LIST
            </p>
            <h2 className="text-2xl font-bold">
              WOMEN COLLECTION
            </h2>
            <a className="text-sm text-black underline" href="#">
              SHOP NOW
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* <!-- Men Collection --> */}
          <div className="relative">
            <img alt="Man with colorful hair" className="w-full h-full object-cover" height="200" src="https://placehold.co/600x200" width="600" />
            <div className="absolute bottom-4 left-4 text-left">
              <p className="text-sm text-gray-600">
                HOT LIST
              </p>
              <h2 className="text-2xl font-bold">
                MEN COLLECTION
              </h2>
              <a className="text-sm text-black underline" href="#">
                SHOP NOW
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* <!-- Kids Collection --> */}
            <div className="relative">
              <img alt="Kid in stylish outfit" className="w-full h-full object-cover" height="200" src="https://placehold.co/300x200" width="300" />
              <div className="absolute bottom-4 left-4 text-left">
                <p className="text-sm text-gray-600">
                  HOT LIST
                </p>
                <h2 className="text-2xl font-bold">
                  KIDS COLLECTION
                </h2>
                <a className="text-sm text-black underline" href="#">
                  SHOP NOW
                </a>
              </div>
            </div>
            {/* <!-- E-Gift Cards --> */}
            <div className="relative bg-pink-100 p-4 h-full flex items-end">
              <div className="text-left">
                <h2 className="text-2xl font-bold">
                  E-GIFT CARDS
                </h2>
                <p className="text-sm text-gray-600">
                  Surprise someone with the gift they really want.
                </p>
                <a className="text-sm text-black underline" href="#">
                  SHOP NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCards