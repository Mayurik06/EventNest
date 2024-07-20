
import { useEffect, useState } from 'react';
import Create from "./pages/Create"

import './App.css';
import Sidebar from "./components/Sidebar"
import Dashboard from './pages/Dashobard'
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import MyCalendar from "./pages/MyCalendar"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./components/Header"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/forget-password" element={<ForgetPassword />} /> */}
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route path="*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

function ProtectedRoutes() {
  const location = useLocation();
  const [heading, setHeading] = useState("Dashboard");

  useEffect(() => {
    switch (location.pathname) {
      // case "/":
      case "/dashboard":
        setHeading("Dashboard");
        break;
      case "/MyCalendar":
        setHeading("My Calendar");
        break;
      case "/Create":
        setHeading("Event Type");
        break;
      default:
        setHeading("Dashboard");
    }
  }, [location.pathname]);

  return (
    <>
      <Sidebar>
        <Header heading={heading} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/MyCalendar" element={<MyCalendar />} />
          <Route path="/Create" element={<Create />} />
        </Routes>
      </Sidebar>
    </>
  );
}

export default App;
