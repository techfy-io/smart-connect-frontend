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
import { MenuOutlined, SaveOutlined, SyncOutlined, EditOutlined, FileImageOutlined, DownOutlined, ZoomInOutlined, ZoomOutOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';
import ExchangeModal from './ExchangeModal';

const Profile = () => {
    const { t, i18n } = useTranslation('translation');
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [pageloading, setpageloading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openExchangeModal, setOpenExchangeModal] = useState(false);
    const { userId } = useParams();
    const qrCodeRef = useRef(null);
    const [editingCover, setEditingCover] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [angle, setAngle] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [checkLoginUser, SetCheckLoginuser] = useState('')
    useEffect(() => {
        const loginathentication = localStorage.getItem('accessToken')
        SetCheckLoginuser(loginathentication)
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
            setpageloading(false);
        }
    };

    const formatUserData = () => {
        return window.location.href;
    };


    //  download vcf file with image 

    // const downloadUserData = async (userData) => {
    //     if (!userData) return;

    //     setLoading(true);

    //     try {
    //         const vcfResponse = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/contacts/${userData.id}/vcf/`, {
    //             responseType: 'text'
    //         });

    //         let vCardData = vcfResponse.data;
    //         const photoUrlMatch = vCardData.match(/PHOTO;VALUE=uri:(.+)/);

    //         if (!photoUrlMatch) {
    //             console.warn("Photo URL not found in vCard");
    //             downloadVCard(vCardData, userData);
    //             return;
    //         }

    //         const photoUrl = photoUrlMatch[1].trim();
    //         const imageResponse = await axios.get(photoUrl, {
    //             responseType: 'blob',
    //             headers: {
    //                 'Content-Type': 'image/jpeg',
    //                 'Authorization': `Bearer ${checkLoginUser}`
    //             }
    //         });

    //         const reader = new FileReader();
    //         reader.readAsDataURL(imageResponse.data);
    //         reader.onloadend = () => {
    //             const base64Image = reader.result.split(',')[1];
    //             const mimeType = imageResponse.data.type;
    //             vCardData = vCardData.replace(photoUrlMatch[0], `PHOTO;ENCODING=b;TYPE=${mimeType.toUpperCase()}:${base64Image}`);
    //             downloadVCard(vCardData, userData);
    //         };

    //         reader.onerror = () => {
    //             console.error("Failed to convert image to base64");
    //             message.error("Failed to convert image");
    //             setLoading(false);
    //         };
    //     } catch (error) {
    //         if (error.response && error.response.status === 404) {
    //             console.error("Photo URL not found:", error);
    //             message.error("Photo URL not found");
    //         } else {
    //             console.error("Failed to download user data:", error);
    //             message.error("Failed to download");
    //         }
    //         setLoading(false);
    //     }
    // };

    // const downloadVCard = (vCardData, userData) => {
    //     const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `${userData.first_name}_${userData.last_name}.vcf`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     window.URL.revokeObjectURL(url);
    //     message.success("Download Successful");
    //     setLoading(false);
    // };

    const downloadUserData = async (userData) => {
        if (!userData) return;
        setLoading(true);

        try {
            const vcfResponse = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/contacts/${userData.id}/vcf/`, {
                responseType: 'text',
                headers: {
                    'Authorization': `Bearer ${checkLoginUser}`,
                    'Accept': 'application/json'

                }
            });

            let vCardData = vcfResponse.data;
            const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${userData.first_name}_${userData.last_name}.vcf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success("Download Successful");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error("Photo URL not found:", error);
                message.error("Photo URL not found");
            } else {
                console.error("Failed to download user data:", error);
                message.error("Failed to download");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleOpenExchangeModal = () => {
        setOpenExchangeModal(true);
    };

    const handleCloseExchangeModal = () => {
        setOpenExchangeModal(false);
    };

    const handleSubmitExchangeModal = async (values) => {
        const formData = new FormData();
        setLoading(true);

        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('company_name', values.company_name || "");
        formData.append('email', values.email);
        formData.append('phone_number', values.phone_number);
        formData.append('owner', userData?.id);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/exchange/`, formData);
            console.log("Response:", response);
            message.success(t("Data exchanged successfully"));
            setOpenExchangeModal(false);
            form.resetFields();
        } catch (error) {
            console.log("error", error);
            if (error.response) {
                if (error.response.status === 404 || error.response.status === 500) {
                    message.error(t("Failed: Something went wrong with the server."));
                } else {
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
                console.error("No response received from the server:", error.request);
                message.error(t("Failed: No response received from the server."));
            } else {
                console.error("Error setting up the request:", error.message);
                message.error(t("Failed: Error setting up the request."));
            }
        } finally {
            setLoading(false);
        }
    };
    const handleZoom = (value) => {
        setScale(value);
    };

    // const handleRotate = () => {
    //     setAngle(angle + 90);
    //     document.getElementById("image").style.transform = `rotate(${angle + 90}deg)`;
    // };

    // const handleSave = () => {
    //     if (editorRef.current) {
    //         const canvas = editorRef.current.getImage();
    //         setEditor(canvas)
    //         console.log(canvas, "canvas")
    //     }
    // };
    const handleCoverEdit = () => {
        setEditingCover(true);
    };


    //     const canvas = editorRef.current?.getImage();
    //     const editedCoverImage = canvas?.toDataURL();
    //     if (selectedImage) {
    //         setCoverImage(editedCoverImage);
    //         setSelectedImage(null);
    //     } else {
    //         setCoverImage(editedCoverImage);
    //     }
    //     setEditingCover(false);
    // };


    const handleCoverSave = () => {
        const canvas = editorRef.current?.getImage();
        const editedCoverImage = canvas?.toDataURL();

        const imageToSend = editedCoverImage;
        if (imageToSend) {
            fetch(imageToSend)
                .then(res => res.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append("cover_image", blob, "cover_image.png");

                    axios.put(`${process.env.REACT_APP_BASE_API_URL}/user/image/${userData.id}/`, formData ? formData : selectedImage, {
                        headers: {
                            'Authorization': `Bearer ${checkLoginUser}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            // window.location.reload();
                            fetchUserData();
                            message.success(t("Image Update successfully"));

                        })
                        .catch(error => {
                            message.error(t("Error saving image"));
                        });
                });
        }

        setEditingCover(false);
        setSelectedImage(null);
    };


    const handleCoverCancel = () => {
        setEditingCover(false);
    };

    const handleSocialIconClick = (url) => {
        if (!url) {
            message.error(t("No media available, please add one."));
        } else {
            window.open(url, "_blank");
        }
    };
    const handleImageUpload = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file)
        console.log(file)
    };


    const renderSocialIcon = (url, iconClass) => {
        // Inline check and formatting of the URL
        const formattedUrl = url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;

        if (!formattedUrl) {
            return (
                <div className="icon-box disabled" title={t("No media available please add one")}>
                    <span className={`fa ${iconClass} icon`} />
                </div>
            );
        } else {
            return (
                <div className="icon-box">
                    <a href={formattedUrl} target="_blank" rel="noopener noreferrer" className={`fa ${iconClass} icon`} />
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
                                    {
                                        checkLoginUser == null ? (
                                            <div className='profile-login-btn'>
                                                <Tooltip title={t("Are you the owner of the file? Click here to login?")}>
                                                    <Button className='profile-action-login-btn' type='primary' ><Link to={'/'}>{t("Login")}</Link></Button>
                                                </Tooltip>
                                            </div>
                                        ) : (<>
                                        </>)
                                    }

                                    <div className='QR-user-details' ref={qrCodeRef}>
                                        <QRCode value={formatUserData()} className='qr-code' />
                                    </div>
                                    <br />
                                    <p className='qr-code-para'>{t("Show QRCode to share your profile")}</p>
                                </div>
                                <div className="cover-picture-card"  >
                                    {checkLoginUser != null ? (
                                        <Button className="cover-image-edit-button" type="primary" onClick={handleCoverEdit}>
                                            <EditOutlined />
                                        </Button>
                                    ) : null}
                                    <img src={selectedImage ? URL.createObjectURL(selectedImage) : coverImage || userData?.cover_image || coverpic} alt="" />
                                </div>
                                <div className="profile-card">
                                    <div className="profile-info">
                                        <div className='profile-image'>
                                            <img src={userData?.profile_picture || Men1} alt="" />
                                        </div>
                                        <div className="profile-details">
                                            <p className="profile-name">
                                                {userData?.first_name?.length + userData?.last_name?.length <= 50
                                                    ? `${userData?.first_name} ${userData?.last_name}`
                                                    : `${userData?.first_name} ${userData?.last_name?.slice(0, Math.max(0, 50 - userData?.first_name?.length))}...`
                                                }
                                            </p>
                                            <p className="profile-designation">{userData?.job_title?.length > 50 ? `${userData?.job_title?.slice(0, 50)}...` : userData?.job_title}</p>
                                            <p className="profile-designation">{userData?.company_name?.length > 50 ? `${userData?.company_name?.slice(0, 50)}...` : userData?.company_name}</p>
                                        </div>
                                    </div>
                                    <div className='profile-action'>
                                        <button className='save-button' onClick={() => downloadUserData(userData)} disabled={loading}>
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
                                    <Empty size="Large" description={t("The User is no longer available")} />
                                </div>
                            </div>
                        )
                    }

                </>
            )}
            {editingCover && (
                <Modal
                    title={t("Edit Cover Photo")}
                    open={editingCover}
                    // onOk={handleCoverSave}
                    onCancel={handleCoverCancel}
                    style={{ height: "281.252px", margin: "0 auto" }}
                    width={710}
                    footer={[
                        <>
                            <Button type='primary' onClick={handleCoverCancel}>
                                {t("Cancel")}
                            </Button>
                            <Button type='primary' onClick={handleCoverSave}>
                                {t("Save")}
                            </Button>
                        </>
                    ]}
                >
                    <AvatarEditor
                        id="image"
                        ref={editorRef}
                        image={selectedImage ? URL.createObjectURL(selectedImage) : (coverImage || userData?.cover_image || coverpic)}
                        crossOrigin='anonymous'
                        style={{ width: "100%", height: "400px", margin: "0 auto", objectFit: "cover" }}
                        border={50}
                        color={[255, 255, 255, 0.6]}
                        scale={scale}
                    />

                    <div style={{ display: 'flex' }}>
                        <Button onClick={() => handleZoom(scale + 0.1)} icon={<ZoomInOutlined />} style={{ marginRight: '10px' }}>Zoom</Button>
                        <Button
                            disabled={scale <= 1}
                            onClick={() => handleZoom(scale - 0.1)}
                            icon={<ZoomOutOutlined />}
                            style={{ marginRight: '10px' }}
                        >
                            {t("Zoom")}
                        </Button>
                        <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                        <Button onClick={handleImageUpload} style={{ marginRight: '5px' }}><span style={{ color: "green" }} className={`fa fa-image icon`} /></Button>
                        {/* <Button onClick={handleSave}>{t("Save")} </Button> */}
                    </div>

                </Modal>
            )}
            <ExchangeModal
                open={openExchangeModal}
                onClose={handleCloseExchangeModal}
                onSubmit={handleSubmitExchangeModal}
                loading={loading}
            />
        </>
    );
}

export default Profile;
