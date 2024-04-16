import React, { useState, useEffect } from 'react';
import { UserOutlined, SettingOutlined, TeamOutlined, LeftOutlined, RightOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { message } from 'antd';
import axios from 'axios';
import './Sidebar.scss';
import Smartlogo from "../../Inspect/Smart-logo.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [usertype, setUserType] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showLeadsMenu, setShowLeadsMenu] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const Logoutuser = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
        setTimeout(() => {
            message.success("User logout");
        }, 4000);
    };

    useEffect(() => {
        const userToken = localStorage.getItem('userinfo');
        if (userToken === "true") {
            setUserType("SuperAdmin");
        } else {
            setUserType("User");
            setShowLeadsMenu(true);
        }
    }, []);

    useEffect(() => {
        if (location.pathname === '/companyuser' || location.pathname === '/leads') {
            setShowLeadsMenu(true);
        } else {
            setShowLeadsMenu(false);
        }
        const userToken = localStorage.getItem('userinfo');
        if (userToken != "true") {
            setShowLeadsMenu(true);
        }
    }, [location.pathname]);


    return (
        <div className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sider">
                <div className='sider-content'>
                    <Link to='/'>
                        <img className='logo-image' src={Smartlogo} alt="" />
                    </Link>
                    {usertype === "SuperAdmin" ? (
                        <ul className="menu">
                            <li className="menu-item" onClick={() => navigate('/')}><TeamOutlined /> Companies</li>
                            {showLeadsMenu ? (
                                <>
                                    <Link to='/leads' style={{ textDecoration: "none" }}>
                                        <li className='menu-item' style={{ color: "black" }}><UsergroupAddOutlined /> Leads</li>
                                    </Link>
                                </>
                            ) : (<>
                            </>)}
                            <li className="menu-item" onClick={Logoutuser}><LogoutOutlined /> Logout</li>
                        </ul>
                    ) : (

                        <ul className='menu'>
                            <li className='menu-item' onClick={() => navigate('/')}><UserOutlined /> Users</li>
                            <Link to='/usersetting' style={{ textDecoration: "none" }}>
                                <li className='menu-item'><SettingOutlined style={{ color: "black" }} /> Settings</li>
                            </Link>
                            {showLeadsMenu ? (
                                <>
                                    <Link to='/leads' style={{ textDecoration: "none" }}>
                                        <li className='menu-item' style={{ color: "black" }}><UsergroupAddOutlined /> Leads</li>
                                    </Link>
                                </>
                            ) : (<>
                            </>)}
                            <li className="menu-item" onClick={Logoutuser}><LogoutOutlined /> Logout</li>
                        </ul>
                    )}
                    <button className="collabs-button" onClick={toggleSidebar}>
                        {isSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
