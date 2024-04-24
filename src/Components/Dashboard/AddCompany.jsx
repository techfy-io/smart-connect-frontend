import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const AddCompany = ({ openAddcompanymodal, toggleAddCompanyModal }) => {
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
            message.success("Company added successfully")
            console.log('Company added successfully:', response.data);
            toggleAddCompanyModal();
              setTimeout(() => {
                window.location.reload();
            }, 2000);
        } 
        catch (error) {
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
            setLoading(false)
        } finally {
            setLoading(false); 
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
