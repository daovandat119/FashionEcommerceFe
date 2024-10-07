import React from 'react'

const Footers = () => {
    return (
        <div>
            <footer className="bg-gray-200 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <img alt="UOMO logo" className="mb-4" height="50" src="" width="100" />
                            <p>
                                1418 River Drive, Suite 35 Cottonhall, CA 96222
                                <br />
                                United States
                            </p>
                            <p className="mt-2">
                                <a className="text-gray-700" href="mailto:sale@uomo.com">
                                    sale@uomo.com
                                </a>
                                <br />
                                +1 246-345-0695
                            </p>
                            <div className="flex mt-4 space-x-4">
                                <a className="text-gray-700" href="#">
                                    <i className="fab fa-facebook-f">
                                    </i>
                                </a>
                                <a className="text-gray-700" href="#">
                                    <i className="fab fa-twitter">
                                    </i>
                                </a>
                                <a className="text-gray-700" href="#">
                                    <i className="fab fa-instagram">
                                    </i>
                                </a>
                                <a className="text-gray-700" href="#">
                                    <i className="fab fa-youtube">
                                    </i>
                                </a>
                                <a className="text-gray-700" href="#">
                                    <i className="fab fa-pinterest">
                                    </i>
                                </a>
                            </div>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="font-bold mb-4">
                                COMPANY
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a className="text-gray-700" href="#">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Affiliates
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="font-bold mb-4">
                                SHOP
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a className="text-gray-700" href="#">
                                        New Arrivals
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Accessories
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Men
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Women
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Shop All
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="font-bold mb-4">
                                HELP
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Customer Service
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        My Account
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Find a Store
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Legal &amp; Privacy
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Gift Card
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5">
                            <h3 className="font-bold mb-4">
                                SUBSCRIBE
                            </h3>
                            <p className="mb-4">
                                Be the first to get the latest news about trends, promotions, and much more!
                            </p>
                            <form className="flex mb-4">
                                <input className="p-2 border border-gray-300 rounded-l w-full" placeholder="Your email address" type="email" />
                                <button className="p-2 bg-gray-700 text-white rounded-r" type="submit">
                                    Submit
                                </button>
                            </form>
                            <p className="mb-2">
                                Secure payments
                            </p>
                            <div className="flex space-x-2">
                                <img
                                    loading="lazy"
                                    width={324}
                                    height={38}
                                    src="/assets/images/payment-options.png"
                                    alt="Acceptable payment gateways"
                                    className="mw-100"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-300 pt-4 flex justify-between items-center">
                        <p className="text-gray-700">
                            ©2024 Uomo
                        </p>
                        <div className="flex space-x-4">
                            <a className="text-gray-700" href="#">
                                Language
                            </a>
                            <a className="text-gray-700" href="#">
                                United Kingdom | English
                            </a>
                            <a className="text-gray-700" href="#">
                                Currency
                            </a>
                            <a className="text-gray-700" href="#">
                                $ USD
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footers
