import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message , Upload } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import {InstagramOutlined, LinkedinOutlined, FacebookOutlined } from '@ant-design/icons';
const AddUser = ({ isModalVisible, modalHideShow }) => {
    const [form] = Form.useForm(); // Creating form instance
    const onFinish = (values) => {
        const { firstname, lastname, email, phone, company } = values;
        const accessToken = localStorage.getItem('accessToken');
        const AddUserPayload = {
            first_name: firstname,
            last_name: lastname,
            phone_number: phone,
            email: email,
            company: company
        };

        axios.post(
            'https://api.smartconnect.cards/api/usercontacts/',
            AddUserPayload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                console.log("response", response);
                message.success("User Added Successfully");
                modalHideShow();
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            })
            .catch(error => {
                console.log("error", error);
                message.error("Failed to add user")
                modalHideShow();

            });
    };
    const handleCancel = () => {
        modalHideShow();
        form.resetFields();
    };
    return (
        <Modal
            title="Add User"
            width={450}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="add" type="primary" onClick={() => form.submit()}>
                    Add
                </Button>,
            ]}
        >
            <Form
                form={form} // Binding form instance to the form component
                layout="vertical"
                onFinish={onFinish} // Callback function when form is submitted
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        label="First Name*"
                        name="firstname"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a first name',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name*"
                        name="lastname"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a last name',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        label="Company*"
                        name="company"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter an company',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Job Title"
                        name="job_title"
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        label="Zip Code"
                        name="zip_code"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Postal Address"
                        name="postal_address"
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        label="Country"
                        name="country"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        label={<>Facebook <FacebookOutlined style={{fontSize:"20px", color:"#3b5998",marginLeft:"5px"}}/></>}
                        name="facebook"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={<>Instagram <InstagramOutlined style={{fontSize:"20px", color:"#e4405f",marginLeft:"5px"}}/></>}
                        name="instagram"
                    >
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item
                        label={<>Linkedin <LinkedinOutlined style={{fontSize:"20px", color:"#0e76a8",marginLeft:"5px"}}/></>}
                        name="linkedin"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email*"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter an email',
                        },
                        {
                            type: 'email',
                            message: 'Invalid email format',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Phone*"
                    name="phone"
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
                        placeholder="+33 6 79 95 91 92"
                    >
                    </InputMask>
                </Form.Item>
                <Form.Item
                    label="Biography"
                    name="biography"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal >
    );
};

export default AddUser;
