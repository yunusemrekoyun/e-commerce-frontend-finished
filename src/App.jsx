/********************************************************
 * /Applications/Works/e-commerce/frontend/src/App.jsx
 ********************************************************/
import { Route, Routes, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
// import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import Success from "./pages/Success";
import UserAccountPage from "./pages/UserAccountPage";
import DashboardPage from "./pages/Admin/DashBoardPage";
import UserPage from "./pages/Admin/UserPage";
import CategoryPage from "./pages/Admin/Categories/CategoryPage";
import UpdateCategoryPage from "./pages/Admin/Categories/UpdateCategoryPage";
import CreateCategoryPage from "./pages/Admin/Categories/CreateCategoryPage";
import ProductPage from "./pages/Admin/Products/ProductPage";
import CreateProductPage from "./pages/Admin/Products/CreateProductPage";
import UpdateProductPage from "./pages/Admin/Products/UpdateProductPage";
import DiscountPage from "./pages/Admin/Products/DiscountPage";
import CouponPage from "./pages/Admin/Coupons/CouponPage";
import CreateCouponPage from "./pages/Admin/Coupons/CreateCouponPage";
import UpdateCouponPage from "./pages/Admin/Coupons/UpdateCouponPage";
import OrderPage from "./pages/Admin/Orders/OrderPage";

import CommentsPage from "./pages/Admin/CommentsPage";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/blog" element={<BlogDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/account" element={<UserAccountPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="*" element={<Outlet />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="categories/create" element={<CreateCategoryPage />} />
        <Route path="categories/update/:id" element={<UpdateCategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="products/update/:id" element={<UpdateProductPage />} />
        <Route path="products/discounts" element={<DiscountPage />} />
        <Route path="coupons" element={<CouponPage />} />
        <Route path="coupons/create" element={<CreateCouponPage />} />
        <Route path="coupons/update/:id" element={<UpdateCouponPage />} />
        <Route path="orders" element={<OrderPage />} />
        ***
        <Route path="comments" element={<CommentsPage />} />
        ***
        <Route path="*" element={<Outlet />} />
      </Route>
    </Routes>
  );
}

export default App;
