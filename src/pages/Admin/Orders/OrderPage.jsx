import { Spin, Table, Select, message, Input } from "antd";
import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "../../../components/Auth/fetchWithAuth";
import AdminOrderDetailsModal from "./AdminOrderDetailsModal";

const { Option } = Select;

const OrderPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const filteredOrders = dataSource.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/orders/all`);
      if (!res.ok) {
        message.error("Siparişler alınamadı.");
        return;
      }
      const data = await res.json();
      setDataSource(data);
    } catch (err) {
      console.error(err);
      message.error("Veri hatası.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        message.error("Durum güncellenemedi.");
      } else {
        message.success("Durum güncellendi.");
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      message.error("Durum güncelleme hatası.");
    }
  };

  const columns = [
    {
      title: "Sipariş No",
      dataIndex: "_id",
      key: "id",
      render: (id, record) => (
        <a onClick={() => setSelectedOrder(record)}>{id.slice(-6)}</a>
      ),
    },
    {
      title: "Müşteri Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Sipariş Fiyatı",
      dataIndex: "total",
      key: "total",
      render: (total) => <b>{total.toFixed(2)}₺</b>,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record._id, val)}
          style={{ width: 180 }}
        >
          <Option value="Sipariş Alındı">Sipariş Alındı</Option>
          <Option value="Sipariş Onaylandı">Sipariş Onaylandı</Option>
          <Option value="Kargoya Verildi">Kargoya Verildi</Option>
          <Option value="Teslim Edildi">Teslim Edildi</Option>
        </Select>
      ),
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "date",
      render: (d) => new Date(d).toLocaleDateString("tr-TR"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Saat",
      dataIndex: "createdAt",
      key: "time",
      render: (d) =>
        new Date(d).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Sipariş No ile ara"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey={(rec) => rec._id}
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      <AdminOrderDetailsModal
        visible={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderPage;
