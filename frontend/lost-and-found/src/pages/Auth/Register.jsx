import { useState } from "react";
import "../../styles/Register.css";
import logo from "../../assets/images/logo-text.svg";
import box from "../../assets/images/box.svg";

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
                <img src={box} alt="Lost & Found Box" className="box-img" />
            </div>

        </div>
    );
};

export default Register;
