import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Upload, Radio } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import { UploadOutlined, PlusOutlined, CloseOutlined ,DeleteOutlined} from '@ant-design/icons';
import './Dashboard.scss';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const AddUser = ({ isModalVisible, modalHideShow }) => {
    const [form] = Form.useForm();
    const [additionalPhones, setAdditionalPhones] = useState([]);
    const [additionalEmails, setAdditionalEmails] = useState([]);

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

    const handleAddPhone = () => {
        if (additionalPhones.length < 2) {
            setAdditionalPhones([...additionalPhones, '']);
        }
    };

    const handleAddEmail = () => {
        if (additionalEmails.length < 2) {
            setAdditionalEmails([...additionalEmails, '']);
        }
    };

    const handleRemovePhone = (index) => {
        const updatedPhones = additionalPhones.filter((phone, i) => i !== index);
        setAdditionalPhones(updatedPhones);
    };

    const handleRemoveEmail = (index) => {
        const updatedEmails = additionalEmails.filter((email, i) => i !== index);
        setAdditionalEmails(updatedEmails);
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
            <div className='custom-scrollbar' style={{ overflowX: 'auto', height: '450px' }}>
                <Form
                    form={form} // Binding form instance to the form component
                    layout="vertical"
                    onFinish={onFinish} // Callback function when form is submitted
                >
                    {/* Profile Picture Upload */}
                    <Form.Item label="Profile Picture">
                        <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                    {/* Cover Picture Upload */}
                    <Form.Item label="Cover Picture">
                        <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}>Upload</Button>
                        </Upload>
                    </Form.Item>

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
                                    message: 'Please enter a company',
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
                            <Input maxLength={5} />
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
                            label={<>Facebook < i className="fa fa-facebook   icon facebook-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i> </>}
                            name="facebook"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<>Instagram <i className="fa fa-instagram  icon instagram-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                            name="instagram"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label={<>Linkedin <i className="fa fa-linkedin icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i>
                        </>}
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
                    {additionalEmails.map((email, index) => (
                        <Form.Item
                            key={index}
                            label={`Additional Email ${index + 1}`}
                            name={`additionalEmail${index + 1}`}
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Invalid email format',
                                },
                            ]}
                        >
                            <Input
                                suffix={
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveEmail(index)}
                                    />
                                }
                            />
                        </Form.Item>
                    ))}
                    {
                        additionalEmails.length < 2 && (
                            <>
                                <Form.Item>
                                    <Button type="dashed" onClick={handleAddEmail} icon={<PlusOutlined />}>
                                        Email
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                            label="Phone Type"
                            name="phoneType"
                        >
                            <Radio.Group>
                                <Radio value="professional">Professional</Radio>
                                <Radio value="personal">Personal</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {additionalPhones.map((phone, index) => (
                        <Form.Item
                            key={index}
                            label={`Another Phone ${index + 1}`}
                            name={`phonenumber${index + 1}`}
                        >
                            <Input
                                suffix={
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemovePhone(index)}
                                    />
                                }
                            />
                        </Form.Item>
                    ))}
                    {
                        additionalPhones.length < 2 && (
                            <>
                                <Form.Item>
                                    <Button type="dashed" onClick={handleAddPhone} icon={<PlusOutlined />}>
                                        Phone
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }
                    <Form.Item
                        label="Biography"
                        name="biography"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </div>
        </Modal >
    );
};

export default AddUser;
