import AddCategories from "./AddCategories";
import UpdateCategory from "./UpdateCategory";
import CategoriesList from "./CategoriesList";

const CategoryManager = () => {
  return (
    <>
      <CategoriesList />
      <AddCategories />
      <UpdateCategory />
    </>
  );
};

export default CategoryManager;
