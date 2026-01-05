import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import "./otp.css";
import logo from "../../assets/images/logo-text.svg";
import logoIcon from "../../assets/images/Logo-icon.svg";
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
import profile from '../../assets/images/Profile.svg'; 
import open_eye from '../../assets/images/Open-eye.svg';
import closed_eye from '../../assets/images/Closed-eye.svg';
import { authAPI } from "../../services/api";

const girlFrames = [
  girl1, girl2, girl3, girl4, girl5, girl6, girl7, girl8, girl9, girl10
];

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(""); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
        
        if (apiError) setApiError("");
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
            newErrors.password = "Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            // Step 1: Send email to backend to get OTP
            await authAPI.registerStep1(formData.email);
            
            // Show OTP popup
            setShowOtpPopup(true);
            setIsOtpSent(true);
            
            // Focus on first OTP input
            setTimeout(() => {
                const firstInput = document.getElementById("otp-0");
                if (firstInput) firstInput.focus();
            }, 100);

        } catch (error) {
            setApiError(error.message || "Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError("");
        
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
        
        if (newOtp.every(digit => digit !== "") && index === 5) {
            verifyOtp();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split('').slice(0, 6);
            const newOtp = [...otp];
            
            digits.forEach((digit, index) => {
                if (index < 6) {
                    newOtp[index] = digit;
                }
            });
            
            setOtp(newOtp);
            setOtpError("");
            
            const lastFilledIndex = Math.min(digits.length - 1, 5);
            const lastInput = document.getElementById(`otp-${lastFilledIndex}`);
            if (lastInput) lastInput.focus();
            
            if (digits.length === 6) {
                setTimeout(() => verifyOtp(), 100);
            }
        }
    };

    const handleResendOtp = async () => {
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        
        try {
            await authAPI.registerStep1(formData.email);
            
            setTimeout(() => {
                const firstInput = document.getElementById("otp-0");
                if (firstInput) firstInput.focus();
            }, 100);
            
        } catch (error) {
            setOtpError("Failed to resend OTP. Please try again.");
        }
    };

    const verifyOtp = async () => {
        const otpString = otp.join("");

        setLoading(true);
        setOtpError("");

        try {
            const response = await authAPI.registerStep2(
                formData.email,
                otpString,
                formData.password
            );

            // Store user data
            const userData = {
                email: formData.email,
                id: response.user.id,
                is_verified: response.user.is_verified,
                is_staff: response.user.is_staff,
                created_at: response.user.created_at
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            navigate("/dashboard", { state: { user: userData } });
            
        } catch (error) {
            setOtpError(error.message || "Invalid verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const closeOtpPopup = () => {
        setShowOtpPopup(false);
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setIsOtpSent(false);
    };

    return (
        <div className="container">
            <div className="left-panel">
                <img src={logo} alt="Lost & Found" className="logo" />

                <h2>Register</h2>

                {apiError && <div className="error api-error">{apiError}</div>}

                <form className="form" onSubmit={handleSubmit} noValidate>
                    <label>Email Address</label>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? "input-error" : ""}
                            disabled={loading}
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
                            disabled={loading}
                        />
                        <img
                            src={showPassword ? closed_eye : open_eye}
                            alt="toggle password"
                            className="input-icon clickable"
                            onClick={() => setShowPassword(prev => !prev)}
                        />
                    </div>
                    {errors.password && <span className="error">{errors.password}</span>}

                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? "input-error" : ""}
                            disabled={loading}
                        />
                        <img
                            src={showConfirmPassword ? closed_eye : open_eye}
                            alt="toggle confirm password"
                            className="input-icon clickable"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <span className="error">{errors.confirmPassword}</span>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Sign Up"}
                    </button>

                    <p className="signin">
                        Already have an account? <a href="/login">Sign in</a>
                    </p>
                </form>
            </div>

            <div className="right-panel">
                <div className="girl-animation">
                    {girlFrames.map((frame, index) => (
                        <img key={index} src={frame} alt="" className="girl-frame" />
                    ))}
                </div>
                <div className="box-animation">
                    <img src={box1} alt="" />
                    <img src={box2} alt="" />
                    <img src={box3} alt="" />
                    <img src={box4} alt="" />
                </div>
            </div>

            {showOtpPopup && (
                <div className="otp-overlay">
                    <div className="otp-popup">
                        <button 
                            className="otp-back-btn"
                            onClick={closeOtpPopup}
                            aria-label="Go back"
                            disabled={loading}
                        >
                            &lt;
                        </button>
                        <div className="otp-logo-container">
                            <img 
                                src={logoIcon} 
                                alt="Lost & Found Logo" 
                                className="otp-logo" 
                            />
                        </div>
                        
                        <div className="otp-header">
                            <h3>Enter verification code</h3>
                            <p>A verification code has been sent to:</p>
                            <p className="otp-email">{formData.email}</p>
                            {!isOtpSent && <p className="otp-sending">Sending code...</p>}
                        </div>

                        <div 
                            className="otp-inputs"
                            onPaste={handleOtpPaste}
                        >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    className="otp-input"
                                    autoFocus={index === 0}
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {otpError && <div className="otp-error">{otpError}</div>}

                        <div className="otp-resend">
                            <span>Didn't get a verification code? </span>
                            <button 
                                type="button" 
                                className="resend-btn"
                                onClick={handleResendOtp}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Resend"}
                            </button>
                        </div>

                        <div className="otp-button">
                            <button 
                                type="button" 
                                className="otp-continue"
                                onClick={verifyOtp}
                                disabled={loading || otp.some(digit => digit === "")}
                            >
                                {loading ? "Verifying..." : "Continue"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;