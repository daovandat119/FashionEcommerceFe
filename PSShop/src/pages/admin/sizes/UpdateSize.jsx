import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GetSizeById, UpdateSize } from "../service/api_service";
import Swal from "sweetalert2"; // Import SweetAlert

const UpdateSizeComponent = () => {
  const [SizeName, setSizeName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { SizeID } = useParams();

  useEffect(() => {
    const fetchSize = () => {
      GetSizeById(SizeID)
        .then((response) => {
          console.log("Received data:", response);
          if (response) {
            setSizeName(response.SizeName);
          } else {
            throw new Error("Dữ liệu kích thước không hợp lệ");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải kích thước:", err);
          setError("Không thể tải dữ liệu kích thước. Vui lòng thử lại sau.");
          Swal.fire("Lỗi!", "Không thể tải dữ liệu kích thước", "error");
        });
    };

    if (SizeID) {
      fetchSize();
    } else {
      setError("ID kích thước không hợp lệ");
    }
  }, [SizeID]);

  const handleUpdateSize = (e) => {
    e.preventDefault();
    setError("");

    if (!SizeName.trim()) {
      setError("Tên kích thước không được để trống");
      return;
    }

    UpdateSize(SizeID, SizeName)
      .then((response) => {
        if (response.data) {
          console.log("Cập nhật thành công:", response.data);
          Swal.fire(
            "Thành công!",
            "Cập nhật kích thước thành công",
            "success"
          ).then(() => {
            navigate("/admin/sizes");
          });
        } else {
          throw new Error("Không thể cập nhật kích thước");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật Size:", err);
        // Hiển thị thông báo lỗi từ API
        if (err.response && err.response.data) {
          Swal.fire(
            "Lỗi!",
            err.response.data.SizeName[0] ||
              "Đã xảy ra lỗi khi cập nhật kích thước",
            "error"
          );
        } else {
          Swal.fire(
            "Lỗi!",
            "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
            "error"
          );
        }
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tên kích thước</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateSize} className="space-y-6">
          <div>
            <label
              htmlFor="SizeName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Tên kích thước
            </label>
            <input
              placeholder="Nhập tên kích thước muốn cập nhật"
              id="SizeName"
              className="border-2 p-2 w-full rounded-xl"
              type="text"
              value={SizeName}
              onChange={(e) => setSizeName(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <Link
              className="bg-blue-400 text-white px-4 py-2 rounded-md"
              to="/admin/sizes"
            >
              Quay lại kích thước
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Cập nhật kích thước
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSizeComponent;
