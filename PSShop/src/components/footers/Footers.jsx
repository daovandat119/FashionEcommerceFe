const Footers = () => {
    return (
        <div>
            <footer className="bg-gray-200 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <img alt="Logo UOMO" className="mb-4" height="50" src="/assets/images/1.jpg" width="100" />
                            <p>
                                Số 1, Trịnh Văn Bô
                                <br />
                                Việt Nam
                            </p>
                            <p className="mt-2">
                                <a className="text-gray-700" href="mailto:sale@uomo.com">
                                    sale@ProShirts.com
                                </a>
                                <br />
                                +84 463450695
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
                                CÔNG TY
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Về Chúng Tôi
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Tuyển Dụng
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Đối Tác
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Bài Viết
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Liên Hệ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="font-bold mb-4">
                                MUA SẮM
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Hàng Mới Về
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Phụ Kiện
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Nam
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Nữ
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Tất Cả Sản Phẩm
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5 mb-6 md:mb-0">
                            <h3 className="font-bold mb-4">
                                HỖ TRỢ
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Dịch Vụ Khách Hàng
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Tài Khoản Của Tôi
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Tìm Cửa Hàng
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Chính Sách &amp; Quyền Riêng Tư
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Liên Hệ
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-700" href="#">
                                        Thẻ Quà Tặng
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/5">
                            <h3 className="font-bold mb-4">
                                ĐĂNG KÝ
                            </h3>
                            <p className="mb-4">
                                Hãy là người đầu tiên nhận thông tin mới nhất về xu hướng, khuyến mãi và nhiều hơn nữa!
                            </p>
                            <form className="flex mb-4">
                                <input className="p-2 border border-gray-300 rounded-l w-full" placeholder="Địa chỉ email của bạn" type="email" />
                                <button className="p-2 bg-gray-700 text-white rounded-r" type="submit">
                                    Gửi
                                </button>
                            </form>
                            <p className="mb-2">
                                Thanh toán an toàn
                            </p>
                            <div className="flex space-x-2">
                                <img
                                    loading="lazy"
                                    width={324}
                                    height={38}
                                    src="/assets/images/payment-options.png"
                                    alt="Các phương thức thanh toán chấp nhận"
                                    className="mw-100"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-gray-300 pt-4 flex justify-between items-center">
                        <p className="text-gray-700">
                            ©2024 ProShirts
                        </p>
                        <div className="flex space-x-4">
                            <a className="text-gray-700" href="#">
                                Ngôn Ngữ
                            </a>
                            <a className="text-gray-700" href="#">
                                Tiếng Việt | Việt Nam
                            </a>
                            <a className="text-gray-700" href="#">
                                Tiền Tệ
                            </a>
                            <a className="text-gray-700" href="#">
                               VND
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footers;
