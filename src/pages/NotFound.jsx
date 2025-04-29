// src/pages/NotFound.jsx
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ marginTop: "100px", textAlign: "center" }}>
      <Result
        status="404"
        title="404"
        subTitle="Üzgünüz, aradığınız sayfa bulunamadı."
        extra={
          <Link to="/">
            <Button type="primary">Ana Sayfaya Dön</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
