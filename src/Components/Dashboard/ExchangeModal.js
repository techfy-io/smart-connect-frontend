// // ExchangeModal.js
// import { useTranslation } from "react-i18next";

// import React from 'react';
// import { Modal, Form, Input, Button } from 'antd';
// import InputMask from "react-input-mask";

// const ExchangeModal = ({ open, onClose, onSubmit, loading }) => {
//     const { t, i18n } = useTranslation('translation');
//     const [form] = Form.useForm();
//     const handleCancel = () => {
//         onClose();
//         form.resetFields();
//     };

//     const onFinish = async (values) => {
//         onSubmit(values);
//     };

//     return (
//         // exchange Modal 
//         <Modal
//             title={t("Exchange")}
//             open={open}
//             onCancel={handleCancel}
//             footer={[
//                 <Button key="cancel" onClick={handleCancel}>
//                     {t("Cancel")}
//                 </Button>,
//                 <Button
//                     key="submit"
//                     type="primary"
//                     onClick={() => form.submit()}
//                     loading={loading}
//                 >
//                     {t("Submit")}
//                 </Button>,
//             ]}
//         >
//             <Form
//                 name="exchangeForm"
//                 form={form}
//                 onFinish={onFinish}
//                 layout="vertical"
//             >
//                 <Form.Item
//                     label={`${t("First Name")}*`}
//                     name="first_name"
//                     rules={[
//                         {
//                             required: true,
//                             message: t('Please input your first name!'),
//                         },
//                     ]}
//                 >
//                     <Input
//                         maxLength={30}
//                         autoComplete="first_name" 
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label={`${t("Last Name")}*`}
//                     name="last_name"
//                     rules={[
//                         {
//                             required: true,
//                             message: t('Please input your last name!'),
//                         },
//                     ]}
//                 >
//                     <Input
//                         maxLength={30}
//                         autoComplete="last_name-name" 
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label={t("Company Name")}
//                     name="company"
//                 >
//                     <Input
//                         autoComplete="company" 
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label={`${t("Email")}*`}
//                     name="email"
//                     rules={[
//                         {
//                             type: 'email',
//                             message: t('Please input a valid email!'),
//                         },
//                         {
//                             required: true,
//                             message: t('Please enter an email'),
//                         },
//                     ]}
//                 >
//                     <Input
//                         autoComplete="email" 
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label={`${t("Phone")}*`}
//                     name="phone_number"
//                     rules={[
//                         {
//                             required: true,
//                             message: t('Please enter a phone number'),
//                         },
//                         // {
//                         //     pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
//                         //     message: t('Invalid phone number format'),
//                         // },
//                     ]}
//                 >
//                     <Input
//                         style={{
//                             width: "100%", 
//                             height: "30px",
//                             borderRadius: "5px",
//                             border: "1px solid #d9d9d9",
//                             paddingLeft: "8px",
//                             color: "black",
//                             transition: "border-color 0.3s",
//                         }}
//                         // mask="+33 9 99 99 99 99"
//                         maskChar=""
//                         placeholder="+33 1 23 45 67 89"
//                         autoComplete="tel" 
//                     />
//                 </Form.Item>
//             </Form>

//         </Modal>
//     );
// };

// export default ExchangeModal;

import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import $ from 'jquery';
import { useTranslation } from "react-i18next";
window.jQuery = $;
window.$ = $;
require("jquery-ui-sortable");
require("formBuilder");
const ExchangeModal = ({ open, onClose, onSubmit, loading, userData }) => {
    const { t } = useTranslation('translation');
    const [form] = Form.useForm();
    const formBuilderRef = useRef(null);
    useEffect(() => {
        if (open) {
            if (formBuilderRef.current) {
                $('#form-builder').formBuilder('reset');  
                $('#form-builder').formBuilder('setData', []); 
            } else {
                const options = {
                    disableFields: [
                        'autocomplete', 'button', 'paragraph', 'date',
                        'header', 'hidden', 'number', 'radio-group', 'textarea',
                        'select', 'file'
                    ],
                    onOpenFieldEdit: () => {
                        $(`
                        .description-wrap,
                        .toggle-wrap,
                        .inline-wrap,
                        .className-wrap,
                        .name-wrap,
                        .access-wrap,
                        .other-wrap,
                        .subtype-wrap,
                        .maxlength-wrap,
                        .rows-wrap,
                        .multiple-wrap
                        `).hide();
                    },
                    controlOrder: [
                        'text', 'checkbox-group'
                    ],
                    showActionButtons: false
                };
                formBuilderRef.current = $('#form-builder').formBuilder(options);
            }
        }
    }, [open]);
    const handleCancel = () => {
        onClose();
        form.resetFields();
        // Optionally, reset the FormBuilder instance here if needed
    };
    const onFinish = async (values) => {
        const formBuilderData = $('#form-builder').formBuilder('getData');
        const formattedExtraFields = formBuilderData.map(field => {
            if (field.type === 'checkbox-group') {
                const options = field.values.map(option => ({
                    label: option.label,
                    value: option.value,
                    selected: option.selected,  // Include the selected state
                }));
                return {
                    field_type: field.type,
                    label: field.label,
                    name: field.name,
                    value: options,  // Store the array of options with their selected state
                };
            } else {
                return {
                    field_type: field.type,
                    label: field.label,
                    name: field.name,
                    value: values[field.name] || field.value || "",  // Handle other field types
                };
            }
        });
        const requestData = {
            ...values,
            owner: userData?.id, 
            extra_fields: formattedExtraFields,
        };
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/exchange/`, requestData);
            console.log('Response:', response.data);
            onClose(); 
            form.resetFields()
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    // const onFinish = async (values) => {
    //     onSubmit(values);
    // };
   
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
                    rules={[
                        {
                            required: true,
                            message: t('Please input your first name!'),
                        },
                    ]}
                >
                    <Input maxLength={30} autoComplete="first_name" />
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
                    <Input maxLength={30} autoComplete="last_name" />
                </Form.Item>
                <Form.Item
                    label={t("Company Name")}
                    name="company"
                >
                    <Input autoComplete="company" />
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
                    <Input autoComplete="email" />
                </Form.Item>
                <Form.Item
                    label={`${t("Phone")}*`}
                    name="phone_number"
                    rules={[
                        {
                            required: true,
                            message: t('Please enter a phone number'),
                        },
                    ]}
                >
                    <Input
                        style={{
                            width: "100%",
                            height: "30px",
                            borderRadius: "5px",
                            border: "1px solid #D9D9D9",
                            paddingLeft: "8px",
                            color: "black",
                            transition: "border-color 0.3s",
                        }}
                        placeholder="+33 1 23 45 67 89"
                        autoComplete="tel"
                    />
                </Form.Item>
                {/* Add the FormBuilder here */}
                <div id="form-builder"></div>
            </Form>
        </Modal>
    );
};
export default ExchangeModal;
