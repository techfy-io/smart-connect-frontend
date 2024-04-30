import React, { useState, useEffect, useRef } from 'react';
import { Card, message, Spin, Modal, Form, Input, Button, Empty, Avatar, Tooltip, Menu, Dropdown } from 'antd';
import './Profile.scss';
import coverpic from "../../Inspect/coverpic.png";
import SClogo from "../../Inspect/SClogo.png";
import Men from "../../Inspect/Men.png";
import Men1 from "../../Inspect/Men1.png";
import SCBLACKV3 from "../../Inspect/SCBLACKV3.png";
import EmptyImage from "../../Inspect/EmptyImage.jpg";
import Emptyicon from "../../Inspect/Emptyicon.png";
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { MenuOutlined, SaveOutlined, SyncOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import InputMask from "react-input-mask";
import html2canvas from 'html2canvas';
import { useTranslation } from "react-i18next";


const Profile = () => {
    const { t, i18n } = useTranslation('translation');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageloading, setpageloading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openExchangeModal, setExchangeModal] = useState(false);
    const { userId } = useParams();
    const qrCodeRef = useRef(null); // Ref for QR code element


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
            // message.error("Failed to fetch user data:", error);
            setpageloading(false);
        }
    };

    const formatUserData = () => {
        return window.location.href
    };

    const downloadUserData = () => {
        if (!userData) return;

        setLoading(true);
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/contacts/${userData.id}/vcf/`, {
            responseType: 'blob'
        })
            .then(response => {
                const reader = new FileReader();
                reader.onload = () => {
                    let vcfData = reader.result;

                    // Extract profile picture URL from the VCF data
                    const profilePicUrl = `${userData.profile_picture}`;

                    // Convert the profile picture to Base64 data
                    fetch(profilePicUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const profilePicBase64 = reader.result.split(',')[1]; // Extract Base64 data
                                // Replace PHOTO property with Base64 encoded image data
                                vcfData = vcfData.replace(/PHOTO;VALUE=uri:.*/, `PHOTO;ENCODING=b;TYPE=JPEG:${profilePicBase64}`);
                                const blob = new Blob([vcfData], { type: 'text/vcard' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `${userData?.first_name}_${userData?.last_name}.vcf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                message.success("Download Successful");
                            };
                            reader.readAsDataURL(blob); // Read the blob as data URL
                        });
                };
                reader.readAsText(response.data);
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

    const handleCancel = () => {
        handleOpenExchangeModal();
        form.resetFields();
    }
    const onFinish = async (values) => {
        const formData = new FormData();
        setLoading(true); // Set loading state to true while submitting

        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('company_name', values.company_name || "");
        formData.append('email', values.email);
        formData.append('phone_number', values.phone_number);
        formData.append('owner', userData?.id);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/exchange/`, formData);
            console.log("Response:", response);
            message.success("Data exchanged successfully");
            setExchangeModal(false);
            form.resetFields();
        } catch (error) {
            console.log("error", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 404 || error.response.status === 500) {
                    // Handle 404 or 500 error
                    message.error("Failed: Something went wrong with the server.");
                } else {
                    // Handle other errors with response data
                    const responseData = error.response.data;
                    let errorMessage = '';

                    for (const prop in responseData) {
                        if (responseData.hasOwnProperty(prop)) {
                            errorMessage = responseData[prop][0];
                            break;
                        }
                    }

                    message.error(errorMessage);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received from the server:", error.request);
                message.error("Failed: No response received from the server.");
            } else {
                // Something happened in setting up the request that triggered an error
                console.error("Error setting up the request:", error.message);
                message.error("Failed: Error setting up the request.");
            }
        } finally {
            setLoading(false); // Reset loading state after submission
        }
    };


    const downloadQRCode = () => {
        html2canvas(qrCodeRef.current).then(canvas => {
            const link = document.createElement('a');
            link.download = `${userData?.first_name}_${userData?.last_name}.png`;
            link.href = canvas.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
    const handleSocialIconClick = (url) => {
        if (!url) {
            message.error(t("No media available, please add one."));
        } else {
            window.open(url, "_blank");
        }
    };

    const renderSocialIcon = (url, iconClass, tooltipTitle) => {
        if (!url) {
            return (
                <Tooltip title={t("No media available, please add one.")}>
                    <div className="icon-box disabled">
                        <span className={`fa ${iconClass} icon`} />
                    </div>
                </Tooltip>
            );
        } else {
            return (
                <div className="icon-box" onClick={() => handleSocialIconClick(url)}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className={`fa ${iconClass} icon`}></a>
                </div>
            );
        }
    };
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const menu = (
        <Menu>
            <Menu.Item key="fr" onClick={() => changeLanguage('fr')}>
                French
            </Menu.Item>
            <Menu.Item key="en" onClick={() => changeLanguage('en')}>
                English
            </Menu.Item>
        </Menu>
    );
    return (
        <>
            {pageloading ? (
                <div style={{ height: "100vh", width: "100%", margin: "0 auto", textAlign: "center", background: "rgb(215, 170, 130)", background: 'linear-gradient(127deg, rgba(215, 170, 130, 1) 0%, rgba(153, 204, 204, 1) 100%)' }}>
                    <Spin size='large' style={{ marginTop: "10%" }} />
                </div>
            ) : (
                <>
                    {
                        userData ? (
                            <div className="profile-container">
                                <div style={{ position: 'absolute', top: '16px', right: '70px' }}>
                                    <Dropdown overlay={menu} trigger={['click']} >
                                        <Button type="primary" style={{ width: "100px" }}>
                                            {i18n.language === 'fr' ? 'French' : 'English'} <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </div>
                                <div className="burger-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                    <MenuOutlined style={{ fontSize: '24px', color: 'black' }} />
                                </div>
                                <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                                    <div className="burger-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                        <MenuOutlined style={{ fontSize: '24px', color: 'black' }} />
                                    </div>
                                    <div className='QR-user-details' ref={qrCodeRef}>
                                        <QRCode value={formatUserData()} className='qr-code' />
                                    </div>
                                    <br />
                                    {/* code para */}
                                    <p className='qr-code-para'>{t("Show QRCode to share your profile")}</p>
                                    <div className='download-qr-code-btn'>
                                        <Button icon={<DownloadOutlined />} onClick={downloadQRCode}>
                                            {t("Download QR Code")}
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    
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
                                                    <img src={Men1} alt="Profile" />
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
                                        <button className='save-button' onClick={downloadUserData} disabled={loading}>
                                            {loading ? (
                                                <Spin indicator={<SyncOutlined style={{ fontSize: "18px", marginRight: "4px" }} spin />} />
                                            ) : (
                                                <>
                                                    <SaveOutlined style={{ fontSize: "18px", marginRight: "4px" }} /> {t("Save Contact")}
                                                </>
                                            )}
                                        </button>

                                        <button className='exchange-button' onClick={handleOpenExchangeModal}>
                                            <SyncOutlined style={{ fontSize: "18px", marginRight: "4px" }} /> {t("Exchange")}
                                        </button>
                                    </div>
                                </div>
                                {/* <Card className='social-links-card'>
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
                                </Card> */}
                                <Card className='social-links-card'>
                                    <div className="social-icons">
                                        {renderSocialIcon(userData?.facebook_url, 'fa-facebook', 'Facebook')}
                                        {renderSocialIcon(userData?.instagram_url, 'fa-instagram', 'Instagram')}
                                        {renderSocialIcon(userData?.linkedin_url, 'fa-linkedin', 'LinkedIn')}
                                        {renderSocialIcon(userData?.other_link_1, 'fa-globe', 'Other Link')}
                                    </div>
                                </Card>
                                {
                                    userData && userData.bio_graphy && (
                                        <>
                                            <div className='bio-data-card'>
                                                <h2 className='bio-heading'>{t("Biography")}</h2>
                                                <p className='bio-para'>{userData.bio_graphy}</p>
                                            </div>
                                        </>
                                    )
                                }
                                <div className='SC-logo'>
                                    <img src={SCBLACKV3} alt="" srcSet="" />
                                </div>
                            </div>
                        ) : (
                            <div className='profile-container' style={{ height: "100vh" }}>
                                <div>
                                    {/* <img src={Emptyicon} alt="" />
                                    <h5 sty>The User is no longer availible</h5> */}
                                    <Empty Size="Large" description={t("The User is no longer available")} />
                                </div>
                            </div>
                        )
                    }
                    <Modal
                        title={t("Exchange")}
                        open={openExchangeModal}
                        onCancel={handleCancel}
                        footer={[
                            <Button onClick={handleCancel}>
                                {t("Cancel")}
                            </Button>,
                            <Button
                                onClick={() => form.submit()} // Trigger form submission
                                type="primary"
                                htmlType="submit"
                                style={{ background: "#ff8000" }}
                                loading={loading}
                            >
                                {t("Submit")}
                            </Button>
                        ]}
                    >
                        <Form
                            name="exchange Form"
                            form={form}
                            onFinish={onFinish}
                        >
                            <label htmlFor="firstname">{t("First Name")}*</label>
                            <Form.Item
                                name="first_name"
                                rules={[
                                    {
                                        required: true,
                                        message: (t('Please input your first name!')),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <label htmlFor="lastname">{t("Last Name")}*</label>
                            <Form.Item
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message: (t('Please input your last name!')),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <label htmlFor="companyname">{t("Company Name")}</label>
                            <Form.Item
                                name="company_name">
                                <Input />
                            </Form.Item>
                            <label htmlFor="email">{t("Email")}*</label>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: (t('Please input a valid email!')),
                                    },
                                    {
                                        required: true,
                                        message: (t('Please enter an email')),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <label htmlFor="phone">{t("Phone")}*</label>
                            <Form.Item
                                name="phone_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (t('Please enter a phone number')),
                                    },
                                    {
                                        pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                        message: (t('Invalid phone number format')),
                                    },
                                ]}
                            >
                                <InputMask
                                    style={{
                                        width: "98.1%",
                                        height: "30px",
                                        borderRadius: "5px",
                                        border: "1px solid #d9d9d9",
                                        paddingLeft: "8px",
                                        color: "black",
                                        transition: "border-color 0.3s",
                                    }}
                                    mask="+33 9 99 99 99 99"
                                    maskChar=""
                                    placeholder="+33 1 23 45 67 89"
                                >
                                </InputMask>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </>
    );
}

export default Profile;
