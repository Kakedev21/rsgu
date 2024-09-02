
import { Suspense } from "react";
import ProductsCategoryContent from "./_components/categoryContent";

const CategoryPage = () => {


  return (
    <Suspense>
      <ProductsCategoryContent/>
    </Suspense>
  )
}

export default CategoryPage;
