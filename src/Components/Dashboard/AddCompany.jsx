import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";

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
            visible={openAddcompanymodal}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                name="exchangeForm"
                form={form}
                onFinish={onFinish}
            >
                <label htmlFor="firstname">Name*</label>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
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
                <label htmlFor="phone">Phone</label>
                <Form.Item
                    name="phone_number"
                >
                   <InputMask
                                style={{
                                    width: "95%",
                                    height: "30px",
                                    borderRadius: "5px",
                                    border: "1px solid #d9d9d9",
                                    paddingLeft: "8px",
                                    color: "black",
                                    transition: "border-color 0.3s",
                                }}
                                mask="+33 9 99 99 99 99"
                                maskChar=""
                                placeholder="+33 9 99 99 99 99"
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
