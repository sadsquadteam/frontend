import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/images/logo-text.svg";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Login data:", formData);
    // 🔜 send to backend
  };

  return (
    <div className="login-container">

      <div className="login-panel">
        <img src={logo} alt="Lost & Found" className="login-logo" />

        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <button type="submit">Sign In</button>

          <p className="signup">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Sign up</span>
          </p>

        </form>
      </div>


    </div>
  );
};

export default Login;