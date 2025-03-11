import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Upload,
  Radio,
  Image,
} from "antd";
import axios from "axios";
import InputMask from "react-input-mask";
import "./Dashboard.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import fb1Img from "../Dashboard/Facebook-Icons/facebook1.png";
import fb2Img from "../Dashboard/Facebook-Icons/facebook2.png";
import fb3Img from "../Dashboard/Facebook-Icons/facebook3.png";
import insta1 from "../Dashboard/Instagram-Icons/instagram1.png";
import insta2 from "../Dashboard/Instagram-Icons/instagram2.png";
import insta3 from "../Dashboard/Instagram-Icons/instagram3.png";
import linkedIn3 from "../Dashboard/LinkedIn-Icons/linkedin1.png";
import linkedIn1 from "../Dashboard/LinkedIn-Icons/linkedin2.png";
import linkedIn2 from "../Dashboard/LinkedIn-Icons/linkedin3.png";
import web1 from "../Dashboard/Website-Icons/globe1.png";
import web2 from "../Dashboard/Website-Icons/globe2.png";
import web3 from "../Dashboard/Website-Icons/globe3.png";
import SocialMediaIconSelector from "./SocialMediaIconSelector";
import Quill from "quill";
import $ from "jquery";
window.jQuery = $;
window.$ = $;
require("jquery-ui-sortable");
require("formBuilder");

