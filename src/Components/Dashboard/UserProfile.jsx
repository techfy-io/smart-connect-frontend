import React from 'react';
import './UserProfile.scss';
import Smartlogo from "../../Inspect/logo.png";
import { DownloadOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import QRCode from 'react-qr-code'; // Import the QRCode component
import axios from 'axios';
import { Spin, message } from 'antd';
import { useState } from 'react';

const UserProfile = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const userData = location.state?.userinfo;
    console.log("userdataprofile    ", userData)
    const formatUserData = () => {
        return `Name: ${userData.first_name} ${userData.last_name}, Email: ${userData.email}, Phone Number: ${userData.phone_number},Company:"Devsinc"`;
    }


    const DownloadUserData = (id) => {
        setLoading(true)
        const accessToken = localStorage.getItem('accessToken');
        axios.get(`http://smart-connect.eu-west-3.elasticbeanstalk.com/api/contacts/${id}/vcf/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob' // Set the response type to blob
        })
            .then(response => {
                // Create a blob object from the response data
                const blob = new Blob([response.data], { type: 'text/vcard' });
                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(blob);
                // Create a temporary link element
                const link = document.createElement('a');
                // Set the link's href attribute to the temporary URL
                link.href = url;
                // Set the link's download attribute to specify the filename
                link.download = 'user_data.vcf';
                // Programmatically click the link to trigger the download
                link.click();
                // Release the temporary URL
                window.URL.revokeObjectURL(url);
                message.success("Download Successful");
                setLoading(false)
            })
            .catch(error => {
                console.log("error", error);
                message.error("Failed to download");
            });
    }

    return (
        <div className="user-profile">
            <img src={Smartlogo} alt="User" className="user-image" />
            <div className="user-details">
                <p className="username">{userData?.first_name + "  " + userData?.last_name}</p>
                <p className="email">{userData.email}</p>
                <p className="company">Devsinc</p>
            </div>
            <button className="download-btn" onClick={() => DownloadUserData(userData.id)}>
                {
                    loading ? <>
                        <Spin style={{ color: "#ffffff" }} className="custom-spin" />
                    </> : (
                        <>
                            <DownloadOutlined style={{ fontSize: '24px', marginRight: '8px' }} />  Download
                        </>
                    )
                }
            </button>
            <div className='QR-user-details'>
                <QRCode value={formatUserData()} />
            </div>
        </div>
    );
};

export default UserProfile;
