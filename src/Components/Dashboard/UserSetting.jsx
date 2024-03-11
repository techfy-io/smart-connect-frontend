import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, message } from 'antd';
import axios from 'axios';
import './UserSetting.scss';

const { Header } = Layout;

const UserSetting = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get('http://smart-connect.eu-west-3.elasticbeanstalk.com/api/user/settings/', {
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
                    mobile: data.mobile,
                    email: data.email,

                });
            })
            .catch(error => {
                console.log("Error:", error);
            });
    }, [form, accessToken]);


    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axios.put('http://smart-connect.eu-west-3.elasticbeanstalk.com/api/user/settings/', values, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            message.success("Settings updated successfully!");
        } catch (error) {
            console.log("Error:", error);
            // message.error("failed to update user settings")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='setting-main-layout'>
            <div className='setting-custom-card'>
                <h2 className='setting-heading'>Setting</h2>
                <div className='setting-tab-container'>
                    <button type='primary' className={'button-style active-button-style'}>
                        Profile Setting
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
                    >
                        <div style={{ display: "flex" }}>
                            <Form.Item

                                name="first_name"
                                label="First name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>
                            <Form.Item
                                style={{ marginLeft: "15px" }}

                                name="last_name"
                                label="Last name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Form.Item
                                name="mobile"
                                label="Phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your phone number!',
                                    },
                                ]}
                            >
                                <Input placeholder="Phone" />
                            </Form.Item>
                            <Form.Item
                                style={{ marginLeft: "15px" }}
                                name="company"
                                label="Company"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your company!',
                                    },
                                ]}
                            >
                                <Input placeholder="Company" />
                            </Form.Item>
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
                            <Button type="primary" htmlType="submit" className="setting-form-button" onClick={handleSubmit} loading={loading}>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default UserSetting;
