import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, message, Spin, Result, Menu, Dropdown } from 'antd';
import axios from 'axios';
import './ResetPassword.scss';
import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined, CloseCircleOutlined , DownOutlined} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import  {Link}  from 'react-router-dom';
import { useTranslation } from "react-i18next";
const { Header } = Layout;
const ResetPassword = () => {
    const { t, i18n } = useTranslation('translation')
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [updateloading, setupdateloading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uidb64 = searchParams.get('uid');
    const token = searchParams.get('token');
// token validation
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BASE_API_URL}/reset-password/validate_token/?uid=${uidb64}&token=${token}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
                console.log(response.data, "token valid");
                setIsValidToken(true);
            } catch (error) {
                setIsValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token, uidb64]);

    const handleSubmit = async (values) => {
        setupdateloading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BASE_API_URL}/reset-password/${uidb64}/${token}/`, { ...values ,uidb64
            ,token});
            setupdateloading(false);
            message.success("Password Update successfully");
            window.location.href = '/'; // Redirect to the desired URL upon success
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
            setupdateloading(false);
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
        <div className='reset-password-main-layout'>
             <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Dropdown overlay={menu} trigger={['click']} >
                    <Button type="primary" style={{ width: "100px" }}>
                        {i18n.language === 'fr' ? 'French' : 'English'} <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
            {loading ? (
                <div style={{ textAlign: "center", color: "white" }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} />} style={{ color: "white" }} />
                </div>
            ) : isValidToken ? (
                <div className='reset-password-custom-card'>
                    <div className='reset-password-tab-container'>
                        <button type='primary' className={'button-style active-button-style'}>
                            {t("Reset Password")}
                        </button>
                    </div>
                    <div className="reset-password-tab-content">
                        <Form
                            form={form}
                            name="reset-password-profile-form"
                            onFinish={handleSubmit}
                            layout="vertical"
                            initialValues={{
                                remember: true,
                            }}
                        >
                            <div className='section-para-container'>
                                {/* <p className='section-para'>Enter your new password.</p> */}
                            </div>
                            <Form.Item
                                name="new_password"
                                label={t("New Password")}
                                rules={[
                                    {
                                        required: true,
                                        message: (t('Please input your new password')),
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder={t("New Password")}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirm_password"
                                label={t("Confirm Password")}
                                dependencies={['new_password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: (t('Please confirm your password')),
                                    },
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('The new password and confirm password do not match!')));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder={t("Confirm Password")}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            {/* <div style={{textAlign:"right"}} >
                            <Link className='forget-password-link' to={'/'}>Back to Login?</Link>
                            </div> */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="reset-password-form-enable-button"
                                    loading={updateloading}
                                >
                                    {t("Save")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            ) : (
                <Result
                    icon={<CloseCircleOutlined style={{ color: '#f5222d', fontSize: 50 }} />}
                    title={<><h3 style={{ color: "white" }}>{t("Invalid or expired token")}</h3></>}
                    subTitle={<><h5 style={{ color: "white" }}>{t("Please check your email for the latest reset link or request a new one.")}</h5></>}
                />
            )}
        </div>
    );
};

export default ResetPassword;
