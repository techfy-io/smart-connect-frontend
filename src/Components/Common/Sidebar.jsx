import React, { useState, useEffect } from 'react';
import { UserOutlined, SettingOutlined, TeamOutlined, CloseCircleOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { message } from 'antd';
import axios from 'axios';
import './Sidebar.scss';
import Smartlogo from "../../Inspect/Smart-logo.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
    const { t, i18n } = useTranslation('translation');
    const [usertype, setUserType] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [showLeadsMenu, setShowLeadsMenu] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 992px)');
        setIsSidebarCollapsed(mediaQuery.matches);
        const handleResize = (e) => setIsSidebarCollapsed(e.matches);
        mediaQuery.addEventListener('change', handleResize);
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const Logoutuser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem('sidebarCollapsed');
        localStorage.removeItem('accessToken')
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

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    return (
        <div className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sider">
                <button className='close-btn' onClick={() => setIsSidebarCollapsed('false')}>
                    <CloseCircleOutlined />
                </button>
                <div className='sider-content'>
                    <Link to='/'>
                        <img className='logo-image' src={Smartlogo} alt="" />
                    </Link>
                    {usertype === "SuperAdmin" ? (
                        <ul className="menu">
                            <li className="menu-item" onClick={() => navigate('/')}><TeamOutlined /> {t("Companies")}</li>
                            {showLeadsMenu ? (
                                <>
                                    <Link to='/leads' style={{ textDecoration: "none" }}>
                                        <li className='menu-item' style={{ color: "black" }}><UsergroupAddOutlined /> {t("Leads")}</li>
                                    </Link>
                                </>
                            ) : (<>
                            </>)}
                            <li className="menu-item" onClick={Logoutuser}><LogoutOutlined />  {t("Logout")}</li>
                        </ul>
                    ) : (
                        <ul className='menu'>
                            <li className='menu-item' onClick={() => navigate('/')}><UserOutlined />{t("Users")}</li>
                            <Link to='/usersetting' style={{ textDecoration: "none", color: "black" }}>
                                <li className='menu-item'><SettingOutlined style={{ color: "black" }} /> {t("Settings")}</li>
                            </Link>
                            {showLeadsMenu ? (
                                <>
                                    <Link to='/leads' style={{ textDecoration: "none" }}>
                                        <li className='menu-item' style={{ color: "black" }}><UsergroupAddOutlined /> {t("Leads")}</li>
                                    </Link>
                                </>
                            ) : (<>
                            </>)}
                            <li className="menu-item" onClick={Logoutuser}><LogoutOutlined /> {t("Logout")}</li>
                        </ul>
                    )}
                    {/* <button className="collabs-button" onClick={toggleSidebar}>
                        {isSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
