import React, { useState } from "react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const handleSaveCategory = () => {
    console.log("đât",categoryName)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form className="space-y-6">
          <div className="">
            <input className="border-2 p-2 w-full rounded-xl"
              type="text"
              label="Category Name"
              value={categoryName}
              onChange={(event)=> setCategoryName(event.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button onClick={()=> handleSaveCategory()} type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">
              Add Category
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;