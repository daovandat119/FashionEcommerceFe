import { useState } from "react";

const SearchBar = ({ isVisible, onClose }) => {
  return (
    <div className={`search-bar ${isVisible ? "visible" : ""}`}>
      <input type="text" placeholder="Tìm kiếm..." />
      <button onClick={onClose}>Đóng</button>
    </div>
  );
};

export default SearchBar;
