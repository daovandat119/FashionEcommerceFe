import React from 'react';

const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa các danh mục đã chọn?</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">Hủy</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;