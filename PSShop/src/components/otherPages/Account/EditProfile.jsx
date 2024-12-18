import { useState } from "react";
import Swal from "sweetalert2";

export default function EditProfile({ accountData, onCancel, onUpdate, onShowPasswordForm }) {
  const [name, setName] = useState(accountData.username);
  const [image, setImage] = useState("");

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleUpdateProfile = async () => {
    if (!name || name.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Tên không hợp lệ",
        text: "Tên không được để trống và phải có ít nhất 3 ký tự!",
        showConfirmButton: true,
      });
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/update-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Cập nhật thất bại",
          text: "Có lỗi xảy ra khi cập nhật thông tin.",
          showConfirmButton: true,
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        text: "Cập nhật thông tin thành công.",
        showConfirmButton: false,
        timer: 1500,
      });
      onUpdate();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối với máy chủ. Vui lòng thử lại sau.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="col-lg-9">
      <div className="my-account__edit-form mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProfile();
          }}
          className="needs-validation"
        >
          <div className="row">
            <div className="col-md-12">
              <label htmlFor="account_display_name">Tên hiển thị</label>
              <div className="form-floating my-3">
                <input
                  type="text"
                  className="form-control"
                  id="account_display_name"
                  placeholder="Tên hiển thị"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-12">
              <label htmlFor="account_image">Tải lên hình ảnh</label>
              <div className="form-floating my-3 w-full">
                <input
                  type="file"
                  className="form-control"
                  id="account_image"
                  onChange={handleImageChange}
                />
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
                Cập nhật thông tin
              </button>
              <button
                type="button"
                onClick={onShowPasswordForm}
                className="btn btn-secondary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
