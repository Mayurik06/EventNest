import React, { useState } from "react";
import axios from "axios";
import "./Form.css";
import login from "../assets/login.png";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:4000/api/v1/login", {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful", response.data);
        localStorage.setItem("token", response.data.token);
        sessionStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard", { state: { message: "Login successful" } });
        toast.success("Login successful");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      if (err.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="whole-container" style={{ backgroundColor: "white" }}>
      <div className="flex-container">
        <div className="img-container">
          <img src={login} alt="" />
        </div>
        <div className="forms-container">
          <form onSubmit={handleLogin} className="form-box login-form">
            <h2 className="head">Log In</h2>
            <div className="input-container">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="error-container">{emailError}</div>
            </div>

            <div className="input-container">
              <label htmlFor="password">Password</label>
              <div className="input-box pass-div">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                 
                />
                <i
                  className={`fa-regular ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              <div className="error-container">{passwordError}</div>
            </div>
            <button type="submit" className="sub-btn">
              Log In
            </button>
            <p className="create-text">
              Not Registered?
              <Link to="/signup">
                <span>Create an Account</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
