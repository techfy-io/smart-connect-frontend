import React, { useState, useEffect, useTransition } from 'react';
import { Layout, Input, Button, Form, message, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import axios from 'axios';
import './UserSetting.scss';
import InputMask from "react-input-mask";
import { useTranslation } from "react-i18next";

const { Header } = Layout;
const UserSetting = () => {
    const { t, i18n } = useTranslation('translation');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [accessToken, setAccesstoken] = useState()
    const [profileData, setProfileData] = useState();
    const [saveButtonColor, setSaveButtonColor] = useState("#F47122");
    const [exchangeButtonColor, setExchangeButtonColor] = useState("#616569");
    const [backgroundColor, setBackgroundColor] = useState(
        "rgba(243, 243, 243, 0.8)"
    );
    const handleSaveButtonColorChange = (e) => {
        setSaveButtonColor(e.target.value);
    };

    const handleExchangeButtonColorChange = (e) => {
        setExchangeButtonColor(e.target.value);
    };
    const handleBackgroundColorChange = (e) => {
        setBackgroundColor(e.target.value);
    };
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setAccesstoken(accessToken)
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/user/settings/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const { data } = response;
                setSaveButtonColor(data.save_button_color || "#F47122");
                setExchangeButtonColor(data.exchange_button_color || "#616569");
                setBackgroundColor(data.background_theme_color || "rgba(243, 243, 243, 0.8)");
                form.setFieldsValue({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    company: data.company,
                    phone_number: data.phone_number,
                    email: data.email,
                });

            })
            .catch(error => {
                console.log("Error:", error);
            });
    }, [form, accessToken]);

    const handleSubmit = async (values) => {
        setLoading(true);
        let isSuccess = false;
        try {
            const payload=
            {
                ...values,
                save_button_color: saveButtonColor,
                exchange_button_color: exchangeButtonColor,
                background_theme_color: backgroundColor,

            }
            console.log(payload,"payload")
            await axios.put(`${process.env.REACT_APP_BASE_API_URL}/user/settings/`, payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            isSuccess = true;
        } catch (error) {

            console.log("Error:", error);
        } finally {
            setLoading(false);
            if (isSuccess) {
                message.success(t("Settings updated successfully!"));
            } else {
                message.error(t("Failed to update user settings"));
            }
        }
    };

    const handleValuesChange = () => {
        setFormChanged(true);
    };

    return (
        <div className="container">
        <div className="form-box">
          <div className="title">Paramètres du profil</div>
          <Form
            form={form}
            layout="vertical"
            name="setting-profile-form"
            onFinish={handleSubmit}
            
            initialValues={{
                remember: true,
            }}
            onChange={handleValuesChange}
          >
            <Form.Item label="Prénom" name="first_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
  
            <Form.Item label="Nom de famille" name="last_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
  
            <Form.Item label="Entreprise" name="company" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
  
            <Form.Item label="Téléphone" name="phone_number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
  
            <Form.Item label="E-Mail" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
  
            <div className="color-picker">
              <label className='setting-form-label'>Bouton Enregistrer Thème:</label>
              <input type="color" value={saveButtonColor} onChange={e => setSaveColor(e.target.value)} />
            </div>
  
            <div className="color-picker">
              <label className='setting-form-label'>Thème du bouton d'échange:</label>
              <input type="color" value={exchangeButtonColor} onChange={e => setExchangeColor(e.target.value)} />
            </div>
  
            <div className="color-picker">
              <label className='setting-form-label'>Thème d'arrière-plan:</label>
              <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
            </div>
  
            <div className="back-link">En arrière maintenant?</div>
  
            <Button type="primary" htmlType="submit" className="save-button" >
              Sauvegarder
            </Button>
          </Form>
        </div>
      </div>
  
    );
};

export default UserSetting;
