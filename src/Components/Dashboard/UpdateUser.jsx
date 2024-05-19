import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Upload, Radio, Image } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import './Dashboard.scss';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { useTranslation } from "react-i18next";

const UpdateUser = ({ openEditModal, UpdatemodalHideShow, user }) => {
    const { t, i18n } = useTranslation('translation');
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
    console.log("userdata", user)
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        const { firstname, lastname, email, email_1, phone_number_1, other_link_media, other_link_1, phone_number_type, phone_number, company_name, job_title, zip_code, postal_code, country, city, facebook_url, instagram_url, linkedin_url, profile_picture, cover_image, biography } = values;
        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('email', email);
        formData.append('phone_number', phone_number);
        formData.append('phone_number_1', phone_number_1 || "");
        formData.append('phone_number_type', phone_number_type || "");
        formData.append('company_name', company_name || "");
        formData.append('job_title', job_title || "");
        formData.append('zip_code', zip_code || "");
        formData.append('postal_code', postal_code || "");
        formData.append('country', country || "");
        formData.append('city', city || "");
        formData.append('other_link_media', other_link_media || "");
        formData.append('other_link_1', other_link_1 || "");
        formData.append('email_1', email_1 || "");
        formData.append('facebook_url', facebook_url || "");
        formData.append('instagram_url', instagram_url || "");
        formData.append('linkedin_url', linkedin_url || "");
        formData.append('user', user.id);

        if (profile_picture !== user.profile_picture) {
            formData.append('profile_picture', profile_picture);
            console.log("profile_picture", profile_picture)
        }
        if (cover_image !== user.cover_image) {
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
                message.success(t("User Update Successfully"));
                setLoading(false)
                UpdatemodalHideShow();
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            })
            .catch(error => {
                console.log("error", error);
                if (error.response) {
                    if (error.response.status === 404 || error.response.status === 500) {
                        message.error(t("Failed: Something went wrong with the server."));
                    } else {
                        const responseData = error.response.data;
                        let errorMessage = '';

                        for (const prop in responseData) {
                            if (responseData.hasOwnProperty(prop)) {
                                errorMessage = responseData[prop][0];
                                // Exit the loop after finding the first error message
                                break;
                            }
                        }

                        message.error(errorMessage);
                    }
                } else if (error.request) {
                    console.error("No response received from the server:", error.request);
                    message.error(t("Failed: No response received from the server."));
                } else {
                    console.error("Error setting up the request:", error.message);
                    message.error(t("Failed: Error setting up the request."));
                }
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
            title={t("Update User")}
            open={openEditModal}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    {t("Cancel")}
                </Button>,
                <Button key="add" style={{ backgroundColor: "#F47122" }} type="primary" onClick={() => form.submit()} loading={loading}>
                    {t("Update")}
                </Button>
            ]}
        >
            <div className='custom-scrollbar' style={{ overflowY: 'auto', height: '450px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    enctype="multipart/form-data"

                >
                    <Form.Item label={t("Profile Picture")} name="profile_picture">
                        <Upload
                            listType="picture-circle"
                            maxCount={1}
                            beforeUpload={() => false}
                            showUploadList={true}
                            onChange={(info) => {
                                const { file } = info;
                                if (file?.status == "removed") {
                                    form.setFieldsValue({ profile_picture: new File([], "") });

                                }
                                else{
                                    form.setFieldsValue({ profile_picture: file });

                                }
                            }}
                            // onRemove={(e)=>{
                            //     console.log("remoce imge "  , e)
                            //     form.setFieldsValue({ profile_picture: new File([], '') });
                            //     // formData.append('image', new File([], ''));
                            // }}
                            defaultFileList={user?.profile_picture ? [{
                                uid: '-1', name: 'profile_picture', status: 'done', url: user?.profile_picture
                            }] : null}
                        >
                            <Button shape="default" icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                        </Upload>
                    </Form.Item>


                    <Form.Item label={t("Cover Picture")} name="cover_image">
                        <Upload
                            listType="picture-circle"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={(info) => {
                                const { file } = info;
                                if (file?.status == "removed") {
                                    form.setFieldsValue({ cover_image: new File([], "") });

                                }
                                else{
                                    form.setFieldsValue({ cover_image: file });

                                }
                            }}
                            defaultFileList={user && user.cover_image ? [{ uid: '-1', name: 'cover_image', status: 'done', url: user.cover_image }] : []}
                        >
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                        </Upload>
                    </Form.Item>



                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={`${t("First Name")}*`}
                            name="firstname"
                            rules={[
                                {
                                    required: true,
                                    message: (t('first name is required')),
                                },
                            ]}
                        >
                            <Input  maxLength={30}/>
                        </Form.Item>
                        <Form.Item
                            style={{ width: "200px" }}
                            label={`${t("Last Name")}*`}
                            name="lastname"
                            rules={[
                                {
                                    required: true,
                                    message: (t('last name is required')),
                                },
                            ]}
                        >
                            <Input  maxLength={30}/>
                        </Form.Item>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={t("Company Name")}
                            name="company_name"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label={t("Job title")}
                            name="job_title"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={t("Zip Code")}
                            name="zip_code"
                        >
                            <Input maxLength={5} />
                        </Form.Item>
                        <Form.Item
                            label={t("Postal Address")}
                            name="postal_code"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={t("Country")}
                            name="country"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t("City")}
                            name="city"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={<>{t("Facebook")} < i className="fa fa-facebook   icon facebook-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i> </>}
                            name="facebook_url"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<>{t("Instagram")} <i className="fa fa-instagram  icon instagram-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                            name="instagram_url"
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label={<>{t("Linkedin")} <i className="fa fa-linkedin icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
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
                                label={<>{t("Social link")} <i className="fa fa-globe icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                                name="other_link_1"
                                rules={[
                                    {
                                        type: 'url',
                                        message: (t('Invalid URL format')),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t("Enter your social media link")}
                                />
                            </Form.Item>
                        </>
                    ) : null}
                    {additionalSocialMediaLinks.map((link, index) => (
                        <div key={index}>
                            <Form.Item label={t("Social Link type")} name="other_link_media">
                                <Input placeholder="Twitter Tiktok" />
                            </Form.Item>
                            <Form.Item
                                label={<>{t("Social Link")} <i className="fa fa-globe icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                                name="other_link_1"
                                rules={[
                                    {
                                        type: 'url',
                                        message: (t('Invalid URL format')),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t(`Enter your social media link`)}
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
                                {t("Add Another Social Link")}
                            </Button>
                        </Form.Item>
                    )}
                    {/* email input */}
                    <Form.Item
                        label={t("Email")}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: (t('Please enter an email')),
                            },
                            {
                                type: 'email',
                                message: (t("Please input a valid email!")),
                            },
                        ]}
                    >
                        <Input placeholder={t('Additional email')} />
                    </Form.Item>
                    {user && user.email_1 ? (
                        <>
                            <Form.Item
                                label={t("Additional Email")}
                                name="email_1"
                                rules={[
                                    {
                                        type: 'email',
                                        message: (t("Please input a valid email!")),
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
                                label={t(`Additional Email`)}
                                name="email_1"
                                rules={[
                                    {
                                        type: 'email',
                                        message: (t("Please input a valid email!")),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t(`Additional email`)}
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
                                {t("Email")}
                            </Button>
                        </Form.Item>
                    )}

                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
                    <Form.Item
                        label={`${t("Phone")}*`}
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
                            style={{ width: "97%", height: "30px", borderRadius: "5px", border: "1px solid #d9d9d9", paddingLeft: "8px", color: "black", transition: "border-color 0.3s", }}
                            mask="+33 9 99 99 99 99"
                            maskChar=""
                            placeholder="+33 1 23 45 67 89"
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("Phone Type")}
                        name="phone_number_type"
                    >
                        <Radio.Group>
                            <Radio name='phone_number_professional' value="PROFESSIONNEL">{t("Professionnel")}</Radio>
                            <Radio name='phone_number_personal' value="PERSONAL">{t("Personal")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* </div> */}
                    {user && user.phone_number_1 ? (
                        <>
                            <Form.Item
                                label={t("Another Phone")}
                                name="phone_number_1"
                                rules={[
                                    {
                                        pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                        message: (t('Invalid phone number format')),
                                    },
                                ]}
                            >
                                <InputMask
                                    style={{ width: "97%", height: "30px", borderRadius: "5px", border: "1px solid #d9d9d9", paddingLeft: "8px", color: "black", transition: "border-color 0.3s", }}
                                    mask="+33 9 99 99 99 99"
                                    maskChar=""
                                    placeholder="+33 1 23 45 67 89"
                                />
                            </Form.Item>
                        </>
                    ) :
                        null}
                    {additionalPhones.map((phone, index) => (
                        <Form.Item
                            key={index}
                            label={t(`Another Phone`)}
                            name={`phone_number_${index + 1}`}
                            rules={[
                                {
                                    pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                    message: (t('Invalid phone number format')),
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
                                        {t("Phone")}
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }
                    <Form.Item
                        label={t("Biography")}
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
