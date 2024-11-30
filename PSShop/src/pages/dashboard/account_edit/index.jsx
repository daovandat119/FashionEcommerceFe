import { useState, useEffect } from "react";
import Headers from "../../../components/headers/Headers";
import DashboardSidebar from "../../../components/otherPages/DashboardSidebar";
import Footers from "../../../components/footers/Footers";
import AccountDisplay from "../../../components/otherPages/Account/AccountDisplay";
import EditProfile from "../../../components/otherPages/Account/EditProfile";
import ChangePassword from "../../../components/otherPages/Account/ChangePassword";

export default function AccountEditPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [accountData, setAccountData] = useState(null);

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
    };
    fetchAccountData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowPasswordForm(false);
  };

  const handleShowPasswordForm = () => {
    setShowPasswordForm(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
  };

  const handleUpdate = () => {
    // Cập nhật lại dữ liệu tài khoản sau khi sửa
    // Có thể gọi API để lấy lại dữ liệu mới nếu cần
    setIsEditing(false);
    setShowPasswordForm(false);
  };

  return (
    <>
      <Headers />
      <main className="page-wrapper">
        <section className="my-account container">
          <h2 className="page-title">Tài khoản của tôi</h2>
          <div className="row">
            <DashboardSidebar />
            {!isEditing && !showPasswordForm && (
              <AccountDisplay onEditClick={handleEditClick} />
            )}
            {isEditing && (
              <EditProfile 
                accountData={accountData} 
                onCancel={handleCancel} 
                onUpdate={handleUpdate} 
                onShowPasswordForm={handleShowPasswordForm} 
              />
            )}
            {showPasswordForm && (
              <ChangePassword onCancel={handleCancel} />
            )}
          </div>
        </section>
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
}
