// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { Input, Button } from "@material-tailwind/react";
// import { ChevronDownIcon } from "@heroicons/react/24/solid";

const UpdateColor = () => {
  const [colorData, setColorData] = useState({
    colorName: "",
    colorCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated color:", colorData);
  };

  return (
    <div className="flex">
      <div className="w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update Color</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Color Code"
              name="colorCode"
              value={colorData.colorCode}
              onChange={handleChange}
              required
            />
            <Button type="submit" color="green">
              Update Color
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateColor;
