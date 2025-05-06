/********************************************************
 * /src/components/Orders/OrderDetailModal.jsx
 ********************************************************/
import "./OrderDetailModal.css";
import { Modal, Table } from "antd";
import PropTypes from "prop-types";

const OrderDetailModal = ({ visible, onClose, order }) => {
  if (!order) return null;

  const columns = [
    { title: "Ürün Adı", dataIndex: "name", key: "name" },
    { title: "Marka", dataIndex: "brand", key: "brand" },
    { title: "Kategori", dataIndex: "category", key: "category" },
    { title: "Renk", dataIndex: "color", key: "color" },
    { title: "Beden", dataIndex: "size", key: "size" },
    { title: "Adet", dataIndex: "quantity", key: "quantity" },
    {
      title: "Birim Fiyat",
      dataIndex: "price",
      key: "price",
      render: (p) => `${p.toFixed(2)}₺`,
    },
    {
      title: "Ara Toplam",
      key: "subtotal",
      render: (_, item) => `${(item.price * item.quantity).toFixed(2)}₺`,
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={`Sipariş Detay #${order._id.slice(-6)}`}
      width={700}
      className="order-detail-modal"
    >
      <p>
        <strong>Gönderim Adresi:</strong> {order.address}, {order.city}{" "}
        {order.district}
      </p>
      <p>
        <strong>Alıcı:</strong> {order.name} ({order.phone})
      </p>

      <div className="order-detail-table">
        <Table
          dataSource={order.items}
          columns={columns}
          pagination={false}
          rowKey={(rec) => rec.productId}
        />
      </div>

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <strong>Toplam:</strong> {order.total.toFixed(2)}₺
      </div>
    </Modal>
  );
};

OrderDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    _id: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number,
  }),
};

export default OrderDetailModal;
