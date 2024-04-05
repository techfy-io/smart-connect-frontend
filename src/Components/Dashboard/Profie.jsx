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
import InputMask from "react-input-mask";

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
        axios.post('http://smart-connect.eu-west-3.elasticbeanstalk.com/api/exchange/', values)
            .then(response => {
                console.log("Response:", response);
                message.success("Data exchanged successfully");
                setExchangeModal(false);
            })
            .catch(error => {
                console.error("Error exchanging data:", error);
                message.error("Failed to exchange data");
            });
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
                                <div className="icon-box">
                                    <a href={userData?.other_link_1} target="_blank" rel="noopener noreferrer" className="fa fa-globe icon linkedin-icon"></a>
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
                        title="Exchange" 
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
                                name="first_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your first name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <label htmlFor="lastname">Last Name*</label>
                            <Form.Item
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your last name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <label htmlFor="companyname">Company Name*</label>
                            <Form.Item
                                name="company_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your company name!',
                                    },
                                ]}
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
                                        message: 'Please enter your email!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <label htmlFor="phone">Phone*</label>
                            <Form.Item
                                name="phone_number"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a phone number',
                                    },
                                    {
                                        pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                        message: 'Invalid phone number format',
                                    },
                                ]}
                            >
                                <InputMask
                                    style={{
                                        width: "100%",
                                        height: "30px",
                                        borderRadius: "5px",
                                        border: "1px solid #d9d9d9",
                                        paddingLeft: "8px",
                                        color: "black",
                                        transition: "border-color 0.3s",
                                    }}
                                    mask="+33 9 99 99 99 99"
                                    maskChar=""
                                    placeholder="+33 9 99 99 99 99"
                                >
                                </InputMask>
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
