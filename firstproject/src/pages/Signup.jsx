import React, { useState } from 'react';
import axios from 'axios';
import signup from '../assets/signup.png';
import './Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Signup() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
const navigate=useNavigate();

  const validateEmail = (email)=> {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    let valid = true;
    setNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setRoleError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name) {
      setNameError('First name is required.');
      valid = false;
    }

    if (!lastName) {
      setLastNameError('Last name is required.');
      valid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!phone) {
      setPhoneError('Phone number is required.');
      valid = false;
    }

    if (!role) {
      setRoleError('Role is required.');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (!valid) {
      return;
    }

    const newUser = {
      firstname: name,
      lastname: lastName,
      email: email,
      phone: phone,
      roles: role,
      password: password,
      confirmPassword: confirmPassword,
    };

  try {
    const response = await axios.post('http://127.0.0.1:4000/api/v1/register', newUser);

    if (response.status === 201) {
      console.log('Signup successful', response.data);
      toast.success('User registered successfully');
      setTimeout(()=>{
        navigate('/login');

      },2000)
    }
  } catch (err) {
    console.error('Error response:', err.response);
    setError(err.response?.data || 'An error occurred');
    if (err.response?.status === 409) {
      toast.error('User already exists');
    }
  }
};
const togglePasswordVisibility = () => {
  setShowPassword((prevState) => !prevState);
};
  return (
    
    <div className="whole-container" style={{backgroundColor:'white'}}> 
      <div className="flex-container">
        <div className="img-container">
          <img src={signup} alt="Signup" />
        </div>
        <div className="forms-container">
          <form onSubmit={handleSignup} className="form-box sign-form">
            <h2 className="head">Sign Up</h2>
            <div className="flex-container-2">
              <div className="input-container">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="input-box"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="error-container">{nameError}</div>
              </div>

              <div className="input-container">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input-box"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className="error-container">{lastNameError}</div>
              </div>

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
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="input-box"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="error-container">{phoneError}</div>
              </div>

              <div className="input-container">
                <label htmlFor="roles">Roles</label>
                <select
                  name="roles"
                  id="roles"
                  className="input-box"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="Teacher">Teacher</option>
                  <option value="Non-teaching Staff">Non-teaching staff</option>
                </select>
                <div className="error-container">{roleError}</div>
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

              <div className="input-container">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input-box"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="error-container">{confirmPasswordError}</div>
              </div>
            </div>
            <button type="submit" className='sub-btn'>Submit</button>
        
            {/* <div className="error-container">{error && error.message}</div> */}
            <p className="create-text">
              Already have an account?<Link to="/login"><span>Log In</span></Link>
            </p>
          </form>
        </div>
      </div>
      {/* <ToastContainer
  position="top-center"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/> */}
    </div>
  );
  }