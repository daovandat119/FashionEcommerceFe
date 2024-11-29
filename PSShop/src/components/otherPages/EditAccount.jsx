import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditAccount() {
  const [accountData, setAccountData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/users/account", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setAccountData(result.data);
      setName(result.data.username);
      setImage(result.data.image);
    };
    fetchAccountData();
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
    
  };
  const handleShowPasswordForm = () => setShowPasswordForm(true);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleUpdateProfile = async () => {
    if (!name || name.length < 3) {
      toast.error("Tên không được để trống và phải có ít nhất 3 ký tự!");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    const response = await fetch("http://127.0.0.1:8000/api/users/update-profile", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      return;
    }

    toast.success("Cập nhật thông tin thành công.");
    
    window.location.reload();
  };

  const handleChangePassword = async (currentPassword, newPassword, confirmPassword) => {
    const token = localStorage.getItem("token");

    if (newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
    }

    if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp!");
        return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/users/change-password/", {
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
    });

    if (!response.ok) {
        const textResponse = await response.text();
        if (response.status === 400) {
            toast.error("Mật khẩu hiện tại sai.");
        } else {
            toast.error("Có lỗi xảy ra khi đổi mật khẩu.");
        }
        console.error("Lỗi từ API:", response.status, textResponse);
        return;
    }

    const result = await response.json();
    toast.success(result.message);
    localStorage.removeItem("token");
    setTimeout(() => {
        navigate("/login_register");
    }, 2000);
  };

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__edit">
        <div className="my-account__info bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md">
          {accountData && !showPasswordForm && (
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>
                {accountData.image && (
                  <img src={accountData.image} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
                )}
                <p><strong>Tên người dùng:</strong> {accountData.username}</p>
                <p><strong>Email:</strong> {accountData.email}</p>
                <p><strong>Trạng thái:</strong> {accountData.is_active ? "Kích hoạt" : "Không kích hoạt"}</p>
              </div>
              <button onClick={handleEditClick} className="btn btn-secondary h-10 py-2 px-4 float-right bg-dark text-white rounded">
                Sửa tài khoản
              </button>
            </div>
          )}
        </div>

        {isEditing && !showPasswordForm && (
          <div className="my-account__edit-form mt-6">
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="needs-validation">
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
                  <button type="button" onClick={handleCancelClick} className="btn btn-danger bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2">Hủy</button>
                  <button type="submit" className="btn btn-primary bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Cập nhật thông tin</button>
                  <button type="button" onClick={handleShowPasswordForm} className="btn btn-secondary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2">Đổi mật khẩu</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {isEditing && showPasswordForm && (
          <div className="my-account__edit-password-form mt-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              const currentPassword = e.target.current_password.value;
              const newPassword = e.target.new_password.value;
              const confirmPassword = e.target.new_password_confirmation.value;
              handleChangePassword(currentPassword, newPassword, confirmPassword);
            }} className="needs-validation">
              <div className="row">
                <div className="col-md-12">
                  <h5 className="text-uppercase mb-0">Thay đổi mật khẩu</h5>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input type="password" className="form-control" id="account_current_password" name="current_password" placeholder="Mật khẩu hiện tại" required />
                    <label htmlFor="account_current_password">Mật khẩu hiện tại</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input type="password" className="form-control" id="account_new_password" name="new_password" placeholder="Mật khẩu mới" required />
                    <label htmlFor="account_new_password">Mật khẩu mới</label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input type="password" className="form-control" id="account_confirm_password" name="new_password_confirmation" placeholder="Xác nhận mật khẩu mới" required />
                    <label htmlFor="account_confirm_password">Xác nhận mật khẩu mới</label>
                  </div>
                </div>
                <div className="col-md-12 flex justify-end mt-4">
                  <button type="button" onClick={handleCancelClick} className="btn btn-danger bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2">Hủy</button>
                  <button type="submit" className="btn btn-primary bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Cập nhật mật khẩu</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
