import { Modal, Table, Divider } from "antd";
import PropTypes from "prop-types";

const AdminOrderDetailsModal = ({ visible, onClose, order }) => {
  if (!order) return null;

  const columns = [
    { title: "Ürün Adı", dataIndex: "name", key: "name" },
    { title: "Marka", dataIndex: "brand", key: "brand" },
    { title: "Kategori", dataIndex: "category", key: "category" },
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
  const formatPhone = (raw) => {
    if (!raw || typeof raw !== "string") return "";
    return raw
      .replace(/^90/, "+90 ")
      .replace(/(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={`Admin Sipariş Detayı - #${order._id.slice(-6)}`}
      width={800}
    >
      <p>
        <strong>Sipariş ID:</strong> {order._id}
      </p>
      <p>
        <strong>Kullanıcı ID:</strong> {order.userId}
      </p>
      <p>
        <strong>Email:</strong> {order.email}
      </p>

      <Divider />

      <p>
        <strong>Alıcı:</strong> {order.name}
      </p>
      <p>
        <strong>Telefon Numarası:</strong> {formatPhone(order.phone)}
      </p>
      <p>
        <strong>Adres:</strong> {order.address}, {order.district}, {order.city}
      </p>

      {order.paymentMethod && (
        <p>
          <strong>Ödeme Yöntemi:</strong> {order.paymentMethod}
        </p>
      )}
      {order.shippingMethod && (
        <p>
          <strong>Kargo Yöntemi:</strong> {order.shippingMethod}
        </p>
      )}
      {order.note && (
        <p>
          <strong>Not:</strong> {order.note}
        </p>
      )}

      <Divider />

      <Table
        dataSource={order.items}
        columns={columns}
        pagination={false}
        rowKey={(rec) => rec.productId}
      />

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <strong>Toplam Tutar:</strong> {order.total?.toFixed(2)}₺
      </div>
    </Modal>
  );
};

AdminOrderDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    _id: PropTypes.string,
    userId: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number,
    paymentMethod: PropTypes.string,
    shippingMethod: PropTypes.string,
    note: PropTypes.string,
  }),
};

export default AdminOrderDetailsModal;
