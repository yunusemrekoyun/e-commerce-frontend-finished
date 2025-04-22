import { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Layout, Menu, Button, Grid } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LaptopOutlined,
  RollbackOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { isAdmin } from "../config/isAdmin";

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    }
  }, [navigate]);

  // Handle menu toggle (open/close)
  const toggleCollapsed = () => {
    setMobileMenuVisible((prevState) => !prevState);
  };

  // Handle click outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // No dependencies, runs once on mount/unmount

  // Handle menu item click
  const handleMenuClick = (path) => {
    navigate(path);
    if (!screens.md) {
      setMobileMenuVisible(false); // Close the menu when an item is clicked
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => handleMenuClick("/admin"),
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Kategoriler",
      children: [
        {
          key: "3",
          label: "Kategori Listesi",
          onClick: () => handleMenuClick("/admin/categories"),
        },
        {
          key: "4",
          label: "Yeni Kategori Oluştur",
          onClick: () => handleMenuClick("/admin/categories/create"),
        },
      ],
    },
    {
      key: "5",
      icon: <LaptopOutlined />,
      label: "Ürünler",
      children: [
        {
          key: "6",
          label: "Ürün Listesi",
          onClick: () => handleMenuClick("/admin/products"),
        },
        {
          key: "7",
          label: "Yeni Ürün Oluştur",
          onClick: () => handleMenuClick("/admin/products/create"),
        },
        {
          key: "8",
          label: "İndirimli Ürünler",
          onClick: () => handleMenuClick("/admin/products/discounts"),
        },
      ],
    },
    {
      key: "9",
      icon: <BarcodeOutlined />,
      label: "Kuponlar",
      children: [
        {
          key: "10",
          label: "Kupon Listesi",
          onClick: () => handleMenuClick("/admin/coupons"),
        },
        {
          key: "11",
          label: "Yeni Kupon Oluştur",
          onClick: () => handleMenuClick("/admin/coupons/create"),
        },
      ],
    },
    {
      key: "12",
      icon: <UserOutlined />,
      label: "Kullanıcı Listesi",
      onClick: () => handleMenuClick("/admin/users"),
    },
    {
      key: "13",
      icon: <ShoppingCartOutlined />,
      label: "Siparişler",
      onClick: () => handleMenuClick("/admin/orders"),
    },
    {
      key: "14",
      icon: <CommentOutlined />,
      label: "Yorumlar",
      onClick: () => handleMenuClick("/admin/comments"),
    },
    {
      key: "15",
      icon: <RollbackOutlined />,
      label: "Ana Sayfa",
      onClick: () => handleMenuClick("/"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Mobile menu visibility controlled */}
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        collapsed={!screens.md && !mobileMenuVisible}
        onCollapse={(collapsed) => setMobileMenuVisible(!collapsed)}
        width={200}
        theme="dark"
        ref={menuRef}
      >
        <Menu mode="inline" style={{ height: "100%" }} items={menuItems} />
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: "#001529",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <div style={{ color: "white", fontSize: "18px" }}>Admin Panel</div>
          {!screens.md && (
            <Button
              icon={<MenuOutlined />}
              type="primary"
              onClick={toggleCollapsed} // Toggle mobile menu visibility
              style={{ border: "none" }}
            />
          )}
        </Header>

        <Content style={{ padding: 24 }}>
          {children}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;