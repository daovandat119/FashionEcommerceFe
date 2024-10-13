import React, { useState } from "react";
import { Input, Button, Checkbox } from "@material-tailwind/react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý thêm danh mục mới ở đây
    console.log("New category:", { name: categoryName, active: isActive });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" color="green">
              Add Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
