import React, { useState } from "react";
import { Input, Button, Checkbox } from "@material-tailwind/react";
import axios from "axios";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");


  const handleSubmit = () => {
    const URL_BACKEND = "http://127.0.0.1:8000/api/categories/"
    const data = {
      
    }
   axios.post()
    // Xử lý thêm danh mục mới ở đây
    console.log("New category:", { categoryName });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form  className="space-y-6">
          <div>
            <Input
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSubmit} type="submit" color="green">
              Add Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
