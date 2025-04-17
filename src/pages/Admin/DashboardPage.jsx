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
        const res = await fetchWithAuth(`${apiUrl}/api/dashboard`);
        if (!res.ok) throw new Error();
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
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Toplam Ürün Satışı" value={stats.totalSales} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Toplam Müşteri Sayısı"
              value={stats.totalCustomers}
            />
          </Card>
        </Col>
        <Col span={8}>
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
        <LineChart
          width={600}
          height={300}
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
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h2>Son 6 Aydaki Müşteri Artışı</h2>
        <LineChart
          width={600}
          height={300}
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
      </Card>
    </div>
  );
};

export default DashboardPage;
