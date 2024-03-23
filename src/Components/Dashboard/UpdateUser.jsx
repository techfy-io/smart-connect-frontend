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
            phone_number: user?.phone_number,
        });
    }, [openEditModal, user]);

    const [form] = Form.useForm();
    const onFinish = (values) => {
        const { firstname, lastname, email, phone_number } = values;
        const accessToken = localStorage.getItem('accessToken');
        const UpdareUserPayload = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            phone_number: phone_number,
            company_name:user.company_name,
            user: user.id,
        };

        axios.patch(
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
                            name="phone_number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter a phone number',
                                },
                                {
                                    pattern: /\+\d{2} \d \d{2} \d{2} \d{2} \d{2}/,
                                    message: 'Invalid phone number format',
                                },
                            ]}
                        >
                            <InputMask
                                style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #d9d9d9", paddingLeft: "8px", color: "black", transition: "border-color 0.3s", }}
                                mask="+33 9 99 99 99 99"
                                maskChar=""
                                placeholder="+33 6 79 95 91 92"
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
