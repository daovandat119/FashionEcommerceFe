import React, { useState } from "react";
import { Input, Button } from "@material-tailwind/react";

const AddColor = () => {
  const [colorData, setColorData] = useState({
    id: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New color:", colorData); // Thay thế với hàm gửi dữ liệu đến backend
    setColorData({ id: "", color: "" }); // Reset form
  };

  return (
    <div className="flex ">
      <div className="w-3/4 px-4 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Color</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <Input
              label="Color ID"
              name="id"
              value={colorData.id}
              onChange={handleChange}
              required
            /> */}
            <Input
              label="Color Name"
              name="color"
              value={colorData.color}
              onChange={handleChange}
              required
            />
            <Button type="submit" color="green">
              Add Color
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddColor;
