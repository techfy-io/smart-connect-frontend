import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Upload, Radio, Image } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import './Dashboard.scss';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';

const UpdateUser = ({ openEditModal, UpdatemodalHideShow, user }) => {
    const [loading, setLoading] = useState(false);
    const [additionalSocialMediaLinks, setAdditionalSocialMediaLinks] = useState([]);
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [additionalPhones, setAdditionalPhones] = useState([]);

    useEffect(() => {
        form.setFieldsValue({
            profile_picture: user?.profile_picture,
            cover_image: user?.cover_image,
            firstname: user?.first_name,
            lastname: user?.last_name,
            email: user?.email,
            email_1: user?.email_1,
            email_2: user?.email_2,
            phone_number: user?.phone_number,
            company_name: user?.company_name,
            job_title: user?.job_title,
            zip_code: user?.zip_code,
            phone_number_type: user?.phone_number_type,
            phone_number_personal: user?.phone_number_personal,
            phone_number_1: user?.phone_number_1,
            postal_code: user?.postal_code,
            country: user?.country,
            city: user?.city,
            facebook_url: user?.facebook_url,
            instagram_url: user?.instagram_url,
            linkedin_url: user?.linkedin_url,
            other_link_media: user?.other_link_media,
            other_link_1: user?.other_link_1,
            biography: user?.bio_graphy,
        });
    }, [openEditModal, user]);

    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        const { firstname, lastname, email, email_1, email_2, phone_number_1, other_link_media, other_link_1, phone_number_type, phone_number, company_name, job_title, zip_code, postal_code, country, city, facebook_url, instagram_url, linkedin_url, profile_picture, cover_image, biography } = values;
        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('email', email);
        formData.append('phone_number', phone_number);
        formData.append('phone_number_1', phone_number_1);
        formData.append('phone_number_type', phone_number_type);
        formData.append('company_name', company_name);
        formData.append('job_title', job_title);
        formData.append('zip_code', zip_code);
        formData.append('postal_code', postal_code);
        formData.append('country', country);
        formData.append('city', city);
        formData.append('other_link_media', other_link_media);
        formData.append('other_link_1', other_link_1);
        // if (email_1) {
        //     formData.append('email_1', email_1);
        // }
        formData.append('facebook_url', facebook_url);
        formData.append('instagram_url', instagram_url);
        formData.append('linkedin_url', linkedin_url);
        formData.append('user', user.id);

        // Check if profile picture is provided and different from current user's profile picture
        if (profile_picture && profile_picture !== user.profile_picture) {
            formData.append('profile_picture', profile_picture);
        }

        // Check if cover image is provided and different from current user's cover image
        if (cover_image && cover_image !== user.cover_image) {
            formData.append('cover_image', cover_image);
        }

        formData.append('bio_graphy', biography || "");
        const accessToken = localStorage.getItem('accessToken');

        axios.patch(
            `${process.env.REACT_APP_BASE_API_URL}/usercontacts/${user.id}/`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
            .then(response => {
                console.log("response", response);
                message.success("User Update Successfully");
                setLoading(false)
                UpdatemodalHideShow();
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            })
            .catch(error => {
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
            });

    };
    const handleCancel = () => {
        UpdatemodalHideShow();
        form.resetFields();
    };

    const handleAddSocialMediaLink = () => {
        setAdditionalSocialMediaLinks([...additionalSocialMediaLinks, '']);
    };

    const handleRemoveSocialMediaLink = (index) => {
        const updatedLinks = additionalSocialMediaLinks.filter((link, i) => i !== index);
        setAdditionalSocialMediaLinks(updatedLinks);
    };

    const handleAddAdditionalEmail = () => {
        setAdditionalEmails([...additionalEmails, '']);
    };

    const handleRemoveAdditionalEmail = (index) => {
        const updatedEmails = additionalEmails.filter((email, i) => i !== index);
        setAdditionalEmails(updatedEmails);
    };
    const handleAddPhone = () => {
        if (additionalPhones.length < 2) {
            setAdditionalPhones([...additionalPhones, '']);
        }
    };
    const handleRemovePhone = (index) => {
        const updatedPhones = additionalPhones.filter((phone, i) => i !== index);
        setAdditionalPhones(updatedPhones);
    };
    return (
        <Modal
            width={450}
            title="UpdateUser"
            open={openEditModal}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="add" style={{ backgroundColor: "#F47122" }} type="primary" onClick={() => form.submit()} loading={loading}>
                    Update
                </Button>
            ]}
        >
            <div className='custom-scrollbar' style={{ overflowY: 'auto', height: '450px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item label="Profile Picture" name="profile_picture">
                        {user && user.profile_picture ? (
                            <Upload
                                listType="picture-circle"
                                maxCount={1}
                                beforeUpload={() => false}
                                showUploadList={true}
                                onChange={(info) => {
                                    const { file } = info;
                                    form.setFieldsValue({ profile_picture: file });
                                }}
                                defaultFileList={[{ uid: '-1', name: 'profile_picture', status: 'done', url: user.profile_picture }]}
                            >
                                <Button shape="default" icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                            </Upload>
                        ) : (
                            <Upload
                                listType="picture-circle"
                                maxCount={1}
                                beforeUpload={() => false}
                                showUploadList={true}
                                onChange={(info) => {
                                    const { file } = info;
                                    form.setFieldsValue({ profile_picture: file });
                                }}
                                defaultFileList={[]}
                            >
                                <Button shape="default" icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                            </Upload>
                        )}
                    </Form.Item>

                    <Form.Item label="Cover Picture" name="cover_image">
                        {user && user.cover_image ? (
                            <Upload
                                listType="picture-circle"
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={(info) => {
                                    const { file } = info;
                                    form.setFieldsValue({ cover_image: file });
                                }}
                                defaultFileList={[{ uid: '-1', name: 'cover_image', status: 'done', url: user.cover_image }]}
                            >
                                <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                            </Upload>
                        ) : (
                            <Upload
                                listType="picture-circle"
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={(info) => {
                                    const { file } = info;
                                    form.setFieldsValue({ cover_image: file });
                                }}
                                defaultFileList={[]}
                            >
                                <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                            </Upload>
                        )}
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
                    {user && user.other_link_1 ? (
                        <>
                            <Form.Item label="Social Link type" name="other_link_media">
                                <Input placeholder="Twitter Tiktok" />
                            </Form.Item>
                            <Form.Item
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
                                    placeholder={`Enter your social media link`}
                                />
                            </Form.Item>
                        </>
                    ) : null}
                    {additionalSocialMediaLinks.map((link, index) => (
                        <div key={index}>
                            <Form.Item label="Social Link type" name={`other_link_media`}>
                                <Input placeholder="Twitter Tiktok" />
                            </Form.Item>
                            <Form.Item
                                label={<>Additional Social link <i className="fa fa-globe icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                                name={`other_link_1`}
                                rules={[
                                    {
                                        type: 'url',
                                        message: 'Invalid URL format',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={`Enter your social media link`}
                                    suffix={
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveSocialMediaLink(index)}
                                        />
                                    }
                                />
                            </Form.Item>
                        </div>
                    ))}
                    {user && !user.other_link_1 && additionalSocialMediaLinks.length < 1 && (
                        <Form.Item>
                            <Button type="dashed" onClick={handleAddSocialMediaLink} icon={<PlusOutlined />}>
                                Add Another Social Link
                            </Button>
                        </Form.Item>
                    )}
                    {/* email input */}
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
                        <Input placeholder='Additional email' />
                    </Form.Item>
                    {/* {user && user.email_1 ? (
                        <>
                            <Form.Item
                                label="Additional Email"
                                name="email_1"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Invalid email format',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    ) : null}
                    {additionalEmails.map((email, index) => (
                        <div key={index}>
                            <Form.Item
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
                                    placeholder={`Additional email`}
                                    suffix={
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveAdditionalEmail(index)}
                                        />
                                    }
                                />
                            </Form.Item>
                        </div>
                    ))}
                    {user && !user.email_1 && additionalEmails.length < 1 && (
                        <Form.Item>
                            <Button type="dashed" onClick={handleAddAdditionalEmail} icon={<PlusOutlined />}>
                                Email
                            </Button>
                        </Form.Item>
                    )} */}

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
                                placeholder="+33 9 99 99 99 99"
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
                    {user && user.phone_number_1 ? (
                        <>
                            <Form.Item
                                label="Another Phone"
                                name="phone_number_1"
                                rules={[
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
                                    placeholder="+33 9 99 99 99 99"
                                />
                            </Form.Item>
                        </>
                    ) :
                        null}
                    {additionalPhones.map((phone, index) => (
                        <Form.Item
                            key={index}
                            label={`Another Phone`}
                            name={`phone_number_${index + 1}`}
                            rules={[
                                {
                                    pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                    message: 'Invalid phone number format',
                                },
                            ]}
                        >
                            <InputMask
                                style={{
                                    width: "97%",
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
                        user && !user.phone_number_1 && additionalPhones.length < 1 && (
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

export default UpdateUser;
