import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";

const UpdateUser = ({ openEditModal, UpdatemodalHideShow, user }) => {

    useEffect(() => {
        form.setFieldsValue({
            firstname: user?.first_name,
            lastname: user?.last_name,
            email: user?.email,
            phone: user?.phone_number,
        });
    }, [openEditModal, user]);

    const [form] = Form.useForm();
    const onFinish = (values) => {
        const { firstname, lastname, email, phone } = values;
        const accessToken = localStorage.getItem('accessToken');
        const UpdareUserPayload = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            phone_number: phone,
            user: "1"
        };

        axios.put(
            `${process.env.REACT_APP_BASE_API_URL}/usercontacts/${user.id}/`,
            UpdareUserPayload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
            .then(response => {
                console.log("response", response);
                message.success("User Update Successfully");
                UpdatemodalHideShow();
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            })
            .catch(error => {
                console.log("error", error);
                message.error("Failed to Update user")
            });
    };
    const handleCancel = () => {
        UpdatemodalHideShow();
        form.resetFields();
    };

    return (
        <Modal
            style={{ marginTop: "50px" }}
            title="UpdateUser"
            open={openEditModal}
            onCancel={handleCancel}
            footer={
                [
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="add" type="primary" onClick={() => form.submit()}>
                        Update
                    </Button>,
                ]}
        >
            {
                user && (
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
                )
            }

        </Modal >
    );
};

export default UpdateUser;
