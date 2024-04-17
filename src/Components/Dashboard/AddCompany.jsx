import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const AddCompany = ({ openAddcompanymodal, toggleAddCompanyModal }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // State to control loading indicator

    const handleCancel = () => {
        toggleAddCompanyModal();
        form.resetFields();
    };

    const onFinish = async (values) => {
        try {
            setLoading(true); // Start loading
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
            message.success("Company added successfully")
            console.log('Company added successfully:', response.data);
            // handleCancel();
        } catch (error) {
            console.error('Error adding company:', error);
            message.error(error.response.data.name)
        } finally {
            setLoading(false); // Stop loading (whether success or error)
        }
    };

    return (
        <Modal
            title="Add Company"
            open={openAddcompanymodal}
            onCancel={handleCancel}
            footer={null}
        // width={500}
        // height={400}
        >
            <Form
                name="exchangeForm"
                form={form}
                onFinish={onFinish}
            >
                <label htmlFor="firstname">First Name*</label>
                <Form.Item
                    name="first_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input yourfirst name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="lastname">Last Name*</label>
                <Form.Item
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="company_name">Company Name*</label>
                <Form.Item
                    name="company_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your company  name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="email">Email*</label>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not a valid email!',
                        },
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="password">Password*</label>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            type: "password",
                        },
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <label htmlFor="phone">Phone</label>
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
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: "#ff8000" }} loading={loading}>
                        Add Company
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCompany;
