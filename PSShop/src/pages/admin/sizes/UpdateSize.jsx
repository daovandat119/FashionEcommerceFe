// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Input, Button } from "@material-tailwind/react";

const UpdateSize = () => {
  const [sizeData, setSizeData] = useState({
    id: "",
    sizeName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSizeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated size:", sizeData);
  };

  return (
    <div className="flex">
      <div className="w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update Size</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="ID"
              name="id"
              value={sizeData.id}
              onChange={handleChange}
              required
            />
            <Input
              label="Size Name"
              name="sizeName"
              value={sizeData.sizeName}
              onChange={handleChange}
              required
            />
            <Button type="submit" color="green">
              Update Size
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSize;
