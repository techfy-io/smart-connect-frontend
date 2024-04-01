import React from 'react';
import { Card } from 'antd';
import './Profile.scss';
import SmartLogo from "../../Inspect/Smart-logo.png";
import coverpic from "../../Inspect/coverpic.png";
import SClogo from "../../Inspect/SClogo.png";
import Men from "../../Inspect/Men.png";
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { DownloadOutlined, MenuOutlined, UserOutlined, RetweetOutlined } from '@ant-design/icons';

const Profile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="profile-container">
              <div className="burger-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuOutlined style={{ fontSize: '24px', color: 'black' }} />
            </div>
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className='QR-user-details'>
                    <QRCode value={"23234324"} className='qr-code' />
                </div> <br />
                <p className='qr-code-para'>Show QRCode to share your profile</p>
            </div>             
                <div className="cover-picture-card">
                <img src={coverpic} alt="" />
            </div>
            <div className="profile-card">
                <div className="profile-info">
                    <div className='profile-image'>
                        <img src={Men} alt="Profile" />
                    </div>
                    <div className="profile-details">
                        <p className="profile-name">John Doe</p>
                        <p className="profile-designation">Software Engineer</p>
                        <p className="profile-designation">System Technician ORP</p>
                    </div>
                </div>
                <div className='profile-action'>
                    <button className='save-button'>
                        Save Contact
                    </button>
                    <button className='exchange-button'>
                        Exchange
                    </button>
                </div>
            </div>
            {/* </div> */}
            <Card className='social-links-card'>
                <div className="social-icons">
                    <div className="icon-box">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="fa fa-facebook icon facebook-icon"></a>
                    </div>
                    <div className="icon-box">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="fa fa-instagram icon instagram-icon"></a>
                    </div>
                    <div className="icon-box">
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="fa fa-linkedin icon linkedin-icon"></a>
                    </div>
                </div>
            </Card>
            <Card className='bio-data-card'>
                <h2 className='bio-heading'>Biography</h2>
                <p className='bio-para'>Smart Connect is a leading software house, offering expertise in software development. Empowering businesses with innovative digital solutions.</p>
            </Card>
            <div className='SC-logo'>
                <img src={SClogo} alt="" srcset="" />
            </div>
        </div>
    );
};

export default Profile;
