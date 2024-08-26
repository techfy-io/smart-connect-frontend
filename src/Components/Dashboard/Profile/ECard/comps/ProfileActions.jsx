import React, { useState } from 'react'
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { message, Button, Flex } from 'antd';
const ProfileActions = ({ user, handleOpenExchangeModal }) => {
    const { t } = useTranslation('translation');
    const [loading, setLoading] = useState(false);

    const downloadUserData = async (userData) => {
        if (!userData) return;
        setLoading(true);

        try {
            const vcfResponse = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/contacts/${userData.id}/vcf/`, {
                responseType: 'text',
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

    return (
        <Flex align="center" className="profile-actions">
            <Button
                type='primary'
                size='large'
                className="left"
                icon={<i class="fa-solid fa-address-card"></i>}
                loading={loading}
                onClick={() => downloadUserData(user)}
            >
                Save Contact
            </Button>
            <Button
                type='primary'
                size='large'
                icon={<i class="fa-solid fa-arrows-rotate"></i>}
                className="right"
                onClick={handleOpenExchangeModal}
            >
                Exchange
            </Button>
        </Flex>
    )
}
export default ProfileActions
