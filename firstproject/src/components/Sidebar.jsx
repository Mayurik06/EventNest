import React, { useState } from 'react'
import {FaTh,FaBars} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { BiSolidCalendarEvent } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'
import Header from '../components/Header'
import { AiFillDashboard } from "react-icons/ai";

const Sidebar = ({children}) => {
    const [isOpen, setIsOPen] = useState(true);
    const toggle =() => setIsOPen(!isOpen);
    const menuItem=[
        {
            path:"/dashboard",
            name:"Dashboard",
            icon:<AiFillDashboard />
         },
        {
            path:"/Create",
            name:"Event Type",
            icon:<IoIosAddCircle/>
        },
        {
          path:"/MyCalendar",
          name:"Add Event",
          icon:<BiSolidCalendarEvent />
      },
    ]
  return (
    <>
    {/* <Header heading={"mayuri"} style={{marginLeft:isOpen?'250px':'60px'}}></Header> */}
    <div className='main-sidebar'>
    
      <div style={{width:isOpen ? "250px" : "70px" } } className="sidebar">
        <div className="top_section">
            {/* <h1 style={{display :isOpen ? "block" : "none" } } className="logo">Logo</h1> */}
            <img src={logo} alt="" style={{display :isOpen ? "block" : "none" ,width:'150px',margin:'0'} } className="logo" />
            <div style={{marginLeft:isOpen ? "50px" : "10px" } } className="bars">
                <FaBars onClick={toggle}/>
            </div>
        </div>
        {
               menuItem.map((item,index)=>(
                <NavLink to={item.path} key={index} className="link"
                activeclassName="active">
                    <div className="icon">{item.icon}</div>
                    <div style={{display:isOpen ? "block" : "none" } } className="link_text">{item.name}</div>
                </NavLink>
               ))
        }
      </div>
      <main style={{marginLeft:isOpen?'250px':'60px'}}>{children}</main>
    </div>
    </>
  )
}

export default Sidebar