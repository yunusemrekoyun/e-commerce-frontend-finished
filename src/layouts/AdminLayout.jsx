/********************************************************
 * frontend/src/layouts/AdminLayout.jsx
 ********************************************************/
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Layout, Menu } from "antd";
import {
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

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    }
  }, [navigate]);

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Kategoriler",
      children: [
        {
          key: "3",
          label: "Kategori Listesi",
          onClick: () => navigate("/admin/categories"),
        },
        {
          key: "4",
          label: "Yeni Kategori Oluştur",
          onClick: () => navigate("/admin/categories/create"),
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
          onClick: () => navigate("/admin/products"),
        },
        {
          key: "7",
          label: "Yeni Ürün Oluştur",
          onClick: () => navigate("/admin/products/create"),
        },
        {
          key: "8",
          label: "İndirimli Ürünler",
          onClick: () => navigate("/admin/products/discounts"),
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
          onClick: () => navigate("/admin/coupons"),
        },
        {
          key: "11",
          label: "Yeni Kupon Oluştur",
          onClick: () => navigate("/admin/coupons/create"),
        },
      ],
    },
    {
      key: "12",
      icon: <UserOutlined />,
      label: "Kullanıcı Listesi",
      onClick: () => navigate("/admin/users"),
    },
    {
      key: "13",
      icon: <ShoppingCartOutlined />,
      label: "Siparişler",
      onClick: () => navigate("/admin/orders"),
    },
    // **Yorumlar** sekmesi:
    {
      key: "14",
      icon: <CommentOutlined />,
      label: "Yorumlar",
      onClick: () => navigate("/admin/comments"),
    },
    {
      key: "15",
      icon: <RollbackOutlined />,
      label: "Ana Sayfa",
      onClick: () => navigate("/"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="dark">
        <Menu mode="inline" style={{ height: "100%" }} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#001529", color: "white" }}>
          <div>Admin Panel</div>
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
