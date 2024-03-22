import React, { useState, useEffect } from 'react';
import './UserProfile.scss';
import { DownloadOutlined, MenuOutlined, UserOutlined, RetweetOutlined } from '@ant-design/icons';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { Modal, Spin, message, Form, Input, Button } from 'antd';
import { useParams } from 'react-router-dom';
import Smartlogo from "../../Inspect/Smart-logo.png";

const UserProfile = () => {
    const [loading, setLoading] = useState(false);
    const [pageloading, setpageloading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openExchangeModal, setExchangeModal] = useState(false);
    const { userId } = useParams();

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            setpageloading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/usercontacts/${userId}/`);
            setUserData(response.data);
            setpageloading(false);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            message.error("Failed to fetch user data:", error);
            setpageloading(false);
        }
    };

    const formatUserData = () => {
        return userId ? `${process.env.REACT_APP_BASE_API_URL}/userprofile/${userId}/` : '';
    };

    const downloadUserData = () => {
        if (!userData) return;

        setLoading(true);
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/contacts/${userData.id}/vcf/`, {
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

    const handleOpenExchangeModal = () => {
        setExchangeModal(prev => !prev);
    };

    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <div className="user-profile">
            <div className="burger-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuOutlined style={{ fontSize: '24px', color: 'black' }} />
            </div>
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className='QR-user-details'>
                    <QRCode value={formatUserData()} className='qr-code' />
                </div> <br />
                <p className='qr-code-para'>Show QRCode to share your profile</p>
            </div>
            <div className='user-profile-content'>
                {
                    pageloading ? (
                        <div style={{ margin: "0 auto", marginTop: "10%" }}>
                            <Spin size='large' />
                        </div>
                    ) : (
                        <>
                            {userData && userData.cover_image ? (
                                <div className='user-detail-cover-image'>
                                    <img src={userData.cover_image} alt="cover pic" />
                                </div>
                            ) : (
                                <div className='gradient-box'></div>
                            )}

                            <div className="user-details">
                                <div className='user-details-image'>
                                    {userData && userData.profile_picture ? (
                                        <div className='user-profile-image'>
                                            <img src={userData.profile_picture} alt="Profile pic" />
                                        </div>
                                    ) : (
                                        <div className='user-profile-box'>
                                            <UserOutlined style={{ margin: "0 auto" }} className='user-image-box' />
                                        </div>
                                    )}
                                </div>
                                {userData && (
                                    <>
                                        <p className="username">{`${userData?.first_name} ${userData?.last_name}`}</p>
                                        <p className="email">{userData ? userData.bio_graphy : ""}</p>
                                        <p className="email">{userData ? userData.job_title : ""}</p>
                                        <p className="company">{userData ? userData.company : ""}</p>
                                    </>
                                )}
                            </div>
                            <div className='profile-actions-buttuns'>
                                <button className="download-btn" onClick={downloadUserData}>
                                    {loading ? (
                                        <Spin style={{ color: "#ffffff" }} className="custom-spin" />
                                    ) : (
                                        <>
                                            <DownloadOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                                            Contact info
                                        </>
                                    )}
                                </button>
                                <button className='Exchange-btn' onClick={handleOpenExchangeModal}>
                                    <RetweetOutlined style={{ fontSize: "24px", marginRight: '8px' }} /> Exchange
                                </button>
                            </div>

                            <div className="social-icons">
                                <p className='social-icons-para'>Connect on social</p>
                                <a href={userData?.facebook_url} target="_blank" rel="noopener noreferrer" className="fa fa-facebook icon facebook-icon"></a>
                                <a href={userData?.instagram_url} target="_blank" rel="noopener noreferrer" className="fa fa-instagram  icon instagram-icon"></a>
                                <a href={userData?.linkedin_url} target="_blank" rel="noopener noreferrer" className="fa fa-linkedin icon linkedin-icon"></a>
                            </div>
                            <div className='smart-connect-profile-logo'>
                                <img src={Smartlogo} alt="" />
                            </div>
                        </>
                    )
                }
            </div>
            <Modal
                title="Exchange with TestUser"
                open={openExchangeModal}
                onCancel={handleOpenExchangeModal}
                footer={null} // No footer for now, you can add actions if needed
            >
                <Form
                    name="exchangeForm"
                    onFinish={onFinish}
                >
                    <label htmlFor="firstname">First Name*</label>
                    <Form.Item
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your first name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <label htmlFor="lastname">Last Name*</label>
                    <Form.Item
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your last name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <label htmlFor="companyname">Company Name*</label>
                    <Form.Item
                        name="companyName"
                    >
                        <Input />
                    </Form.Item>
                    <label htmlFor="email">Email*</label>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not a valid email!',
                            },
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <label htmlFor="phone">Phone</label>
                    <Form.Item
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" style={{ background: "#ff8000", width: "200px" }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile;
