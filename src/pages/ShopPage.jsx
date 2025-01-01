import { Fragment } from "react";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import ProductList from "../components/Products/ProductList";
// import CampaignSingle from "../components/CampaignSingle/CampaignSingle";

const ShopPage = () => {
  return (
    <Fragment>
      <Categories />
      <Products />
      {/* <CampaignSingle /> */}
      <ProductList />
    </Fragment>
  );
};

export default ShopPage;
