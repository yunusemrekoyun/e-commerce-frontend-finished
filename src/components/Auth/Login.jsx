/********************************************************
 * /Applications/Works/e-commerce/frontend/src/components/Auth/Login.jsx
 ********************************************************/
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setLoading(false);
        return message.error("Email veya şifre hatalı.");
      }

      const data = await response.json();
      // data: { message, token, refreshToken, role }

      // 1) Access token
      localStorage.setItem("token", data.token);
      // 2) Refresh token
      localStorage.setItem("refreshToken", data.refreshToken || "");
      // 3) isAdmin
      if (data.role === "admin") {
        localStorage.setItem("isAdmin", "true");
        message.success("Admin girişi başarılı!");
        navigate("/admin");
      } else {
        localStorage.setItem("isAdmin", "false");
        message.success("Kullanıcı girişi başarılı!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-column">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <span>
              Email address <span className="required">*</span>
            </span>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <p className="remember">
          <label>
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button className="btn btn-sm" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </p>
        <a href="#" className="form-link">
          Lost your password?
        </a>
      </form>
    </div>
  );
};

export default Login;
