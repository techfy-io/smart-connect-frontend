import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Upload, Radio, Image } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import './Dashboard.scss';
import { UploadOutlined } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';

const UpdateUser = ({ openEditModal, UpdatemodalHideShow, user }) => {
    useEffect(() => {
        form.setFieldsValue({
            profile_picture: user?.profile_picture,
            cover_image: user?.cover_image,
            firstname: user?.first_name,
            lastname: user?.last_name,
            email: user?.email,
            phone_number: user?.phone_number,
            company_name: user?.company_name,
            job_title: user?.job_title,
            zip_code: user?.zip_code,
            phone_number_type: user?.phone_number_type,
            phone_number_personal: user?.phone_number_personal,
            postal_code: user?.postal_code,
            country: user?.country,
            city: user?.city,
            facebook_url: user?.facebook_url,
            instagram_url: user?.instagram_url,
            linkedin_url: user?.linkedin_url,
            biography: user?.bio_graphy,
        });
    }, [openEditModal, user]);

    const [form] = Form.useForm();

    const onFinish = (values) => {
        const { firstname, lastname, email, phone_number_type, phone_number, company_name, job_title, zip_code, postal_code, country, city, facebook_url, instagram_url, linkedin_url, profile_picture, cover_image, biography } = values;
        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('email', email);
        formData.append('phone_number', phone_number);
        formData.append('phone_number_type', phone_number_type);
        formData.append('company_name', company_name);
        formData.append('job_title', job_title);
        formData.append('zip_code', zip_code);
        formData.append('postal_code', postal_code);
        formData.append('country', country);
        formData.append('city', city);
        formData.append('facebook_url', facebook_url);
        formData.append('instagram_url', instagram_url);
        formData.append('linkedin_url', linkedin_url);
        formData.append('user', user.id);
        if (profile_picture) formData.append('profile_picture', profile_picture || "");
        if (cover_image) formData.append('cover_image', cover_image || "");
        formData.append('bio_graphy', biography || "");
        const accessToken = localStorage.getItem('accessToken');

        axios.patch(
            `${process.env.REACT_APP_BASE_API_URL}/usercontacts/${user.id}/`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data' // Set appropriate content type for file upload
                }
            }
        )
            .then(response => {
                console.log("response", response);
                message.success("User Update Successfully");
                UpdatemodalHideShow();
                setTimeout(() => {
                    // window.location.reload();
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
            width={450}
            // style={{ marginTop: "50px" }}
            title="UpdateUser"
            open={openEditModal}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="add" type="primary" onClick={() => form.submit()}>
                    Update
                </Button>,
            ]}
        >
            <div className='custom-scrollbar' style={{ overflowY: 'auto', height: '450px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item label="Profile Picture" name="profile_picture">
                        <Upload
                            maxCount={1}
                            beforeUpload={() => false}
                            showUploadList={false} // Hide the default list of uploaded files
                            onChange={(info) => {
                                const { file } = info;
                                form.setFieldsValue({ profile_picture: file });
                            }}
                            defaultFileList={user && user.profile_picture ? [{ uid: '-1', name: 'profile_picture', status: 'done' }] : []}
                        >
                            {user && user.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile Picture" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                            ) : (
                                <>
                                </>
                            )}
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}>Upload</Button>

                        </Upload>
                    </Form.Item>
                    <Form.Item label="Cover Picture" name="cover_image">
                        {user && user.cover_image ? (
                            // If cover image exists, display the image
                            <img src={user.cover_image} alt="Cover Picture" style={{ width: '100px', height: '100px' }} />
                        ) : (
                            <>
                            </>
                        )}
                        <Upload
                            maxCount={1}
                            beforeUpload={() => false} // Prevent default upload behavior
                            onChange={(info) => {
                                const { file } = info;
                                form.setFieldsValue({ cover_image: file });
                            }}
                        >
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

                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}

                    {/* </div> */}

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label="Company Name"
                            name="company_name"
                        >
                            <Input disabled />
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
                            label="Postal Code"
                            name="postal_code"
                        >
                            <Input maxLength={20} />
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
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<>Instagram <i className="fa fa-instagram  icon instagram-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                            name="instagram_url"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label={<>Linkedin <i className="fa fa-linkedin icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                        name="linkedin_url"
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
                                style={{ width: "97%", height: "30px", borderRadius: "5px", border: "1px solid #d9d9d9", paddingLeft: "8px", color: "black", transition: "border-color 0.3s", }}
                                mask="+33 9 99 99 99 99"
                                maskChar=""
                                placeholder="+33 6 79 95 91 92"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Phone Type"
                            name="phone_number_type"
                        >
                            <Radio.Group >
                                <Radio name='phone_number_professional' value="PROFESSIONAL">Professional</Radio>
                                <Radio name='phone_number_personal' value="PERSONAL">Personal</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
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

export default UpdateUser;
