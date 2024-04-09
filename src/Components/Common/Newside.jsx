import React, { useState } from 'react';
import { MenuOutlined, SearchOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import './Newside.css';

const Newside = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div>
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="logo-details">
                    <i className="bx bxl-codepen icon" />
                    <div className="logo_name">SideMenu</div>
                    <MenuOutlined id="btn" onClick={toggleSidebar} className="icon" />
                </div>
                <ul className="nav-list">
                    <li>
                        <SearchOutlined className="bx-search" />
                        <input type="text" placeholder="Search..." />
                        <span className="tooltip">Search</span>
                    </li>
                    <li>
                        <a href="#">
                            <AppstoreOutlined />
                            <span className="links_name">Dashboard</span>
                        </a>
                        <span className="tooltip">Dashboard</span>
                    </li>
                    {/* Add more list items here */}
                </ul>
                <li className="profile">
                    <div className="profile-details">
                        <UserOutlined />
                        <div className="name_job">
                            <div className="name">Logout</div>
                        </div>
                    </div>
                    <MenuOutlined id="log_out" className="bx-log-out" />
                </li>
            </div>
            <section className="home-section">
                <div className="text">Dashboard</div>
            </section>
        </div>
    );
};

export default Newside;
