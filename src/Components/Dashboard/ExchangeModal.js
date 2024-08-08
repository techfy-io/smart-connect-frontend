// ExchangeModal.js
import { useTranslation } from "react-i18next";

import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import InputMask from "react-input-mask";

const ExchangeModal = ({ open, onClose, onSubmit, loading }) => {
    const { t, i18n } = useTranslation('translation');
    const [form] = Form.useForm();
    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    const onFinish = async (values) => {
        onSubmit(values);
    };

    return (
        // exchange Modal 
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
                            name="exchange Form"
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
                                <Input maxLength={30} />
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
                                <Input maxLength={30} />
                            </Form.Item>
                            <label htmlFor="companyname">{t("Company Name")}</label>
                            <Form.Item
                                name="company">
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
                            <label htmlFor="phone">{t("Phone")}*</label>
                            <Form.Item
                                name="phone_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (t('Please enter a phone number')),
                                    },
                                    {
                                        pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                        message: (t('Invalid phone number format')),
                                    },
                                ]}
                            >
                                <InputMask
                                    style={{
                                        width: "98.1%",
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
                        </Form>
        </Modal>
    );
};

export default ExchangeModal;
