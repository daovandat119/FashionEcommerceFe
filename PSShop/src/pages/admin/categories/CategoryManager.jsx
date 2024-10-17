
import CategoriesList from "./CategoriesList";
import AddCategoryComponent from "./AddCategories";
import UpdateCategoryComponent from "./UpdateCategories";

const CategoryManager = () => {
  return (
    <>
      <CategoriesList />
      <AddCategoryComponent />
      <UpdateCategoryComponent />
    </>
  );
};

export default CategoryManager;
