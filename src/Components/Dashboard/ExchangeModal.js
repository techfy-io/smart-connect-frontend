import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useTranslation } from "react-i18next";
import $ from 'jquery';

// Make jQuery available globally for formBuilder
window.jQuery = $;
window.$ = $;
require("jquery-ui-sortable");
require("formBuilder");

const ExchangeModal = ({ open, onClose, onSubmit, loading }) => {
    const { t } = useTranslation('translation');
    const [form] = Form.useForm();
    const formBuilderRef = useRef(null);

    // Initialize formBuilder when the modal opens
    // useEffect(() => {
    //     if (open) {
    //         if (formBuilderRef.current) {
    //             // Reset the formBuilder when modal is reopened
    //             $('#form-builder').formBuilder('reset');
    //             $('#form-builder').formBuilder('setData', []);
    //         } else {
    //             const options = {
    //                 disableFields: [
    //                     'autocomplete', 'button', 'paragraph', 'date',
    //                     'header', 'hidden', 'number', 'radio-group', 'textarea',
    //                     'select', 'file'
    //                 ],

    //                 onOpenFieldEdit: () => {
    //                     $(`.description-wrap, .toggle-wrap, .inline-wrap, .className-wrap, 
    //                       .name-wrap, .access-wrap, .other-wrap, .subtype-wrap, .maxlength-wrap,
    //                       .rows-wrap, .multiple-wrap`).hide();
    //                 },
    //                 controlOrder: ['text', 'checkbox-group'],
    //                 showActionButtons: false
    //             };
    //             formBuilderRef.current = $('#form-builder').formBuilder(options);
    //         }
    //     }
    // }, [open]);

    // Handle form cancellation
    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    // Handle form submission
    const onFinish = async (values) => {
        // const formBuilderData = $('#form-builder').formBuilder('getData');
        // const formattedExtraFields = formBuilderData.map(field => {
        //     if (field.type === 'checkbox-group') {
        //         const options = field.values.map(option => ({
        //             label: option.label,
        //             value: option.value,
        //             selected: option.selected,
        //         }));
        //         return {
        //             field_type: field.type,
        //             label: field.label,
        //             name: field.name,
        //             value: options,
        //         };
        //     } else {
        //         return {
        //             field_type: field.type,
        //             label: field.label,
        //             name: field.name,
        //             value: values[field.name] || field.value || "",
        //         };
        //     }
        // });

        const requestData = {
            ...values,
            // extra_fields: formattedExtraFields,
        };

        onSubmit(requestData); // or directly handle it here
    };

    return (
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
                    rules={[{
                        required: true,
                        message: t('Please input your first name!'),
                    }]}
                >
                    <Input maxLength={30} autoComplete="first_name" />
                </Form.Item>
                <Form.Item
                    label={`${t("Last Name")}*`}
                    name="last_name"
                    rules={[{
                        required: true,
                        message: t('Please input your last name!'),
                    }]}
                >
                    <Input maxLength={30} autoComplete="last_name" />
                </Form.Item>
                <Form.Item label={t("Company Name")} name="company">
                    <Input autoComplete="company" />
                </Form.Item>
                <Form.Item
                    label={`${t("Email")}*`}
                    name="email"
                    rules={[
                        { type: 'email', message: t('Please input a valid email!') },
                        { required: true, message: t('Please enter an email') },
                    ]}
                >
                    <Input autoComplete="email" />
                </Form.Item>
                <Form.Item
                    label={`${t("Phone")}*`}
                    name="phone_number"
                    rules={[{
                        required: true,
                        message: t('Please enter a phone number'),
                    }]}
                >
                    <Input
                        style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #D9D9D9", paddingLeft: "8px", color: "black", transition: "border-color 0.3s" }}
                        placeholder="+33 1 23 45 67 89"
                        autoComplete="tel"
                    />
                </Form.Item>

                {/* FormBuilder Component */}
                {/* <div id="form-builder"></div> */}
            </Form>
        </Modal>
    );
};

export default ExchangeModal;
