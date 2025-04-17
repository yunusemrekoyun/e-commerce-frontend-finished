/*
 * /Applications/Works/e-commerce/frontend/src/pages/Admin/Categories/CategoryPage.jsx
 */
import { Button, Popconfirm, Space, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/categories`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDataSource(data);
    } catch {
      message.error("Veri getirme başarısız.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteCategory = async (categoryId) => {
    try {
      const res = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      message.success("Kategori silindi.");
      fetchCategories();
    } catch {
      message.error("Silme hatası.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const columns = [
    {
      title: "Kategori",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Markalar",
      dataIndex: "brands",
      key: "brands",
      render: (brands) => brands.join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/categories/update/${record._id}`)}
          >
            Güncelle
          </Button>
          <Popconfirm
            title="Kategoriyi sil"
            description="Silmek istediğinizden emin misiniz?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteCategory(record._id)}
          >
            <Button type="primary" danger>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      dataSource={dataSource}
      columns={columns}
      loading={loading}
    />
  );
};

export default CategoryPage;
