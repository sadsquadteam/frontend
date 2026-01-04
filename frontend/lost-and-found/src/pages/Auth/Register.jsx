import { useState } from "react";
import "./Register.css";
import logo from "../../assets/images/logo-text.svg";
// import box from "../../assets/images/box.svg";
import box1 from "../../assets/images/box/box-1.svg";
import box2 from "../../assets/images/box/box-2.svg";
import box3 from "../../assets/images/box/box-3.svg";
import box4 from "../../assets/images/box/box-4.svg";
import girl1 from "../../assets/images/girl/girl-1.svg";
import girl2 from "../../assets/images/girl/girl-2.svg";
import girl3 from "../../assets/images/girl/girl-3.svg";
import girl4 from "../../assets/images/girl/girl-4.svg";
import girl5 from "../../assets/images/girl/girl-5.svg";
import girl6 from "../../assets/images/girl/girl-6.svg";
import girl7 from "../../assets/images/girl/girl-7.svg";
import girl8 from "../../assets/images/girl/girl-8.svg";
import girl9 from "../../assets/images/girl/girl-9.svg";
import girl10 from "../../assets/images/girl/girl-10.svg";

const girlFrames = [
  girl1, girl2, girl3, girl4, girl5, girl6, girl7, girl8, girl9, girl10
];


const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear error as user types
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        }

        if (
            formData.password &&
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("Register data:", formData);

        // 🔜 Send to backend here
    };

    return (
        <div className="container">

            <div className="left-panel">
                <img src={logo} alt="Lost & Found" className="logo" />

                <h2>Register</h2>

                <form className="form" onSubmit={handleSubmit} noValidate>

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

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? "input-error" : ""}
                    />
                    {errors.confirmPassword && (
                        <span className="error">{errors.confirmPassword}</span>
                    )}

                    <button type="submit">Sign Up</button>

                    <p className="signin">
                        Already have an account? <a href="#">Sign in</a>
                    </p>

                </form>
            </div>

            <div className="right-panel">
                <div className="girl-animation">
                    {girlFrames.map((frame, index) => (
                        <img key={index} src={frame} alt="" className="girl-frame" />
                    ))}
                </div>
                {/* <img src={box} alt="Lost & Found Box" className="box-img" /> */}
                <div className="box-animation">
                    <img src={box1} alt="" />
                    <img src={box2} alt="" />
                    <img src={box3} alt="" />
                    <img src={box4} alt="" />
                </div>
            </div>

        </div>
    );
};

export default Register;
