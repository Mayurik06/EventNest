
import { CiBellOn } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import React, { useState, useEffect, useRef } from 'react';
import '../components/Navbar.css';
import '../components/Style.css';

const Header = ({ heading }) => {


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div>
          <p className="heading">{heading}</p>
        </div>
        <div className="navbar-container">
          {/* <input type="search" /> */}

          <ul className="nav-menu">
            <li className="nav-item">
            <div className="dropdown" ref={dropdownRef} onClick={toggleDropdown}>
              <a href="#" className="nav-link"><FaUserCircle /></a>
              <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
               
                <a href="#" className="dropdown-item" onClick={handleLogout}>Logout</a>
              </div>
            </div>
          </li>
          </ul>
        </div>
      </nav>

      {/* <nav class="navbar fixed-top bg-body-tertiary" style={{Sid}}>
  <div class="container-fluid">
    <a class="navbar-brand" href="#">oooo</a>
  </div>
</nav> */}
    </>
  );
};

export default Header;
