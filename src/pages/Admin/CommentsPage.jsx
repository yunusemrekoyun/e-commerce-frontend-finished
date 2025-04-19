/********************************************************
 * frontend/src/pages/Admin/CommentsPage.jsx
 ********************************************************/
import { useEffect, useState, useCallback } from "react";
import { Tabs, Table, Button, message, Popconfirm, Spin } from "antd";
import { fetchWithAuth } from "../../components/Auth/fetchWithAuth";
import dayjs from "dayjs";

const CommentsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        fetchWithAuth(`${apiUrl}/api/products/admin/reviews?approved=false`),
        fetchWithAuth(`${apiUrl}/api/products/admin/reviews?approved=true`),
      ]);
      if (pRes.ok && aRes.ok) {
        setPending(await pRes.json());
        setApproved(await aRes.json());
      } else {
        message.error("Yorumlar alınamadı.");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = async (record) => {
    try {
      await fetchWithAuth(
        `${apiUrl}/api/products/${record.productId}/reviews/${record.reviewId}/approve`,
        { method: "PUT" }
      );
      message.success("Yorum onaylandı.");
      fetchComments();
    } catch {
      message.error("Onay başarısız.");
    }
  };

  const handleDelete = async (record) => {
    try {
      await fetchWithAuth(
        `${apiUrl}/api/products/${record.productId}/reviews/${record.reviewId}`,
        { method: "DELETE" }
      );
      message.success("Yorum silindi.");
      fetchComments();
    } catch {
      message.error("Silme başarısız.");
    }
  };

  const columns = [
    { title: "Ürün", dataIndex: "productName", key: "productName" },
    { title: "Kullanıcı", dataIndex: "user", key: "user" },
    { title: "Puan", dataIndex: "rating", key: "rating" },
    { title: "Yorum", dataIndex: "text", key: "text" },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => dayjs(d).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {record.approved === false ? (
            <Button type="primary" onClick={() => handleApprove(record)}>
              Onayla
            </Button>
          ) : (
            <Popconfirm
              title="Silinsin mi?"
              onConfirm={() => handleDelete(record)}
              okText="Evet"
              cancelText="Hayır"
            >
              <Button danger>Sil</Button>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];

  const tabsItems = [
    {
      key: "pending",
      label: "Onay Bekleyen",
      children: (
        <Table
          dataSource={pending}
          columns={columns}
          rowKey="reviewId"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: "approved",
      label: "Onaylanan",
      children: (
        <Table
          dataSource={approved}
          columns={columns}
          rowKey="reviewId"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Tabs defaultActiveKey="pending" items={tabsItems} />
    </Spin>
  );
};

export default CommentsPage;
