import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Upload, Radio, Spin, Select } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import { UploadOutlined, PlusOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import './Dashboard.scss';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS
import { useEffect } from 'react';
import FormItem from 'antd/es/form/FormItem';

const AddUser = ({ isModalVisible, modalHideShow, CompaniesDate }) => {
    const [form] = Form.useForm();
    const [additionalPhones, setAdditionalPhones] = useState([]);
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [additionalSocialMediaLinks, setAdditionalSocialMediaLinks] = useState([]);
    const [currentCompany, setCurrentCompany] = useState('')
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const {
            first_name, last_name, email, email_1, phone_number, phone_number_1, phone_number_2,
            phone_number_personal, phone_number_professional, job_title, biography, postal_code, zip_code,
            country, city, facebook_url, instagram_url, linkedin_url, other_link_1, other_link_media, company_name, profile_picture, cover_image, user_id
        } = values;
        const accessToken = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('first_name', first_name || "");
        formData.append('last_name', last_name || "");
        formData.append('email', email || "");
        if (email_1) { formData.append('email_1', email_1); }
        formData.append('phone_number', phone_number || "");
        if (phone_number_1) {
            formData.append('phone_number_1', phone_number_1);
        }
        formData.append('phone_number_2', phone_number_2 || "");
        formData.append('phone_number_personal', phone_number_personal || "");
        formData.append('phone_number_professional', phone_number_professional || "");
        formData.append('job_title', job_title || "");
        formData.append('bio_graphy', biography || "");
        formData.append('postal_code', postal_code || "");
        formData.append('zip_code', zip_code || "");
        formData.append('country', country || "");
        formData.append('city', city || "");
        formData.append('facebook_url', facebook_url||"");
        formData.append('instagram_url', instagram_url ||"");
        formData.append('linkedin_url', linkedin_url||"");
        formData.append('other_link_1', other_link_1 || "");
        formData.append('other_link_media', other_link_media || "");
        formData.append('company_name', currentCompany || "");
        formData.append('profile_picture', profile_picture || "");
        formData.append('cover_image', cover_image || "");

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_API_URL}/superadmin/create_user/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            console.log("response", response);
            message.success("User Added Successfully");
            setLoading(false)
            modalHideShow();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.log("error", error);
            const responseData = error.response.data;
            let errorMessage = '';

            // Iterate over the properties of the responseData object
            for (const prop in responseData) {
                if (responseData.hasOwnProperty(prop)) {
                    errorMessage = responseData[prop][0];
                    // Exit the loop after finding the first error message
                    break;
                }
            }

            message.error(errorMessage);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        modalHideShow();
        form.resetFields();
        setLoading(false);
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
    const handleAddSocialMediaLink = () => {
        if (additionalSocialMediaLinks.length < 2) {
            setAdditionalSocialMediaLinks([...additionalSocialMediaLinks, '']);
        }
    };

    const handleRemoveSocialMediaLink = (index) => {
        const updatedLinks = additionalSocialMediaLinks.filter((link, i) => i !== index);
        setAdditionalSocialMediaLinks(updatedLinks);
    };
    useEffect(() => {
        setCurrentCompany(CompaniesDate)
    }, [CompaniesDate])
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
                <Button
                    style={{ backgroundColor: "#F47122" }}
                    key="add"
                    type="primary"
                    onClick={() => {
                        form.validateFields().then(() => {
                            setLoading(true);
                            form.submit();
                        }).catch((error) => {
                            setLoading(false);

                        });
                    }}
                    loading={loading}
                >
                    Add
                </Button>


            ]}
        >
            <div className='custom-scrollbar' style={{ overflowX: 'auto', height: '450px' }}>
                <Form
                    form={form} // Binding form instance to the form component
                    layout="vertical"
                    onFinish={onFinish} // Callback function when form is submitted
                >
                    {/* Profile Picture Upload */}
                    <Form.Item label="Profile Picture" name="profile_picture">
                        <Upload
                            listType="picture-circle"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={(info) => {
                                const { file } = info;
                                form.setFieldsValue({ profile_picture: file });
                            }}
                        >
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Cover Picture" name="cover_image">
                        <Upload
                            listType="picture-circle"
                            maxCount={1}
                            beforeUpload={() => false} // Prevent default upload behavior
                            onChange={(info) => {
                                const { file } = info;
                                form.setFieldsValue({ cover_image: file }); // Set form field value to the uploaded file object
                            }}
                        >
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                        </Upload>
                    </Form.Item>


                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label="First Name*"
                            name="first_name"
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
                            name="last_name"
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
                            name="company_name"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: 'Please enter a company',
                        //     }
                        // ]}
                        >
                            <Input defaultValue={CompaniesDate} disabled />
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
                            name="postal_code"
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
                            name="facebook_url"
                            rules={[
                                {
                                    pattern: /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/,
                                    message: 'Invalid facebook URL',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<>Instagram <i className="fa fa-instagram  icon instagram-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                            name="instagram_url"
                            rules={[
                                {
                                    pattern: /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/,
                                    message: 'Invalid instagram URL',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label={<>Linkedin <i className="fa fa-linkedin icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i>
                        </>}
                        name="linkedin_url"
                        rules={[
                            {
                                pattern: /^(https?:\/\/)?(www\.)?linkedin.com\/[a-zA-Z0-9(\.\?)?]/,
                                message: 'Invalid linkedin URL',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {additionalSocialMediaLinks.map((link, index) => (
                        <>
                            <Form.Item label="Social Link type" name="other_link_media">
                                <Input placeholder="Twitter Tiktok" />
                            </Form.Item>
                            <Form.Item
                                key={index}
                                label={<>Additional Social link <i className="fa fa-globe icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                                name="other_link_1"
                                rules={[
                                    {
                                        type: 'url',
                                        message: 'Invalid URL format',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={`Enter you social media link`}
                                    suffix={
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveSocialMediaLink(index)}
                                        />
                                    }
                                />
                            </Form.Item>
                        </>
                    ))}

                    {
                        additionalSocialMediaLinks.length < 1 && (
                            <Form.Item>
                                <Button type="dashed" onClick={handleAddSocialMediaLink} icon={<PlusOutlined />}>
                                    Social Link
                                </Button>
                            </Form.Item>
                        )
                    }

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
                            label={`Additional Email`}
                            name={`email_${index + 1}`}
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
                        additionalEmails.length < 1 && (
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
                            name="phone_number"
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
                                placeholder="+33 1 23 45 67 89"
                                >
                            </InputMask>
                        </Form.Item>
                        <Form.Item
                            label="Phone Type"
                            name="phoneType"
                        >
                            <Radio.Group>
                                <Radio name='phone_number_professional' value="PROFESSIONAL">Professional</Radio>
                                <Radio name='phone_number_personal' value="PERSONAL">Personal</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {additionalPhones.map((phone, index) => (
                        <Form.Item
                            key={index}
                            label={`Another Phone`}
                            name={`phone_number_${index + 1}`}
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
                    ))}
                    {
                        additionalPhones.length < 1 && (
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
