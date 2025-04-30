import { Modal, Table, Divider, Row, Col } from "antd";
import PropTypes from "prop-types";

const AdminOrderDetailsModal = ({ visible, onClose, order }) => {
  if (!order) return null;

  const columns = [
    { 
      title: "Ürün Adı", 
      dataIndex: "name", 
      key: "name",
      width: 200, // Başlık ve hücre genişliğini sabitliyoruz
    },
    { 
      title: "Marka", 
      dataIndex: "brand", 
      key: "brand",
      width: 150,
    },
    { 
      title: "Kategori", 
      dataIndex: "category", 
      key: "category",
      width: 150,
    },
    { 
      title: "Renk", 
      dataIndex: "color", 
      key: "color",
      width: 100,
    },
    { 
      title: "Beden", 
      dataIndex: "size", 
      key: "size",
      width: 100,
    },
    { 
      title: "Adet", 
      dataIndex: "quantity", 
      key: "quantity",
      width: 100,
    },
    { 
      title: "Birim Fiyat", 
      dataIndex: "price", 
      key: "price",
      width: 150,
      render: (p) => `${p.toFixed(2)}₺`,
    },
    { 
      title: "Ara Toplam", 
      key: "subtotal",
      width: 150,
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
      width="80%" // Modal genişliği
      style={{ maxWidth: "1000px", overflow: "hidden" }} // Taşmayı engelleme
    >
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <p>
            <strong>Sipariş ID:</strong> {order._id}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Kullanıcı ID:</strong> {order.userId}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 8]}>
        <Col span={24}>
          <p>
            <strong>Alıcı:</strong> {order.name}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Telefon Numarası:</strong> {formatPhone(order.phone)}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Adres:</strong> {order.address}, {order.district},{" "}
            {order.city}
          </p>
        </Col>
        {order.paymentMethod && (
          <Col span={24}>
            <p>
              <strong>Ödeme Yöntemi:</strong> {order.paymentMethod}
            </p>
          </Col>
        )}
        {order.shippingMethod && (
          <Col span={24}>
            <p>
              <strong>Kargo Yöntemi:</strong> {order.shippingMethod}
            </p>
          </Col>
        )}
        {order.note && (
          <Col span={24}>
            <p>
              <strong>Not:</strong> {order.note}
            </p>
          </Col>
        )}
      </Row>

      <Divider />

      <Table
        dataSource={order.items}
        columns={columns}
        pagination={false}
        rowKey={(rec) => rec.productId}
        size="small"
        scroll={{ x: "max-content", y: 400 }} // Yatay kaydırma ve dikey kaydırma
        style={{ overflowX: "auto", maxWidth: "100%" }} // Taşma engelleniyor, yatay kaydırma sağlanıyor
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