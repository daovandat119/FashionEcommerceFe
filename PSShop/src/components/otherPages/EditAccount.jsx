import React, { useEffect, useState } from "react";

export default function EditAccount() {
  const [accountData, setAccountData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/account", {
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
    setMessage("");
  };

  const handleShowPasswordForm = () => {
    setShowPasswordForm(true);
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/api/update-profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
      }),
    });

    const textResponse = await response.text();
    console.log("Phản hồi từ API:", textResponse);

    try {
      const result = JSON.parse(textResponse);
      if (response.ok) {
        setMessage(result.message);
        setAccountData(result.data);
      } else {
        console.error("Lỗi từ API:", response.status, textResponse);
        setMessage("Có lỗi xảy ra khi cập nhật thông tin.");
      }
    } catch (error) {
      console.error("Lỗi phân tích cú pháp JSON:", error);
      setMessage("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__edit">
        <div className="my-account__info bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md">
          {accountData && !showPasswordForm && (
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Thông tin tài khoản
                </h3>
                {accountData.image && (
                  <img
                    src={accountData.image}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mb-4"
                  />
                )}
                <p>
                  <strong>Tên người dùng:</strong> {accountData.username}
                </p>
                <p>
                  <strong>Email:</strong> {accountData.email}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {accountData.is_active ? "Kích hoạt" : "Không kích hoạt"}
                </p>
              </div>
              <button
                onClick={handleEditClick}
                className="btn btn-secondary h-10 py-2 px-4 float-right bg-dark text-white rounded"
              >
                Sửa tài khoản
              </button>
            </div>
          )}
        </div>

        {isEditing && !showPasswordForm && (
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
                    <label htmlFor="account_display_name">Tên hiển thị</label>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="text"
                      className="form-control"
                      id="account_image"
                      placeholder="URL hình ảnh"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <label htmlFor="account_image">URL hình ảnh</label>
                  </div>
                </div>

                <div className="col-md-12 flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="btn btn-dark text-white py-2 px-4 rounded hover:bg-gray-800 mr-2"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="btn btn-dark bg-dark-500 text-white py-2 px-4 rounded hover:bg-dark-600"
                  >
                    Cập nhật thông tin
                  </button>
                  <button
                    type="button"
                    onClick={handleShowPasswordForm}
                    className="btn btn-dark bg-dark-500 text-white py-2 px-4 rounded hover:bg-dark-600 ml-2"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
          </div>
        )}

        {isEditing && showPasswordForm && (
          <div className="my-account__edit-password-form mt-6">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="needs-validation"
            >
              <div className="row">
                <div className="col-md-12">
                  <div className="my-3">
                    <h5 className="text-uppercase mb-0">Thay đổi mật khẩu</h5>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating my-3">
                    <input
                      type="password"
                      className="form-control"
                      id="account_current_password"
                      placeholder="Mật khẩu hiện tại"
                      required
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
                      placeholder="Mật khẩu mới"
                      required
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
                      placeholder="Xác nhận mật khẩu mới"
                      required
                    />
                    <label htmlFor="account_confirm_password">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="invalid-feedback">Mật khẩu không khớp!</div>
                  </div>
                </div>

                <div className="col-md-12 flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="btn btn-dark bg-dark-500 text-white py-2 px-4 rounded hover:bg-dark-600 mr-2"
                  >
                    Hủy
                  </button>
                  <button className="btn btn-primary bg-dark-500 text-white py-2 px-4 rounded hover:bg-dark-600">
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
