import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";

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
            visible={isModalVisible}
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
                    label="company*"
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
                    label="Phone*"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter a phone number',
                        },
                        {
                            pattern: /\(\d{3}\) \d{3}-\d{4}/,
                            message: 'Invalid phone number format',
                        },
                    ]}
                >
                    <InputMask
                        style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #d9d9d9", paddingLeft: "8px", color: "black", transition: "border-color 0.3s", }}
                        mask="(999) 999-9999" // Define the mask format for a US phone number
                        maskChar=""
                        placeholder="(123) 345-6789"
                    >
                    </InputMask>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUser;
