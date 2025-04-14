import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryHeader from "../components/Layout/Headers/CategoryHeader";
import ProductFilter from "../components/Products/ProductFilter";
import ProductList from "../components/Products/ProductList";
import "./ShopPage.css"; // yeni stil dosyası ekleyeceğiz

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  return (
    <Fragment>
      <CategoryHeader />
      <div className="shop-content">
        <div className="shop-layout">
          <ProductFilter />
          <ProductList category={categoryParam} />
        </div>
      </div>
    </Fragment>
  );
};

export default ShopPage;
