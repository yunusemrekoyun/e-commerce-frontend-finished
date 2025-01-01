/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Auth/Register.jsx
 ********************************************************/
import { useState } from "react";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setLoading(false);
        return message.error("Kayıt başarısız. Email zaten kayıtlı olabilir.");
      }

      message.success("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
      navigate("/auth");
    } catch (error) {
      console.log("Register error:", error);
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-column">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            <span>
              Username <span className="required">*</span>
            </span>
            <input
              type="text"
              onChange={handleInputChange}
              name="username"
              value={formData.username}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span>
              Email address <span className="required">*</span>
            </span>
            <input
              type="email"
              onChange={handleInputChange}
              name="email"
              value={formData.email}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span>
              Password <span className="required">*</span>
            </span>
            <input
              type="password"
              onChange={handleInputChange}
              name="password"
              value={formData.password}
              required
            />
          </label>
        </div>
        <div className="privacy-policy-text remember">
          <p>
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our <a href="#">privacy policy.</a>
          </p>
          <Spin spinning={loading}>
            <button className="btn btn-sm">Register</button>
          </Spin>
        </div>
      </form>
    </div>
  );
};

export default Register;
