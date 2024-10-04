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
                                {/* <img alt="Discover logo" height="20" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-a7MhXeGi8uAHm0g1bNeE95le.png?st=2024-10-01T13%3A37%3A26Z&amp;se=2024-10-01T15%3A37%3A26Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-10-01T02%3A02%3A08Z&amp;ske=2024-10-02T02%3A02%3A08Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=TV0KYZPHTSJ5yWgpZFXMg3kmLijrZSDgyyzaixdz33U%3D" width="50" />
                                <img alt="MasterCard logo" height="20" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-ByRlJMRseXrJsPjSBIVC9n2j.png?st=2024-10-01T13%3A37%3A30Z&amp;se=2024-10-01T15%3A37%3A30Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-10-01T01%3A52%3A43Z&amp;ske=2024-10-02T01%3A52%3A43Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=lSzRGrE9QJpy0PkiHQ96XT55RnIES3nSDFjOusUHJi4%3D" width="50" />
                                <img alt="PayPal logo" height="20" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-GURgsMN9PaoHkDt5n2NA5xBK.png?st=2024-10-01T13%3A37%3A27Z&amp;se=2024-10-01T15%3A37%3A27Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-10-01T11%3A37%3A55Z&amp;ske=2024-10-02T11%3A37%3A55Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=7ONmTiCg%2BJXzs5NR7Njht6FMolRfNvj9qmH9rW3J67k%3D" width="50" />
                                <img alt="Skrill logo" height="20" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-sB5EAv08jlRcRdhuCl6ZqWWg.png?st=2024-10-01T13%3A42%3A01Z&amp;se=2024-10-01T15%3A42%3A01Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-10-01T11%3A41%3A17Z&amp;ske=2024-10-02T11%3A41%3A17Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=Cgs%2BD3QsB9HIuSxEzleMSjja0I/nZh07RC4%2BlUYz3S0%3D" width="50" />
                                <img alt="Visa logo" height="20" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-HUTWkIG6EzUjj8BmR0aI6gHq.png?st=2024-10-01T13%3A42%3A11Z&amp;se=2024-10-01T15%3A42%3A11Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-09-30T15%3A07%3A51Z&amp;ske=2024-10-01T15%3A07%3A51Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=N3jVUudSreJIxEOzjjgussBp2Xu%2B92ueIGXkbtiQgoQ%3D" width="50" /> */}
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
