import { Link } from "react-router-dom";

export default function Dashboards() {
  return (
    <div className="col-lg-9">
      <div className="page-content my-account__dashboard">
        <p className="text-lg font-medium text-gray-800">
          Xin chào <strong className="font-bold">alitfn58</strong> (không phải{" "}
          <strong className="font-bold">alitfn58?</strong>
          <Link to="/login_register" className="text-blue-500 underline ml-1">
            Đăng xuất
          </Link>
          )
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Từ bảng điều khiển tài khoản, bạn có thể xem{" "}
          <Link
            className="underline text-blue-500 font-semibold"
            to="/account_orders"
          >
            các đơn hàng gần đây
          </Link>
          , quản lý{" "}
          <Link
            className="underline text-blue-500 font-semibold"
            to="/account_edit_address"
          >
            địa chỉ giao hàng, thanh toán
          </Link>
          , và{" "}
          <Link
            className="underline text-blue-500 font-semibold"
            to="/account_edit"
          >
            chỉnh sửa chi tiết mật khẩu và tài khoản của mình.
          </Link>
        </p>
      </div>
    </div>
  );
}
