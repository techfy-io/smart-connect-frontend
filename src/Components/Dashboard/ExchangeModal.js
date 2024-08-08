// ExchangeModal.js
import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import InputMask from "react-input-mask";

const ExchangeModal = ({ open, onClose, onSubmit, loading }) => {
    const { t } = useTranslation('translation');
    const [form] = Form.useForm();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    const onFinish = async (values) => {
        onSubmit(values);
    };

    return (
        // Exchange Modal 
        <Modal
            title={t("Exchange")}
            open={open}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    {t("Cancel")}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => form.submit()}
                    loading={loading}
                >
                    {t("Submit")}
                </Button>,
            ]}
        >
            <Form
                name="exchangeForm"
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label={`${t("First Name")}*`}
                    name="first_name"
                    rules={[
                        {
                            required: true,
                            message: t('Please input your first name!'),
                        },
                    ]}
                >
                    <Input
                        maxLength={30}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} 
                        autoComplete="given-name" 
                    />
                </Form.Item>
                <Form.Item
                    label={`${t("Last Name")}*`}
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: t('Please input your last name!'),
                        },
                    ]}
                >
                    <Input
                        maxLength={30}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name" 
                    />
                </Form.Item>
                <Form.Item
                    label={t("Company Name")}
                    name="company"
                >
                    <Input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)} 
                        autoComplete="organization" 
                    />
                </Form.Item>
                <Form.Item
                    label={`${t("Email")}*`}
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: t('Please input a valid email!'),
                        },
                        {
                            required: true,
                            message: t('Please enter an email'),
                        },
                    ]}
                >
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        autoComplete="email" 
                    />
                </Form.Item>
                <Form.Item
                    label={`${t("Phone")}*`}
                    name="phone_number"
                    rules={[
                        {
                            required: true,
                            message: t('Please enter a phone number'),
                        },
                        // {
                        //     pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                        //     message: t('Invalid phone number format'),
                        // },
                    ]}
                >
                    <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        autoComplete="phone" 
                    />
                </Form.Item>
                {/* <Form.Item
                    label={`${t("Phone")}*`}
                    name="phone_number"
                    rules={[
                        {
                            required: true,
                            message: t('Please enter a phone number'),
                        },
                        {
                            pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                            message: t('Invalid phone number format'),
                        },
                    ]}
                >
                    <InputMask
                        style={{
                            width: "100%", 
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
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        autoComplete="tel" 
                    />
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

export default ExchangeModal;
