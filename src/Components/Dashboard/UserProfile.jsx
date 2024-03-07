import React from 'react';
import './UserProfile.scss';
import Smartlogo from "../../Inspect/logo.png";
import { DownloadOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import QRCode from 'react-qr-code'; // Import the QRCode component

const UserProfile = () => {
    // useEffect(()=>{

    const location = useLocation();
    const userData = location.state?.userinfo;
    console.log("userdataprofile    ", userData)
    const formatUserData = () => {
        return `Name: ${userData.first_name} ${userData.last_name}, Email: ${userData.email}, Phone Number: ${userData.phone_number},Company:"Techfy"`;
    }
    return (
        <div className="user-profile">
            <img src={Smartlogo} alt="User" className="user-image" />
            <div className="user-details">
                <p className="username">{userData?.first_name + "  " + userData?.last_name}</p>
                <p className="email">{userData.email}</p>
                <p className="company">Techfy</p>
            </div>
            <button className="download-btn"><DownloadOutlined /> Download</button>
            <div className='QR-user-details'>
            <QRCode value={formatUserData()} />
            </div>
        </div>
    );
};

export default UserProfile;
