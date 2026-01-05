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
    const [setIsOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
        
        setShowOtpPopup(true);
        simulateSendOtp();
    };

    const simulateSendOtp = () => {
        setIsOtpSent(true);
        console.log(`OTP sent to: ${formData.email}`);
        // API call here
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
        
        setOtpError("");
        
        // Auto-submit when all 6 digits are entered
        if (newOtp.every(digit => digit !== "") && index === 5) {
            verifyOtp();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
        
        // Allow pasting OTP
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            // Handle paste will be done in onPaste event
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
            
            const lastFilledIndex = Math.min(digits.length - 1, 5);
            const lastInput = document.getElementById(`otp-${lastFilledIndex}`);
            if (lastInput) lastInput.focus();
            
            // Auto-submit if 6 digits were pasted
            if (digits.length === 6) {
                setTimeout(() => verifyOtp(), 100);
            }
        }
    };

    const handleResendOtp = () => {
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        simulateSendOtp();
        
        setTimeout(() => {
            const firstInput = document.getElementById("otp-0");
            if (firstInput) firstInput.focus();
        }, 100);
    };

    const verifyOtp = () => {
        const otpString = otp.join("");
        
        if (otpString.length !== 6) {
            setOtpError("Please enter the complete verification code");
            return;
        }

        console.log("Verifying OTP:", otpString);
        
        if (otpString.length === 6) {
            const user = { email: formData.email };
            localStorage.setItem('user', JSON.stringify(user));
            navigate("/dashboard", { state: { user } });
        } else {
            setOtpError("Invalid verification code");
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

                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? "input-error" : ""}
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

                    <button type="submit">Sign Up</button>

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
                            >
                                Resend
                            </button>
                        </div>

                        <div className="otp-button">
                            <button 
                                type="button" 
                                className="otp-continue"
                                onClick={verifyOtp}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;