/********************************************************
 * /Applications/Works/e-commerce/frontend/src/pages/ShopPage.jsx
 ********************************************************/
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import Categories from "../components/Categories/Categories";
// import Products from "../components/Products/Products";
import ProductList from "../components/Products/ProductList";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  // URL'deki ?category=xxx al
  const categoryParam = searchParams.get("category"); // null veya string

  return (
    <Fragment>
      <Categories />
      {/* <Products /> */}
      {/* "category" prop'u ProductList'e geç */}
      <ProductList category={categoryParam} />
    </Fragment>
  );
};

export default ShopPage;
