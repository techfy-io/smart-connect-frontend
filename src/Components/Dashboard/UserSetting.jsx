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
            await axios.put(`${process.env.REACT_APP_BASE_API_URL}/user/settings/`, values, {
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
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);
            } else {
                message.error(t("Failed to update user settings"));
            }
        }
    };

    const handleValuesChange = () => {
        setFormChanged(true);
    };

    // const menu = (
    //     <Menu>
    //       <Menu.Item key="fr" onClick={() => changeLanguage('fr')}>
    //         French
    //       </Menu.Item>
    //       <Menu.Item key="en" onClick={() => changeLanguage('en')}>
    //         English
    //       </Menu.Item>
    //     </Menu>
    //   );
    //   const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    //   };
    return (
        <div className='setting-main-layout'>
            {/* <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Dropdown overlay={menu} trigger={['click']} >
                    <Button type="primary" style={{ width: "100px" }}>
                        {i18n.language === 'fr' ? 'French' : 'English'} <DownOutlined />
                    </Button>
                </Dropdown>
            </div> */}
            <div className='setting-custom-card'>
                <div className='setting-tab-container'>
                    <button type='primary' className={'button-style active-button-style'}>
                        {t("Profile Setting")}
                    </button>
                </div>
                <div className="setting-tab-content">
                    <Form
                        form={form}
                        name="setting-profile-form"
                        onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{
                            remember: true,
                        }}
                        onChange={handleValuesChange}
                    >
                        <div style={{ display: "flex" }}>
                            <Form.Item
                                name="first_name"
                                label={t("First Name")}
                                rules={[
                                    {
                                        required: true,
                                        message: (t('first name is required')),
                                    },
                                ]}
                            >
                                <Input placeholder={t("First Name")} />
                            </Form.Item>
                            <Form.Item
                                style={{ marginLeft: "15px" }}
                                name="last_name"
                                label={t("Last Name")}
                                rules={[
                                    {
                                        required: true,
                                        message: (t('last name is required')),
                                    },
                                ]}
                            >
                                <Input placeholder={t("Last Name")} />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="company"
                            label={t("Company")}
                            rules={[
                                {
                                    required: true,
                                    message: (t('Company name is required!')),
                                },
                            ]}
                        >
                            <Input placeholder={t("Company")} disabled />
                        </Form.Item>
                        <Form.Item
                            label={t("Phone")}
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
                        // input mask 
                            <InputMask
                                style={{
                                    width: "98%",
                                    height: "42px",
                                    borderRadius: '0.625rem',
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
                        {/* </div> */}
                        <Form.Item
                            name="email"
                            label={t("Email")}
                            rules={[
                                {
                                    required: true,
                                    message: (t('Please enter an email')),
                                },
                                {
                                    type: 'email',
                                    message: (t("Please input a valid email!")),
                                },
                            ]}
                        >
                            <Input placeholder={t("Email")} />
                        </Form.Item>
                        <p style={{textAlign:"right"}}> <Link to="/dashboard">{t("Back now?")}</Link></p>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={formChanged ? "setting-form-enable-button" : "setting-form-disable-button"}
                                // className={"setting-form-enable-button"}
                                // onClick={Submitdata}
                                loading={loading}
                                disabled={!formChanged}
                            >
                                {t("Save")}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default UserSetting;
