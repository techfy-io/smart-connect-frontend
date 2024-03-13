import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, message } from 'antd';
import axios from 'axios';
import './ForgetPassword.scss';

const { Header } = Layout;

const ForgetPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [accessToken, setToken] = useState();

    const handleSubmit = async (values) => {
        setToken(localStorage.getItem('accessToken'));
        setLoading(true);
        try {
            await axios.post('https://api.smartconnect.cards/api/forgot-password/', values);
            message.success("Email sent successfully");
        } catch (error) {
            console.log("Error:", error);
            message.error("Failed to forget password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ForgetPassword-main-layout'>
            <div className='ForgetPassword-custom-card'>
                <div className='ForgetPassword-tab-container'>
                    <button type='primary' className={'button-style active-button-style'}>
                        Forgot Password
                    </button>
                </div>
                <div className="ForgetPassword-tab-content">
                    <Form
                        form={form}
                        name="ForgetPassword-profile-form"
                        // onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{
                            remember: true,
                        }}
                    >
                        <div className='section-para-container'>
                            <p className='section-para'>Enter the email address you used when joining, and we’ll send
                                reset instructions to reset your password.</p>
                        </div>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                    message: 'Please input a valid email!',
                                },
                            ]}
                        >
                            <Input placeholder="Email" />
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
        </div>
    );
};

export default ForgetPassword;
