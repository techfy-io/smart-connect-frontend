import React, { useState, useEffect } from 'react';
import './UserProfile.scss';
import { DownloadOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { Spin, message } from 'antd';

const UserProfile = () => {
    const [loading, setLoading] = useState(false);
    const [pageloading, setpageloading] = useState(false);
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const [userid, setUserId] = useState('');
    useEffect(() => {
        setpageloading(true)
        const fetchUserData = async () => {
            const userId = location.state?.userid;
            setUserId(userId)
            if (userId) {
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await axios.get(`http://smart-connect.eu-west-3.elasticbeanstalk.com/api/usercontacts/${userId}/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUserData(response.data);
                    setpageloading(false)
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    message.error("Failed to fetch user data:", error);
                    setpageloading(false)
                }
            }
        };

        fetchUserData();
    }, [location]);

    const formatUserData = () => {
        if (userid) {
            // return `Name: ${userData.first_name} ${userData.last_name}, Email: ${userData.email}, Phone Number: ${userData.phone_number}, Company: ${userData.company}`;
            return `http://smart-connect.eu-west-3.elasticbeanstalk.com/api/usercontacts/${userid}/`
        }
        return '';
    };

    const downloadUserData = () => {
        if (!userData) {
            return;
        }

        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        axios.get(`http://smart-connect.eu-west-3.elasticbeanstalk.com/api/contacts/${userData.id}/vcf/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob'
        })
            .then(response => {
                const blob = new Blob([response.data], { type: 'text/vcard' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'user_data.vcf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                message.success("Download Successful");
            })
            .catch(error => {
                console.error("Failed to download user data:", error);
                message.error("Failed to download");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="user-profile">
            {
                pageloading ? (
                    <>
                        <div style={{ margin: "0 auto", marginTop: "10%" }}>
                            <Spin size='large' />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='gradient-box'>
                        </div>
                        <div className="user-details">
                            <p className="username">{`${userData?.first_name} ${userData?.last_name}`}</p>
                            <p className="email">{userData?.email}</p>
                            <p className="company">{userData?.company}</p>
                        </div>
                        <button className="download-btn" onClick={downloadUserData}>
                            {loading ? (
                                <>
                                    <Spin style={{ color: "#ffffff" }} className="custom-spin" />
                                </>
                            )
                                : (
                                    <>
                                        <DownloadOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                                        Download
                                    </>
                                )}
                        </button>
                        <div className='QR-user-details'>
                            <QRCode value={formatUserData()} className='qr-code' />
                        </div>
                    </>
                )
            }

        </div>
    );
};

export default UserProfile;
