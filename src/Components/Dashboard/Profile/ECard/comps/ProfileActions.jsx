

import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { MenuOutlined, SaveOutlined, SyncOutlined, EditOutlined, ZoomInOutlined, ZoomOutOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { message, Button, Flex, Spin } from 'antd';
import './ProfileActions.scss'
const ProfileActions = ({ handleOpenExchangeModal, ...props }) => {
    const { t } = useTranslation('translation');
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [pageloading, setpageloading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [saveButtonColor, setSaveButtonColor] = useState(''); 
    const [exchangeButtonColor, setExchangeButtonColor] = useState('');

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
            console.log(response.data.save_button_value ,"value")
            setSaveButtonColor(response.data.save_button_value || '#F47122');
            setExchangeButtonColor(response.data.exchange_button_value || '#616569');
            console.log(response.data);
            setpageloading(false);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setpageloading(false);
        }
    };

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
        <div className="profile-actions ant-flex ant-flex-align-center">
        <Button
            className="left"
            type="primary"
            size="large"
            icon={loading ? <Spin indicator={<SyncOutlined spin />} /> : <SaveOutlined />}
            onClick={() => downloadUserData(userData)}
            disabled={loading}
            style={{ backgroundColor: saveButtonColor }}
            title={t('Save Contact')}
        >
            {t('Save Contact')}
        </Button>
        <Button
            className="right"
            type="primary"
            size="large"
            icon={<SyncOutlined />}
            onClick={handleOpenExchangeModal}
            style={{ backgroundColor: exchangeButtonColor }}
            title={t('Exchange')}
        >
            {t('Exchange')}
        </Button>
    </div>
    )
}
export default ProfileActions

