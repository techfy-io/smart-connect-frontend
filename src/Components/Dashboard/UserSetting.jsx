import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Form, message } from 'antd';
import axios from 'axios';
import './UserSetting.scss';
import InputMask from "react-input-mask";
const { Header } = Layout;

const UserSetting = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
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
                message.success("Settings updated successfully!");
            } else {
                message.error("Failed to update user settings");
            }
        }
    };

    const handleValuesChange = () => {
        setFormChanged(true);
    };

    return (
        <div className='setting-main-layout'>
            <div className='setting-custom-card'>
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
                        onChange={handleValuesChange}
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
                            <Form.Item
                             style={{ marginLeft: "15px" }}
                                label="Phone*"
                                name="phone_number"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a phone number',
                                    },
                                    {
                                        pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                        message: 'Invalid phone number format',
                                    },
                                ]}
                            >
                                <InputMask
                                    style={{
                                        width: "100%",
                                        height: "44px",
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
                                className={formChanged ? "setting-form-enable-button" : "setting-form-disable-button"}
                                // className={"setting-form-enable-button"}
                                // onClick={Submitdata}
                                loading={loading}
                                disabled={!formChanged}
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

export default UserSetting;
