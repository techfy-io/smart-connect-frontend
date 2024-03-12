import React, { useState, useEffect } from 'react';
import './UserProfile.scss';
import { DownloadOutlined } from '@ant-design/icons';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import Smartlogo from "../../Inspect/Smart-logo.png";

const UserProfile = () => {
    const [loading, setLoading] = useState(false);
    const [pageloading, setpageloading] = useState(false);
    const [userData, setUserData] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const { userId } = useParams(); // Extract userId from the URL

    useEffect(() => {
        console.log(userId)
        if (userId) {
            setpageloading(true);
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`https://api.smartconnect.cards/api/usercontacts/${userId}/`);
                    setUserData(response.data);
                    setpageloading(false);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    message.error("Failed to fetch user data:", error);
                    setpageloading(false);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    const formatUserData = () => {
        if (userId) {
            // Format user data here
            return `https://app.smartconnect.cards/userprofile/${userId}/`;
        }
        return '';
    };

    const downloadUserData = () => {
        if (!userData) {
            return;
        }

        setLoading(true);
        axios.get(`https://api.smartconnect.cards/api/contacts/${userData.id}/vcf/`, {
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
                            <a className="email" href={`mailto:${userData?.email}`}>{userData?.email}</a>
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
                                        Contact info
                                    </>
                                )}
                        </button>
                        <div className='QR-user-details'>
                            <QRCode value={formatUserData()} className='qr-code' />
                        </div>
                        <div className='smart-connect-profile-logo'>
                            <img src={Smartlogo} alt="" />
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default UserProfile;
