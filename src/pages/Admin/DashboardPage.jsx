import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchWithAuth } from "../../components/Auth/fetchWithAuth";

const DashboardPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    monthlyProductSales: [],
    monthlyCustomerGrowth: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        let res = await fetchWithAuth(`${apiUrl}/api/dashboard`);

        if (res.status === 401 || res.status === 403) {
          const refreshToken = localStorage.getItem("refreshToken");
          const oldAccessToken = localStorage.getItem("token");

          const refreshRes = await fetch(`${apiUrl}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken, oldAccessToken }),
          });

          if (refreshRes.ok) {
            const { token: newToken } = await refreshRes.json();
            localStorage.setItem("token", newToken);

            res = await fetchWithAuth(`${apiUrl}/api/dashboard`);
          } else {
            throw new Error("Token yenilenemedi.");
          }
        }

        if (!res.ok) throw new Error("Veri alınamadı");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard yükleme hatası:", err);
      }
    };

    load();
  }, [apiUrl]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Toplam Ürün Satışı" value={stats.totalSales} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Toplam Müşteri Sayısı"
              value={stats.totalCustomers}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Toplam Gelir"
              value={stats.totalRevenue}
              prefix="₺"
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <h2>Son 6 Aydaki Ürün Satış Artışı</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={stats.monthlyProductSales}
              margin={{ top: 5, right: 30, bottom: 5 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Satış Adedi"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h2>Son 6 Aydaki Müşteri Artışı</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={stats.monthlyCustomerGrowth}
              margin={{ top: 5, right: 30, bottom: 5 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Yeni Müşteri"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;