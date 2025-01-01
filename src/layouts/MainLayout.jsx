/********************************************************
 * /Applications/Works/e-commerce/frontend/src/layouts/MainLayout.jsx
 ********************************************************/
import { useEffect, useState } from "react";
import Proptypes from "prop-types";

import Footer from "../components/Layout/Footer/Footer";
import Header from "../components/Layout/Header/Header";
import Search from "../components/Modals/Search/Search";
import Dialog from "../components/Modals/Dialog/Dialog";
import { Outlet } from "react-router-dom";

/**
 * Bu layout normal sayfalarda kullanılıyor.
 * "children" prop'u, <Route element={<MainLayout>...</MainLayout>} ...> eklenince
 * bu bileşenin içine yerleştirilir.
 */
const MainLayout = ({ children }) => {
  const [isSearchShow, setIsSearchShow] = useState(false);
  const [isDialogShow, setIsDialogShow] = useState(false);

  useEffect(() => {
    const dialogStatus = localStorage.getItem("dialog")
      ? JSON.parse(localStorage.getItem("dialog"))
      : true;

    // "dialog" localStorage yoksa ayarlayalım
    if (!localStorage.getItem("dialog")) {
      localStorage.setItem("dialog", JSON.stringify(true));
    }

    // 2sn sonra dialog açalım
    setTimeout(() => {
      setIsDialogShow(dialogStatus);
    }, 2000);
  }, []);

  return (
    <div className="main-layout">
      <Dialog isDialogShow={isDialogShow} setIsDialogShow={setIsDialogShow} />
      <Search isSearchShow={isSearchShow} setIsSearchShow={setIsSearchShow} />
      <Header setIsSearchShow={setIsSearchShow} />
      <div style={{ minHeight: "80vh" }}>
        {children}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: Proptypes.node,
};

export default MainLayout;
