import React, { useState, useEffect, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { message, Modal, Button, Tooltip } from 'antd';
import { EditOutlined, MenuOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import coverPhoto from "../../../../../Inspect/coverpic.png";

const Cover = ({ user, fetchUserData, handleOpenQRCode }) => {
    const { t } = useTranslation('translation');
    const editorRef = useRef(null);
    const [editingCover, setEditingCover] = useState(false);
    const [scale, setScale] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [checkLoginUser, SetCheckLoginuser] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        const loginathentication = localStorage.getItem('accessToken')
        SetCheckLoginuser(loginathentication);
    }, []);

    const handleZoom = (value) => {
        setScale(value);
    };

    const handleCoverEdit = () => {
        setEditingCover(true);
    };

    const handleCoverSave = async () => {
        if (!editorRef.current) return;
        const canvas = editorRef?.current?.getImage();
        try {
            setUploadLoading(true);
            const imageToSend = canvas?.toDataURL();
            const res = await fetch(imageToSend);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append("cover_image", blob, "cover_image.png");

            await axios.put(`${process.env.REACT_APP_BASE_API_URL}/user/image/${user.id}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${checkLoginUser}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            fetchUserData();
        } catch (error) {
            console.error("Error saving image:", error);
        } finally {
            // Clean up
            setUploadLoading(false);
            setEditingCover(false);
            setSelectedImage(null);
        }
    };

    const handleCoverCancel = () => {
        setEditingCover(false);
        setSelectedImage(null);
    };

    const handleImageUpload = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file)
    };

    return (
        <>
            <div className="ecard-cover">
                <img
                    src={user?.cover_image || coverPhoto}
                    alt="User cover photo"
                />
                <div className="buttons">
                    <Tooltip title={t("Edit Cover Photo")}>
                        <Button
                            className="edit-btn"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={handleCoverEdit}
                        />
                    </Tooltip>
                    <Button
                        className="qr-btn"
                        shape="circle"
                        icon={<MenuOutlined />}
                        onClick={handleOpenQRCode}
                    />
                </div>
            </div>
            {/* Modal */}
            {editingCover && (
                <Modal
                    title={t("Edit Cover Photo")}
                    open={editingCover}
                    onCancel={handleCoverCancel}
                    style={{ height: "281.252px", margin: "0 auto" }}
                    width={710}
                    footer={[
                        <>
                            <Button onClick={handleCoverCancel}>
                                {t("Cancel")}
                            </Button>
                            <Button type='primary' loading={uploadLoading} onClick={handleCoverSave}>
                                {t("Save")}
                            </Button>
                        </>
                    ]}
                >
                    <div className="cover-editor-wrapper">
                        <AvatarEditor
                            id="image"
                            ref={editorRef}
                            image={selectedImage ? URL?.createObjectURL(selectedImage) : user?.cover_image}
                            style={{ margin: '0 auto', objectFit: 'cover' }}
                            border={16}
                            width={630}
                            height={191}
                            color={[0, 0, 0, 0.3]}
                            scale={scale}
                            crossOrigin="anonymous"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            id="fileInput"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button
                            onClick={handleImageUpload}
                        >
                            <span style={{ color: "green" }} className={`fa fa-image icon`} />
                            {t("Upload New")}
                        </Button>
                        <Button
                            disabled={scale <= 1}
                            onClick={() => handleZoom(scale - 0.1)}
                            icon={<ZoomOutOutlined />}
                        >
                            {t("Zoom Out")}
                        </Button>
                        <Button
                            onClick={() => handleZoom(scale + 0.1)}
                            icon={<ZoomInOutlined />}
                        >
                            {t("Zoom In")}
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Cover;