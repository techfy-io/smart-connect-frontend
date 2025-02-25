


import React, { useState, useEffect } from 'react';
import { Card, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import './Social.scss'


const Social = () => {
    const { t } = useTranslation('translation');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const accessToken = localStorage.getItem('accessToken'); 

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/usercontacts/${userId}/`
                    // , {
                    //     headers: {
                    //         'Authorization': `Bearer ${accessToken}`
                    //     }
                    // }
                    );
                    setUserData(response.data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [userId]);

    if (loading) return <Spin />;

    const renderSocialIcon = (iconData, profileUrl, iconClass) => {
        // Check if the iconData is a base64 string or URL
        const isBase64 = iconData && iconData.startsWith('data:image/');
        const formattedIconUrl = isBase64
            ? iconData
            : (iconData && !/^https?:\/\//i.test(iconData) ? `https://${iconData}` : iconData);

        return (
            <div className="icon-box " key={iconClass}>
                {profileUrl ? (
                    <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                        {iconData ? (
                            <img
                                src={formattedIconUrl}
                                alt="social icon"
                                className={`fa ${iconClass} icon`}
                                style={{ height: '30px', width: '30px' }}
                            />
                        ) : (
                            <i className={`fa ${iconClass}`} style={{ fontSize: '30px', cursor: 'pointer' }} />
                        )}
                    </a>
                ) : (
                    iconData ? (
                        <img
                            src={formattedIconUrl}
                            alt="social icon"
                            className={`fa ${iconClass} icon`}
                            style={{ height: '30px', width: '30px' }}
                        />
                    ) : (
                        <i className={`fa ${iconClass}`} style={{ fontSize: '30px' }} />
                    )
                )}
            </div>
        );
    };

    const socialIconsData = [
        { iconData: userData?.facebook_icon, profileUrl: userData?.facebook_url, iconClass: 'fa-facebook' },
        { iconData: userData?.instagram_icon, profileUrl: userData?.instagram_url, iconClass: 'fa-instagram' },
        { iconData: userData?.linkedin_icon, profileUrl: userData?.linkedin_url, iconClass: 'fa-linkedin' },
        { iconData: userData?.website_icon, profileUrl: userData?.other_link_1, iconClass: 'fa-globe' },
    ];

    return (
        <div>
            <Card className='social-links-card'>
                <div className="social-icons">
                    {socialIconsData.map((icon, index) =>
                        renderSocialIcon(icon.iconData, icon.profileUrl, icon.iconClass, index)
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Social;