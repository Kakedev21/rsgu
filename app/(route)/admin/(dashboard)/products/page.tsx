import { Suspense } from "react";
import ProductsContentPage from "./_components/ProductContent";

const ProductPage = () => {

  return (
    <Suspense>
      <ProductsContentPage/>
    </Suspense>
  )
}

export default ProductPage;