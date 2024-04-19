import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, message, Spin, Result } from 'antd';
import axios from 'axios';
import './ResetPassword.scss';
import { EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import  {Link}  from 'react-router-dom';
const { Header } = Layout;

const ResetPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uidb64 = searchParams.get('uid');
    const token = searchParams.get('token');

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(
                    `https://api.smartconnect.cards/api/reset-password/validate_token/?uid=${uidb64}&token=${token}`,
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
        setLoading(true);
        try {
            await axios.post(`https://api.smartconnect.cards/api/reset-password/${uidb64}/${token}/`, { ...values ,uidb64
            ,token});
            message.success("Password Update successfully");
        } catch (error) {
            console.log("Error:", error);
            message.error(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='reset-password-main-layout'>
            {loading ? (
                <div style={{ textAlign: "center", color: "white" }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} />} style={{ color: "white" }} />
                </div>
            ) : isValidToken ? (
                <div className='reset-password-custom-card'>
                    <div className='reset-password-tab-container'>
                        <button type='primary' className={'button-style active-button-style'}>
                            Reset Password
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
                                label="New Password"
                                rules={[
                                    {
                                        required: true,
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
                                dependencies={['new_password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password',
                                    },
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new password and confirm password do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder="Confirm Password"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <div style={{textAlign:"right"}} >
                            <Link className='forget-password-link' to={'/'}>Back to Login?</Link>
                            </div>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="reset-password-form-enable-button"
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
                    title={<><h3 style={{ color: "white" }}>Invalid or expired token</h3></>}
                    subTitle={<><h5 style={{ color: "white" }}>Please check your email for the latest reset link or request a new one.</h5></>}
                />
            )}
        </div>
    );
};

export default ResetPassword;
