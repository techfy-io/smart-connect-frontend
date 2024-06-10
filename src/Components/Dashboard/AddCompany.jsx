import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const AddCompany = ({ openAddcompanymodal, toggleAddCompanyModal }) => {
    const { t, i18n } = useTranslation('translation');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        toggleAddCompanyModal();
        form.resetFields();
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_API_URL}/companies/add/`,
                values,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                }
            );

            message.success({
                content: t("Company added successfully. Please check your email, including the Spam folder."),
                style: {
                    width: '23rem', 
                    margin:"0 auto",
                },
                duration: 10, 
            });
            toggleAddCompanyModal();
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
        catch (error) {
            console.log("error", error);
            if (error.response) {
                if (error.response.status === 404 || error.response.status === 500) {
                    message.error("Failed: Something went wrong with the server.");
                } else {
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
                console.error("No response received from the server:", error.request);
                message.error(t("Failed: No response received from the server."));
            } else {
                console.error("Error setting up the request:", error.message);
                message.error(t("Failed: Error setting up the request."));
            }
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t("Add Company")}
            open={openAddcompanymodal}
            onCancel={handleCancel}
            footer={null}
        // width={500}
        // height={400}
        >
            <Form
                name={t("Add New Company")}
                form={form}
                onFinish={onFinish}
            >
                <label htmlFor="firstname">{t("First Name")}*</label>
                <Form.Item
                    name="first_name"
                    rules={[
                        {
                            required: true,
                            message: (t('Please input your first name!')),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="lastname">{t("Last Name")}*</label>
                <Form.Item
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: (t('Please input your last name!')),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="company_name">{t("Company Name")}*</label>
                <Form.Item
                    name="company_name"
                    rules={[
                        {
                            required: true,
                            message: (t('Please input your company name!')),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="email">{t("Email")}*</label>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: (t('Please input a valid email!')),
                        },
                        {
                            required: true,
                            message: (t('Please enter an email')),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="password">{t("Password")}*</label>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: (t("Password must be required")),
                        },
                        {
                            pattern: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/,
                            message: t('Password must be at least eight characters long and include both letters and numbers.'),
                        },
                    ]}
                >
                    <Input.Password
                        placeholder={t("Password")}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <label htmlFor="phone">{t("Phone")}</label>
                <Form.Item
                    name="phone_number"
                >
                    <InputMask
                        style={{
                            width: "97%",
                            height: "30px",
                            borderRadius: "5px",
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
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                        {t("Cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: "#ff8000" }} loading={loading}>
                        {t("Add Company")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCompany;
