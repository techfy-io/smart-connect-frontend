import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Upload, Radio, Spin, Select } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";
import { UploadOutlined, PlusOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import './Dashboard.scss';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS
import { useEffect } from 'react';
import FormItem from 'antd/es/form/FormItem';
import { useTranslation } from "react-i18next";

const AddUser = ({ isModalVisible, modalHideShow, CompaniesData }) => {
    const { t, i18n } = useTranslation('translation')
    const [form] = Form.useForm();
    const [additionalPhones, setAdditionalPhones] = useState([]);
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);

    const [currentCompany, setCurrentCompany] = useState('')
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const {
            first_name, last_name, email, email_1, phone_number, phone_number_1, phone_number_2,
            phone_number_personal, phone_number_professional, job_title, biography, postal_code, zip_code,
            country, city, facebook_url, instagram_url, linkedin_url, company, profile_picture, cover_image, user_id,
            other_link_media_1, other_link_media_2, other_link_media_3, other_link_media_4, other_link_media_5,
            other_link_1, other_link_2, other_link_3, other_link_4, other_link_5,
        } = values;
        const accessToken = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('first_name', first_name || "");
        formData.append('last_name', last_name || "");
        formData.append('email', email || "");
        if (email_1) { formData.append('email_1', email_1 || ""); }
        formData.append('phone_number', phone_number || "");
        if (phone_number_1) {
            formData.append('phone_number_1', phone_number_1 || "");
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
        formData.append('facebook_url', facebook_url || "");
        formData.append('instagram_url', instagram_url || "");
        formData.append('linkedin_url', linkedin_url || "");
        formData.append('other_link_media_1', other_link_media_1 || "");
        formData.append('other_link_media_2', other_link_media_2 || "");
        formData.append('other_link_media_3', other_link_media_3 || "");
        formData.append('other_link_media_4', other_link_media_4 || "");
        formData.append('other_link_media_5', other_link_media_5 || "");
        socialLinks.forEach((link, index) => {
            formData.append(`other_link_${index + 1}`, link || "");
        });
        formData.append('company', currentCompany?.id || "");
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
            message.success(t("User Added Successfully"));
            setLoading(false)
            modalHideShow();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
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
            setLoading(false)
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
    const handleAddLink = () => {
        if (socialLinks.length < 5) {
            setSocialLinks([...socialLinks, '']);
        }
    };

    const handleRemoveLink = (index) => {
        const newLinks = socialLinks.filter((_, i) => i !== index);
        setSocialLinks(newLinks);
    };

    useEffect(() => {
        setCurrentCompany(CompaniesData)
    }, [CompaniesData])
    return (
        <Modal
            title={t("Add User")}
            width={450}
            open={isModalVisible}

            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    {t("Cancel")}
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
                    {t("Add")}
                </Button>


            ]}
        >
            <div className='custom-scrollbar' style={{ overflowX: 'auto', height: '450px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete='off'
                >
                    <Form.Item label={t("Profile Picture")} name="profile_picture">
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
                    <Form.Item label={t("Cover Picture")} name="cover_image">
                        <Upload
                            listType="picture-circle"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={(info) => {
                                const { file } = info;
                                form.setFieldsValue({ cover_image: file });
                            }}
                        >
                            <Button icon={<UploadOutlined style={{ fontSize: "20px", color: "#40a9ff" }} />}></Button>
                        </Upload>
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={`${t("First Name")}*`}
                            name="first_name"
                            rules={[
                                {
                                    required: true,
                                    message: (t('first name is required')),
                                },
                            ]}
                        >
                            <Input maxLength={30} />
                        </Form.Item>
                        <Form.Item
                            label={`${t("Last Name")}*`}
                            name="last_name"
                            rules={[
                                {
                                    required: true,
                                    message: (t('last name is required')),
                                },
                            ]}
                        >
                            <Input maxLength={30} />
                        </Form.Item>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Item
                            label={`${t("Company")}*`}
                            name="company"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: 'Please enter a company',
                        //     }
                        // ]}
                        >
                            <Input defaultValue={currentCompany?.name} disabled />
                        </Form.Item>
                        <Form.Item
                            label={t("Job title")}
                            name="job_title"
                        >
                            <Input maxLength={100} />
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
                            rules={[
                                {
                                    pattern: /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/,
                                    message: (t("Invalid URL format")),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<>{t("Instagram")} <i className="fa fa-instagram  icon instagram-icon " style={{ fontSize: "24px", marginLeft: "5px" }}></i></>}
                            name="instagram_url"
                            rules={[
                                {
                                    pattern: /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/,
                                    message: (t("Invalid URL format")),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label={<>{t("Linkedin")} <i className="fa fa-linkedin icon linkedin-icon" style={{ fontSize: "24px", marginLeft: "5px" }}></i>
                        </>}
                        name="linkedin_url"
                        rules={[
                            {
                                pattern: /^(https?:\/\/)?(www\.)?linkedin.com\/[a-zA-Z0-9(\.\?)?]/,
                                message: (t("Invalid URL format")),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {socialLinks.map((_, index) => (
                        <>
                            <Form.Item
                                label={`${t("Site internet type")} ${index + 1}`}
                                name={`other_link_media_${index + 1}`}
                            >
                                <Input placeholder={`Siteweb ${index + 1}`} />
                            </Form.Item>
                            <Form.Item key={index}
                                label={
                                    <>
                                        {`${t("Additional Site internet")} ${index + 1}`}
                                        <i
                                            className="fa fa-globe icon linkedin-icon"
                                            style={{ fontSize: "24px", marginLeft: "5px" }}
                                        ></i>
                                    </>
                                }
                                name={`other_link_${index + 1}`}
                                rules={[
                                    {
                                        type: 'url',
                                        message: t("Invalid URL format"),
                                    },
                                ]}
                            >
                                <div style={{ display: "flex" }}>
                                    <Input
                                        placeholder={t("Enter your site internet url")}
                                        style={{ width: '90%' }}
                                        value={socialLinks[index]}
                                        onChange={(e) => {
                                            const newLinks = [...socialLinks];
                                            newLinks[index] = e.target.value;
                                            setSocialLinks(newLinks);
                                        }}

                                    />
                                    <Button
                                        style={{ marginLeft: "6px" }}
                                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                                        onClick={() => handleRemoveLink(index)}
                                    />
                                </div>


                            </Form.Item>
                        </>

                    ))}

                    {socialLinks.length < 5 && (
                        <Form.Item>
                            <Button type="dashed" onClick={handleAddLink} icon={<PlusOutlined />}>
                                {t("Add Site internet")}
                            </Button>
                        </Form.Item>
                    )}

                    <Form.Item
                        label={`${t("Email")}*`}
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
                        <Input placeholder="" />
                    </Form.Item>
                    {additionalEmails.map((email, index) => (
                        <Form.Item
                            key={index}
                            label={t("Additional Email")}
                            name={`email_${index + 1}`}
                            rules={[
                                {
                                    type: 'email',
                                    message: (t("Please input a valid email!")),
                                },
                            ]}
                        >
                            <div style={{ display: "flex" }}>
                                <Input
                                    style={{ width: '90%' }}
                                    placeholder=""
                                />
                                <Button
                                    style={{ marginLeft: "6px" }}
                                    icon={<DeleteOutlined style={{ color: 'red' }} />}
                                    type="text"
                                    onClick={() => handleRemoveEmail(index)}
                                />
                            </div>

                        </Form.Item>
                    ))}
                    {
                        additionalEmails.length < 1 && (
                            <>
                                <Form.Item>
                                    <Button type="dashed" onClick={handleAddEmail} icon={<PlusOutlined />}>
                                        {t("Email")}
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }

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
                                message: (t('Invalid phone number format'))
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
                        label={t("Phone Type")}
                        name="phoneType"
                    >
                        <Radio.Group>
                            <Radio name='phone_number_professional' value="Professionnel">{t("Professionnel")}</Radio>
                            <Radio name='phone_number_personal' value="Personal">{t("Personal")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* </div> */}
                    {additionalPhones.map((phone, index) => (
                        <Form.Item
                            key={index}
                            label={t(`Another Phone`)}
                            name={`phone_number_${index + 1}`}
                        >
                            <div style={{ display: "flex" }}>
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
                                <Button
                                    style={{ marginLeft: "6px" }}
                                    icon={<DeleteOutlined style={{ color: 'red' }} />}
                                    type="text"
                                    onClick={() => handleRemovePhone(index)}
                                />
                                
                            </div>

                        </Form.Item>
                    ))}
                    {
                        additionalPhones.length < 1 && (
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

export default AddUser;
