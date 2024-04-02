import React from 'react';
import { Card, message, Spin, Modal, Form, Input, Button } from 'antd';
import './Profile.scss';
import coverpic from "../../Inspect/coverpic.png";
import SClogo from "../../Inspect/SClogo.png";
import Men from "../../Inspect/Men.png";
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { MenuOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const Profile = () => {
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
        return window.location.href
        // return userId ? `${process.env.REACT_APP_BASE_API_URL}/usercontacts/${userId}/` : '';
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
        <>
            {pageloading ? (
                <div style={{ height: "100vh", width: "100%", margin: "0 auto", textAlign: "center", background: "rgb(215, 170, 130)", background: 'linear-gradient(127deg, rgba(215, 170, 130, 1) 0%, rgba(153, 204, 204, 1) 100%)' }}>
                    <Spin size='large' style={{ marginTop: "10%" }} />
                </div>
            ) : (
                <>
                    <div className="profile-container">
                        <div className="burger-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <MenuOutlined style={{ fontSize: '24px', color: 'black' }} />
                        </div>
                        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                            <div className='QR-user-details'>
                                <QRCode value={formatUserData()} className='qr-code' />
                            </div> <br />
                            <p className='qr-code-para'>Show QRCode to share your profile</p>
                        </div>
                        <div className="cover-picture-card">
                            {userData && userData.profile_picture ? (
                                <>
                                    <img src={userData.cover_image} alt="" />

                                </>) : (
                                <>
                                    <img src={coverpic} alt="" />
                                </>
                            )}
                        </div>
                        <div className="profile-card">
                            <div className="profile-info">
                                <div className='profile-image'>
                                    {userData && userData.profile_picture ? (
                                        <>
                                            <img src={userData.profile_picture} alt="Profile" />
                                        </>) : (
                                        <>
                                            <img src={Men} alt="Profile" />
                                        </>
                                    )}
                                </div>
                                <div className="profile-details">
                                    <p className="profile-name">{`${userData?.first_name} ${userData?.last_name}`}</p>
                                    <p className="profile-designation">{userData?.job_title}</p>
                                    <p className="profile-designation">{userData?.company_name}</p>
                                </div>
                            </div>
                            <div className='profile-action'>
                                <button className='save-button' onClick={downloadUserData}>
                                    <SaveOutlined style={{ fontSize: "18px", marginRight: "4px" }} /> Save Contact
                                </button>
                                <button className='exchange-button' onClick={handleOpenExchangeModal}>
                                    <SyncOutlined style={{ fontSize: "18px", marginRight: "4px" }} /> Exchange
                                </button>
                            </div>
                        </div>
                        <Card className='social-links-card'>
                            <div className="social-icons">
                                <div className="icon-box">
                                    <a href={userData?.facebook_url} target="_blank" rel="noopener noreferrer" className="fa fa-facebook icon facebook-icon"></a>
                                </div>
                                <div className="icon-box">
                                    <a href={userData?.instagram_url} target="_blank" rel="noopener noreferrer" className="fa fa-instagram icon instagram-icon"></a>
                                </div>
                                <div className="icon-box">
                                    <a href={userData?.linkedin_url} target="_blank" rel="noopener noreferrer" className="fa fa-linkedin icon linkedin-icon"></a>
                                </div>
                            </div>
                        </Card>
                        {
                            userData && userData.bio_graphy && (
                                <>
                                    <Card className='bio-data-card'>
                                        <h2 className='bio-heading'>Biography</h2>
                                        <p className='bio-para'>{userData.bio_graphy}</p>
                                    </Card>
                                </>
                            )
                        }


                        <div className='SC-logo'>
                            <img src={SClogo} alt="" srcset="" />
                        </div>
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
                            <Form.Item style={{ textAlign: "end" }}>
                                <Button type="primary" htmlType="submit" style={{ background: "#ff8000", width: "200px" }}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </>
    );
}

export default Profile;
