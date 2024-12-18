import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ChangePassword({ onCancel }) {
  const navigate = useNavigate();

  const handleChangePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    const token = localStorage.getItem("token");

    if (newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu mới quá ngắn",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự!",
        showConfirmButton: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không khớp",
        text: "Mật khẩu xác nhận không khớp!",
        showConfirmButton: true,
      });
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/api/users/change-password/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      }
    );

    if (!response.ok) {
      const textResponse = await response.text();
      if (response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Mật khẩu hiện tại sai",
          text: "Mật khẩu hiện tại bạn nhập không đúng.",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi đổi mật khẩu",
          text: "Có lỗi xảy ra khi đổi mật khẩu.",
          showConfirmButton: true,
        });
      }
      console.error("Lỗi từ API:", response.status, textResponse);
      return;
    }

    const result = await response.json();
    Swal.fire({
      icon: "success",
      title: "Cập nhật mật khẩu thành công",
      text: result.message,
      showConfirmButton: false,
      timer: 2000,
    });

    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login_register");
    }, 2000);
  };

  return (
    <div className="col-lg-9">
      <div className="my-account__edit-password-form mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const currentPassword = e.target.current_password.value;
            const newPassword = e.target.new_password.value;
            const confirmPassword = e.target.new_password_confirmation.value;
            handleChangePassword(currentPassword, newPassword, confirmPassword);
          }}
          className="needs-validation"
        >
          <div className="row">
            <div className="col-md-12">
              <h5 className="text-uppercase mb-0">Thay đổi mật khẩu</h5>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="password"
                  className="form-control"
                  id="account_current_password"
                  name="current_password"
                  placeholder="Mật khẩu hiện tại"
                />
                <label htmlFor="account_current_password">
                  Mật khẩu hiện tại
                </label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="password"
                  className="form-control"
                  id="account_new_password"
                  name="new_password"
                  placeholder="Mật khẩu mới"
                />
                <label htmlFor="account_new_password">Mật khẩu mới</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating my-3">
                <input
                  type="password"
                  className="form-control"
                  id="account_confirm_password"
                  name="new_password_confirmation"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <label htmlFor="account_confirm_password">
                  Xác nhận mật khẩu mới
                </label>
              </div>
            </div>
            <div className="col-md-12 flex justify-end mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-danger bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
