import { useState } from "react";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return message.error("Şifreler eşleşmiyor.");
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        return message.error("Kayıt başarısız. Email zaten kayıtlı olabilir.");
      }

      message.success("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
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
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                onChange={handleInputChange}
                name="password"
                value={formData.password}
                required
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
          </label>
        </div>
        <div>
          <label>
            <span>
              Password Again <span className="required">*</span>
            </span>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                onChange={handleInputChange}
                name="confirmPassword"
                value={formData.confirmPassword}
                required
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeOutlined />
                )}
              </span>
            </div>
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