const UpdateUser = ({
  openEditModal,
  UpdatemodalHideShow,
  getCompanyUser,
  user,
  Companyid,
}) => {
  const { t, i18n } = useTranslation("translation");
  const [loading, setLoading] = useState(false);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [additionalPhones, setAdditionalPhones] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  const formBuilderRef = useRef(null);

  const [selectedFacebookIcon, setSelectedFacebookIcon] = useState(
    user?.facebook_icon
  ); // Initialize selectedIcon state
  const [selectedInstagramIcon, setSelectedInstagramIcon] = useState(
    user?.instagram_icon
  ); // Initialize selectedIcon state
  const [selectedLinkedInIcon, setSelectedLinkedInIcon] = useState(
    user?.linkedin_icon
  ); // Initialize selectedIcon state
  const [selectedWebsiteIcon, setSelectedWebsiteIcon] = useState(
    user?.website_icon
  ); // Initialize selectedIcon state

  const facebookIcons = [fb1Img, fb2Img, fb3Img]; // Replace with your actual icon URLs
  const instagramIcons = [insta1, insta2, insta3]; // Replace with your actual icon URLs
  const linkedInIcons = [linkedIn1, linkedIn2, linkedIn3];
  const websiteIcons = [web1, web2, web3];

  const [saveButtonColor, setSaveButtonColor] = useState("#F47122");
  const [exchangeButtonColor, setExchangeButtonColor] = useState("#616569");
  const [backgroundColor, setBackgroundColor] = useState(
    "rgba(243, 243, 243, 0.8)"
  );
  const handleSaveButtonColorChange = (e) => {
    setSaveButtonColor(e.target.value);
  };

  const handleExchangeButtonColorChange = (e) => {
    setExchangeButtonColor(e.target.value);
  };
  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const Font = Quill.import("formats/font");
  Font.whitelist = ["sans-serif", "serif", "monospace", "times-new-roman"];
  Quill.register(Font, true);

  const QuillInput = forwardRef((props, ref) => {
    const { value, onChange, returnPlainText = false, ...rest } = props;

    const handleChange = (content, delta, source, editor) => {
      if (returnPlainText) {
        onChange(editor.getText());
      } else {
        onChange(content);
      }
    };

    return (
      <div className="custom-quill-container">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={{
            toolbar: [
              [
                {
                  font: ["sans-serif", "serif", "monospace", "times-new-roman"],
                },
              ],

              ["underline"],
            ],
          }}
          formats={["font", "underline"]}
          className="custom-quill-editor"
          {...rest}
        />
      </div>
    );
  });

  useEffect(() => {
    form.setFieldsValue({
      profile_picture: user?.profile_picture,
      cover_image: user?.cover_image,
      firstname: user?.first_name,
      lastname: user?.last_name,
      email: user?.email,
      email_1: user?.email_1,
      phone_number: user?.phone_number,
      company: user?.sub_company?.trim()
        ? user.sub_company
        : user?.company || user?.companies?.[0]?.company_name,
      subcompany: user?.sub_company?.trim()
        ? user.sub_company
        : user?.company || user?.companies?.[0]?.company_name,
      job_title: user?.job_title,
      zip_code: user?.zip_code,
      phone_number_type: user?.phone_number_type,
      phone_number_personal: user?.phone_number_personal,
      phone_number_1: user?.phone_number_1,
      postal_code: user?.postal_code,
      country: user?.country,
      city: user?.city,
      facebook_url: user?.facebook_url,
      facebook_icon: user?.facebook_icon,
      instagram_url: user?.instagram_url,
      instagram_icon: user?.instagram_icon,
      linkedin_url: user?.linkedin_url,
      linkedin_icon: user?.linkedin_icon,
      biography: user?.bio_graphy,
      other_link_media_1: user?.other_link_media_1,
      other_link_media_2: user?.other_link_media_2,
      other_link_media_3: user?.other_link_media_3,
      other_link_media_4: user?.other_link_media_4,
      other_link_media_5: user?.other_link_media_5,
      website_icon: user?.website_icon,
      save_button_value: user?.save_button_value,
      exchange_button_value: user?.exchange_button_value,
      background_button_value: user?.background_button_value,
    });

    setSelectedFacebookIcon(user?.facebook_icon || "");
    setSelectedInstagramIcon(user?.instagram_icon || "");
    setSelectedLinkedInIcon(user?.linkedin_icon || "");
    setSelectedWebsiteIcon(user?.website_icon || "");

    setSaveButtonColor(user?.save_button_value || "");
    setExchangeButtonColor(user?.exchange_button_value || "");
    setBackgroundColor(user?.background_button_value || "");

    const initialLinks = [
      user?.other_link_1 || "",
      user?.other_link_2 || "",
      user?.other_link_3 || "",
      user?.other_link_4 || "",
      user?.other_link_5 || "",
    ].filter((link) => link !== "" || null);

    setSocialLinks(initialLinks);
    form.setFieldsValue({
      ...initialLinks.reduce((acc, link, index) => {
        acc[`other_link_${index + 1}`] = link;
        return acc;
      }, {}),
      ...user,
    });
  }, [openEditModal, user]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (openEditModal && user) {
      if (formBuilderRef.current) {
        setTimeout(() => {
          if (user.form_builder_data) {
            const formData = JSON.parse(user.form_builder_data);
            formBuilderRef.current.actions.setData(formData);
          }
        }, 500);
      } else {
        const options = {
          disableFields: [
            "autocomplete",
            "button",
            "paragraph",
            "date",
            "header",
            "hidden",
            "number",
            "radio-group",
            "textarea",
            "select",
            "file",
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
          controlOrder: ["text", "checkbox-group"],
          showActionButtons: false,
        };
        formBuilderRef.current = $("#fb-editor").formBuilder(options);
        setTimeout(() => {
          if (user.form_builder_data) {
            const formData = JSON.parse(user.form_builder_data);
            formBuilderRef.current.actions.setData(formData);
          }
        }, 500);
      }
    }
  }, [openEditModal, user]);

  const onFinish = (values) => {
    setLoading(true);
    const {
      firstname,
      lastname,
      email,
      email_1,
      phone_number_1,
      phone_number_type,
      phone_number,
      company,
      subcompany,
      job_title,
      zip_code,
      postal_code,
      country,
      city,
      facebook_url,
      instagram_url,
      linkedin_url,
      profile_picture,
      cover_image,
      biography,
      other_link_media_1,
      other_link_media_2,
      other_link_media_3,
      other_link_media_4,
      other_link_media_5,
      other_link_1,
      other_link_2,
      other_link_3,
      other_link_4,
      other_link_5,
    } = values;
    const formData = new FormData();
    formData.append("first_name", firstname);
    formData.append("last_name", lastname);
    formData.append("email", email);
    formData.append("phone_number", phone_number);
    formData.append("phone_number_1", phone_number_1 || "");
    formData.append("phone_number_type", phone_number_type || "");
    formData.append("company", Companyid || "");
    formData.append("sub_company", subcompany || "");
    formData.append("job_title", job_title || "");
    formData.append("zip_code", zip_code || "");
    formData.append("postal_code", postal_code || "");
    formData.append("country", country || "");
    formData.append("city", city || "");
    formData.append(
      "facebook_icon",
      selectedFacebookIcon || user.facebook_icon
    );
    formData.append(
      "instagram_icon",
      selectedInstagramIcon || user.instagram_icon
    );
    formData.append(
      "linkedin_icon",
      selectedLinkedInIcon || user.linkedin_icon
    );
    formData.append("website_icon", selectedWebsiteIcon || user.website_icon);
    formData.append(
      "save_button_value",
      saveButtonColor || user.save_button_value
    );
    formData.append(
      "exchange_button_value",
      exchangeButtonColor || user.exchange_button_value
    );
    formData.append(
      "background_button_value",
      backgroundColor || user.exchange_button_value
    );
    formData.append("other_link_media_1", other_link_media_1 || "");
    formData.append("other_link_media_2", other_link_media_2 || "");
    formData.append("other_link_media_3", other_link_media_3 || "");
    formData.append("other_link_media_4", other_link_media_4 || "");
    formData.append("other_link_media_5", other_link_media_5 || "");
    socialLinks.forEach((link, index) => {
      formData.append(`other_link_${index + 1}`, link || "");
    });
    formData.append("email_1", email_1 || "");
    formData.append("facebook_url", facebook_url || "");
    formData.append("instagram_url", instagram_url || "");
    formData.append("linkedin_url", linkedin_url || "");
    formData.append("user", user.id);

    if (formBuilderRef.current) {
      const formBuilderData = formBuilderRef.current.actions.getData("json");
      formData.append("form_builder_data", formBuilderData);
    }

    if (profile_picture !== user.profile_picture) {
      formData.append("profile_picture", profile_picture);
      console.log("profile_picture", profile_picture);
    }
    if (cover_image !== user.cover_image) {
      formData.append("cover_image", cover_image);
    }

    formData.append("bio_graphy", biography || "");
    const accessToken = localStorage.getItem("accessToken");
    axios
      .patch(
        `${process.env.REACT_APP_BASE_API_URL}/usercontacts/${user.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        message.success(t("User Update Successfully"));
        setLoading(false);
        UpdatemodalHideShow();
        getCompanyUser();
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response) {
          if (error.response.status === 404 || error.response.status === 500) {
            message.error(t("Failed: Something went wrong with the server."));
          } else {
            const responseData = error.response.data;
            let errorMessage = "";

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
        setLoading(false);
      });
  };
  const handleCancel = () => {
    UpdatemodalHideShow();
    form.resetFields();
  };

  const handleAddLink = () => {
    if (socialLinks.length < 5) {
      setSocialLinks([...socialLinks, ""]);
    }
  };

  const handleRemoveLink = (index) => {
    form.setFieldsValue({
      [`other_link_${index}`]: "",
    });
    const newLinks = [...socialLinks];
    newLinks[index] = "";
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleAddAdditionalEmail = () => {
    setAdditionalEmails([...additionalEmails, ""]);
  };
  const handleRemoveAdditionalEmail = (index) => {
    const updatedEmails = additionalEmails.filter((email, i) => i !== index);
    setAdditionalEmails(updatedEmails);
  };
  const handleAddPhone = () => {
    if (additionalPhones.length < 2) {
      setAdditionalPhones([...additionalPhones, ""]);
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
        <Button
          key="add"
          style={{ backgroundColor: "#F47122" }}
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
        >
          {t("Update")}
        </Button>,
      ]}
    >
      <div
        className="custom-scrollbar"
        style={{ overflowY: "auto", height: "450px" }}
      >
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
                } else {
                  form.setFieldsValue({ profile_picture: file });
                }
              }}
              // onRemove={(e)=>{
              //     console.log("remoce imge "  , e)
              //     form.setFieldsValue({ profile_picture: new File([], '') });
              //     // formData.append('image', new File([], ''));
              // }}
              defaultFileList={
                user?.profile_picture
                  ? [
                      {
                        uid: "-1",
                        name: "profile_picture",
                        status: "done",
                        url: user?.profile_picture,
                      },
                    ]
                  : null
              }
            >
              <Button
                shape="default"
                icon={
                  <UploadOutlined
                    style={{ fontSize: "20px", color: "#40a9ff" }}
                  />
                }
              ></Button>
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
                } else {
                  form.setFieldsValue({ cover_image: file });
                }
              }}
              defaultFileList={
                user && user.cover_image
                  ? [
                      {
                        uid: "-1",
                        name: "cover_image",
                        status: "done",
                        url: user.cover_image,
                      },
                    ]
                  : []
              }
            >
              <Button
                icon={
                  <UploadOutlined
                    style={{ fontSize: "20px", color: "#40a9ff" }}
                  />
                }
              ></Button>
            </Upload>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label={`${t("First Name")}*`}
              name="firstname"
              rules={[
                {
                  required: true,
                  message: t("first name is required"),
                },
              ]}
            >
              <QuillInput />
            </Form.Item>
            <Form.Item
              style={{ width: "200px" }}
              label={`${t("Last Name")}*`}
              name="lastname"
              rules={[
                {
                  required: true,
                  message: t("last name is required"),
                },
              ]}
            >
              <QuillInput />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {user?.sub_company?.trim() ? (
              <Form.Item label={t("Company Name")} name="subcompany">
                <Input defaultValue={user.sub_company} />
              </Form.Item>
            ) : (
              <Form.Item label={t("Company Name")} name="company">
                <Input
                  defaultValue={
                    user?.company || user?.companies?.[0]?.company_name
                  }
                />
              </Form.Item>
            )}
            <Form.Item label={t("Job title")} name="job_title">
              <Input maxLength={100} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item label={t("Zip Code")} name="zip_code">
              <Input maxLength={5} />
            </Form.Item>
            <Form.Item label={t("Postal Address")} name="postal_code">
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item label={t("Country")} name="country">
              <Input />
            </Form.Item>
            <Form.Item label={t("City")} name="city">
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{t("Facebook")}</span>
                  <SocialMediaIconSelector
                    icons={facebookIcons}
                    selectedIcon={selectedFacebookIcon}
                    onIconSelect={setSelectedFacebookIcon}
                  />
                </div>
              }
              name="facebook_url"
              rules={[
                {
                  pattern:
                    /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/,
                  message: t("Invalid URL format"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{t("Instagram")}</span>
                  <SocialMediaIconSelector
                    icons={instagramIcons}
                    selectedIcon={selectedInstagramIcon}
                    onIconSelect={setSelectedInstagramIcon}
                  />
                </div>
              }
              name="instagram_url"
              rules={[
                {
                  pattern:
                    /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/,
                  message: t("Invalid URL format"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>{t("LinkedIn")}</span>
                <SocialMediaIconSelector
                  icons={linkedInIcons}
                  selectedIcon={selectedLinkedInIcon}
                  onIconSelect={setSelectedLinkedInIcon}
                />
              </div>
            }
            name="linkedin_url"
            rules={[
              {
                pattern:
                  /^(https?:\/\/)?(www\.)?linkedin.com\/[a-zA-Z0-9(\.\?)?]/,
                message: t("Invalid URL format"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          {socialLinks.map((_, index) => (
            // <div key={`social_link_${index}`}>
            <>
              <Form.Item
                label={`${t("Site internet type")} ${index + 1}`}
                name={`other_link_media_${index + 1}`}
              >
                <Input placeholder={`Siteweb ${index + 1}`} />
              </Form.Item>
              <Form.Item
                key={index}
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {t("Additional Site Internet")} {index + 1}
                    </span>
                    <SocialMediaIconSelector
                      icons={websiteIcons}
                      selectedIcon={selectedWebsiteIcon}
                      onIconSelect={setSelectedWebsiteIcon}
                      style={{ marginLeft: "10px" }} // Add margin to separate the icon from the text
                    />
                  </div>
                }
                name={`other_link_${index + 1}`}
                rules={[{ type: "url", message: t("Invalid URL format") }]}
              >
                <div style={{ display: "flex" }}>
                  <Input
                    placeholder={t("Enter your site internet url")}
                    value={socialLinks[index]}
                    style={{ width: "90%" }}
                    onChange={(e) => {
                      const updatedLinks = [...socialLinks];
                      updatedLinks[index] = e.target.value;
                      setSocialLinks(updatedLinks);
                      form.setFieldsValue({
                        [`other_link_${index + 1}`]: e.target.value,
                      });
                    }}
                  />
                  <Button
                    style={{ marginLeft: "6px" }}
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                    type="text"
                    onClick={() => handleRemoveLink(index)}
                  />
                </div>
              </Form.Item>
            </>
            // </div>
          ))}
          {socialLinks.length < 5 && (
            <Form.Item>
              <Button
                type="dashed"
                onClick={handleAddLink}
                icon={<PlusOutlined />}
              >
                {t("Add Another Site internet")}
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
                message: t("Please enter an email"),
              },
              {
                type: "email",
                message: t("Please input a valid email!"),
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          {user && user.email_1 ? (
            <>
              <Form.Item
                label={t("Additional Email")}
                name="email_1"
                rules={[
                  {
                    type: "email",
                    message: t("Please input a valid email!"),
                  },
                ]}
              >
                <Input placeholder="" />
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
                    type: "email",
                    message: t("Please input a valid email!"),
                  },
                ]}
              >
                <div style={{ display: "flex" }}>
                  <Input style={{ width: "90%" }} placeholder="" />
                  <Button
                    style={{ marginLeft: "6px" }}
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                    type="text"
                    onClick={() => handleRemoveAdditionalEmail(index)}
                  />
                </div>
              </Form.Item>
            </div>
          ))}
          {user && !user.email_1 && additionalEmails.length < 1 && (
            <Form.Item>
              <Button
                type="dashed"
                onClick={handleAddAdditionalEmail}
                icon={<PlusOutlined />}
              >
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
                message: t("Please enter a phone number"),
              },
              {
                pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                message: t("Invalid phone number format"),
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
              placeholder="+33 1 23 45 67 89"
            />
          </Form.Item>
          <Form.Item label={t("Phone Type")} name="phone_number_type">
            <Radio.Group>
              <Radio name="phone_number_professional" value="PROFESSIONNEL">
                {t("Professionnel")}
              </Radio>
              <Radio name="phone_number_personal" value="PERSONAL">
                {t("Personal")}
              </Radio>
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
                    message: t("Invalid phone number format"),
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
                  placeholder="+33 1 23 45 67 89"
                />
              </Form.Item>
            </>
          ) : null}
          {additionalPhones.map((phone, index) => (
            <Form.Item
              key={index}
              label={t(`Another Phone`)}
              name={`phone_number_${index + 1}`}
              rules={[
                {
                  pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                  message: t("Invalid phone number format"),
                },
              ]}
            >
              <div style={{ display: "flex" }}>
                <InputMask
                  style={{
                    width: "85%",
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
                ></InputMask>
                <Button
                  style={{ marginLeft: "6px" }}
                  icon={<DeleteOutlined style={{ color: "red" }} />}
                  type="text"
                  onClick={() => handleRemovePhone(index)}
                />
              </div>
            </Form.Item>
          ))}
          {user && !user.phone_number_1 && additionalPhones.length < 1 && (
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={handleAddPhone}
                  icon={<PlusOutlined />}
                >
                  {t("Phone")}
                </Button>
              </Form.Item>
            </>
          )}
          <Form.Item label={t("Biography")} name="biography">
            <QuillInput
              style={{
                width: "396px",
              }}
            />
          </Form.Item>
          <div className="color-picker-container">
            <div className="color-picker-item">
              <label>Save Button Color:</label>
              <input
                type="color"
                value={saveButtonColor}
                onChange={handleSaveButtonColorChange}
              />
            </div>
            <div className="color-picker-item">
              <label>Exchange Button Color:</label>
              <input
                type="color"
                value={exchangeButtonColor}
                onChange={handleExchangeButtonColorChange}
              />
            </div>
            <div className="color-picker-item">
              <label>Background Theme:</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={handleBackgroundColorChange}
              />
            </div>
          </div>
          <div id="fb-editor"></div>
        </Form>
      </div>
    </Modal>
  );
};
export default UpdateUser;
