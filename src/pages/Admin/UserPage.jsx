/* frontend/src/pages/Admin/UserPage.jsx */
import { Button, Popconfirm, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";

/* /src/pages/Admin/UserPage.jsx */
const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const columns = [
    // Avatar kolonu tamamen kaldırıldı
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Kullanıcıyı Sil"
          description="Kullanıcıyı silmek istediğinizden emin misiniz?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteUser(record.email)}
        >
          <Button type="primary" danger>
            Sil
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/users`);
      if (res.ok) {
        setDataSource(await res.json());
      } else {
        message.error("Veri getirme başarısız.");
      }
    } catch (err) {
      console.error(err);
      message.error("Veri hatası.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteUser = async (email) => {
    try {
      const res = await fetch(`${apiUrl}/api/users/${email}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Kullanıcı silindi.");
        fetchUsers();
      } else {
        message.error("Silme başarısız.");
      }
    } catch (err) {
      console.error(err);
      message.error("Silme hatası.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(rec) => rec._id}
      loading={loading}
    />
  );
};

export default UserPage;
