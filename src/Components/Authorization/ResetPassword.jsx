import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, message, Spin,Result } from 'antd';
import axios from 'axios';
import './ResetPassword.scss';
import { EyeInvisibleOutlined, EyeTwoTone,LoadingOutlined ,CloseCircleOutlined} from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Header } = Layout;

const ResetPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true); // Initially set loading to true
    const [isValidToken, setIsValidToken] = useState(false);

    const { token, uid } = useParams();

    useEffect(() => {
        const validateToken = async () => {
            try {
                await axios.post('https://api.smartconnect.cards/api/validate-token/', { uid, token });
                setIsValidToken(true);
            } catch (error) {
                setIsValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token, uid]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.post('https://api.smartconnect.cards/api/reset-password/', { ...values, uid, token });
            message.success("Password reset successfully");
        } catch (error) {
            console.log("Error:", error);
            message.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ForgetPassword-main-layout'>
            {loading ? (
                <>
               <div style={{ textAlign: "center", color: "white" }}>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} />} style={{ color: "white" }} />
                        </div>
                </>
            ) : isValidToken ? (
                <div className='ForgetPassword-custom-card'>
                    <div className='ForgetPassword-tab-container'>
                        <button type='primary' className={'button-style active-button-style'}>
                            Reset Password
                        </button>
                    </div>
                    <div className="ForgetPassword-tab-content">
                        <Form
                            form={form}
                            name="ForgetPassword-profile-form"
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
                                label="New Password"
                                rules={[
                                    {
                                        required: true,
                                        type: 'text',
                                        message: 'Please input your new password',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="New Password"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirm_password"
                                label="Confirm Password"
                                rules={[
                                    {
                                        required: true,
                                        type: 'text',
                                        message: 'Please confirm your password',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Confirm Password"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="ForgetPassword-form-enable-button"
                                    loading={loading}
                                >
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                ) : (
                    <Result
                   
                            icon={<CloseCircleOutlined style={{ color: '#f5222d', fontSize: 50 }} />}
                            title={<><h3 style={{color:"white"}}>Invalid or expired token</h3></>}
                            subTitle={<><h5 style={{color:"white"}}>Please check your email for the latest reset link or request a new one.</h5></>}
                        />
                )}
        </div>
    );
};

export default ResetPassword;
