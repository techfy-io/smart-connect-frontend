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

                    axios.put(`${process.env.REACT_APP_BASE_API_URL}/user/image/${user.id}/`, formData ? formData : selectedImage, {
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
                    src={selectedImage ? URL.createObjectURL(selectedImage) : user?.cover_image || coverPhoto}
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
                        image={selectedImage ? URL.createObjectURL(selectedImage) : (user?.cover_image || coverPhoto)}
                        crossOrigin='anonymous'
                        style={{ width: "100%", height: "400px", margin: "0 auto", objectFit: "cover" }}
                        border={50}
                        color={[255, 255, 255, 0.6]}
                        scale={scale}
                    />

                    <div style={{ display: 'flex' }}>
                        <Button
                            onClick={() => handleZoom(scale + 0.1)}
                            icon={<ZoomInOutlined />}
                            style={{ marginRight: '10px' }}>
                            Zoom
                        </Button>
                        <Button
                            disabled={scale <= 1}
                            onClick={() => handleZoom(scale - 0.1)}
                            icon={<ZoomOutOutlined />}
                            style={{ marginRight: '10px' }}
                        >
                            {t("Zoom")}
                        </Button>
                        <input
                            id="fileInput"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button
                            onClick={handleImageUpload}
                            style={{ marginRight: '5px' }}>
                            <span style={{ color: "green" }} className={`fa fa-image icon`} />
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Cover;