import React, { useState, useEffect } from 'react';
import { UserOutlined, SettingOutlined, TeamOutlined, LeftOutlined, RightOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { message } from 'antd';
import axios from 'axios';
import './Sidebar.scss';
import Smartlogo from "../../Inspect/Smart-logo.png"
import { Link, useNavigate } from 'react-router-dom';
const Sidebar = () => {
    const [usertype, setUserType] = useState('')
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
    const Logoutuser = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
        setTimeout(() => {
            message.success("User logout")
        }, 3000);
    }
    useState(() => {
        const userToken = localStorage.getItem('userinfo');
        if (userToken == "true") {
            setUserType("SuperAdmin")
        }
        else (
            setUserType("User")
        )
    }, [])
    return (
        <div className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sider">
                <img className='logo-image' src={Smartlogo} alt="" />
                {usertype == "SuperAdmin" ? (
                    <ul className="menu">
                        <li className="menu-item" onClick={() => navigate('/')}><TeamOutlined /> Companies</li>
                        {/* <li className="menu-item"><SettingOutlined /> Settings</li> */}
                        <Link to='/leads' style={{ textDecoration: "none" }}>
                            <li className='menu-item' style={{ color: "black" }}><UsergroupAddOutlined /> Leads</li>
                        </Link>
                        <li className="menu-item" onClick={Logoutuser}><LogoutOutlined /> Logout</li>
                    </ul>
                ) : (
                    <ul className='menu'>
                        <li className='menu-item' onClick={() => navigate('/')}><UserOutlined /> Users</li>
                        <Link to='/usersetting' style={{ textDecoration: "none" }}>
                            <li className='menu-item'><SettingOutlined style={{ color: "black" }} /> Settings</li>
                        </Link>
                        <Link to='/leads' style={{ textDecoration: "none" }}>
                            <li className='menu-item' style={{ color: "black" }}><UsergroupAddOutlined /> Leads</li>
                        </Link>
                        <li className="menu-item" onClick={Logoutuser}><LogoutOutlined /> Logout</li>
                    </ul>
                )}
                <button className="collabs-button" onClick={toggleSidebar}>
                    {isSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
                </button>
            </div>
        </div>

    )
}

export default Sidebar