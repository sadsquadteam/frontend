import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/images/logo-text.svg";
import box1 from "../../assets/images/box/box-1.svg";
import box2 from "../../assets/images/box/box-2.svg";
import box3 from "../../assets/images/box/box-3.svg";
import box4 from "../../assets/images/box/box-4.svg";
import girl1 from "../../assets/images/girl2/girl-1.svg";
import girl2 from "../../assets/images/girl2/girl-2.svg";
import girl3 from "../../assets/images/girl2/girl-3.svg";
import girl4 from "../../assets/images/girl2/girl-4.svg";
import girl5 from "../../assets/images/girl2/girl-5.svg";
import girl6 from "../../assets/images/girl2/girl-6.svg";
import girl7 from "../../assets/images/girl2/girl-7.svg";
import girl8 from "../../assets/images/girl2/girl-8.svg";
import girl9 from "../../assets/images/girl2/girl-9.svg";
import girl10 from "../../assets/images/girl2/girl-10.svg";
import girl11 from "../../assets/images/girl2/girl-11.svg";
import profile from '../../assets/images/Profile.svg'; 
import open_eye from '../../assets/images/Open-eye.svg';
import closed_eye from '../../assets/images/Closed-eye.svg';

const girlFrames = [
  girl1, girl2, girl3, girl4, girl5, girl6, girl7, girl8, girl9, girl10, girl11
];
const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

    // Simulate successful login
  const user = { 
    email: formData.email,
    // Add other user properties as needed
  };
  
  // Save user to localStorage
  localStorage.setItem('user', JSON.stringify(user));
  
  // Navigate to dashboard
  navigate("/dashboard", { state: { user } });
  };

  return (
    <div className="login-container">

      <div className="login-panel">
        <img src={logo} alt="Lost & Found" className="login-logo" />

        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <label>Email Address</label>
          <div className="input-wrapper">
              <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
              />
              <img src={profile} alt="profile" className="input-icon" />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Password</label>
          <div className="input-wrapper">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
            />
            <img
                src={showPassword ? closed_eye : open_eye}
                alt="toggle password"
                className="input-icon clickable"
                onClick={() => setShowPassword(prev => !prev)}
            />
          </div>
          {errors.password && <span className="error">{errors.password}</span>}

          <button type="submit">Sign In</button>

          <p className="signup">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Sign up</span>
          </p>

        </form>
      </div>
      <div className="left-side-login">
          <div className="girl-animation-login">
              {girlFrames.map((frame, index) => (
                  <img key={index} src={frame} alt="" className="girl-frame-login" />
              ))}
          </div>
          <div className="box-animation-login">
                              <img src={box1} alt="" />
                              <img src={box2} alt="" />
                              <img src={box3} alt="" />
                              <img src={box4} alt="" />
          </div>
      </div>

    </div>
  );
};

export default Login;