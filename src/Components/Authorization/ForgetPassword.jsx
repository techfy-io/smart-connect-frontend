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
            await axios.post(`${process.env.REACT_APP_BASE_API_URL}/forgot-password/`, values);
            message.success("Email sent successfully");
        }catch (error) {
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
            setLoading(false);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ResetPassword-main-layout'>
            <div className='ResetPassword-custom-card'>
                <div className='ResetPassword-tab-container'>
                    <button type='primary' className={'button-style active-button-style'}>
                        Forgot Password
                    </button>
                </div>
                <div className="ResetPassword-tab-content">
                    <Form
                        form={form}
                        name="ResetPassword-profile-form"
                        onFinish={handleSubmit}
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
                                className="ResetPassword-form-enable-button"
                                loading={loading}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
