import React, { useState, useRef, forwardRef } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Upload,
  Radio,
  Spin,
  Select,
} from "antd";
import axios from "axios";
import InputMask from "react-input-mask";
import {
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./Dashboard.scss";
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS
import { useEffect } from "react";
import FormItem from "antd/es/form/FormItem";
import { useTranslation } from "react-i18next";
import fb1Img from "../Dashboard/Facebook-Icons/facebook1.png"; // Import the image for fb1
import fb2Img from "../Dashboard/Facebook-Icons/facebook2.png"; // Import the image for fb2
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./CustomQuill.css";
import "./ColorPicker.css";
import $ from "jquery";
import Quill from "quill";
window.jQuery = $;
window.$ = $;
require("jquery-ui-sortable");
require("formBuilder");

const AddUser = ({
  isModalVisible,
  modalHideShow,
  CompaniesData,
  getCompanyUser,
}) => {
  const { t, i18n } = useTranslation("translation");
  const [form] = Form.useForm();
  const [additionalPhones, setAdditionalPhones] = useState([]);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [SocialLinks, setSocialLinks] = useState([]);
  const [currentCompany, setCurrentCompany] = useState("");
  const [loading, setLoading] = useState(false);
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
  const { Option } = Select;
  const [selectedFacebookIcon, setSelectedFacebookIcon] = useState(fb1Img);
  const [selectedInstagramIcon, setSelectedInstagramIcon] = useState(insta3);
  const [selectedLinkedInIcon, setSelectedLinkedInIcon] = useState(linkedIn2);
  const [selectedWebsiteIcon, setSelectedWebsiteIcon] = useState(web3);
  const facebookIcons = [fb1Img, fb2Img, fb3Img];
  const instagramIcons = [insta1, insta2, insta3];
  const linkedInIcons = [linkedIn1, linkedIn2, linkedIn3];
  const websiteIcons = [web1, web2, web3];
  const formBuilderRef = useRef(null);
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
          formats={["underline"]}
          className="custom-quill-editor"
          {...rest}
        />
      </div>
    );
  });

  useEffect(() => {
    if (isModalVisible) {
      if (formBuilderRef.current) {
        $("#fb-editor").formBuilder("reset");
        $("#fb-editor").formBuilder("setData", []);
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
      }
    }
  }, [isModalVisible]);
// on finish
  const onFinish = async (values) => {
    const {
      first_name,
      last_name,
      email,
      email_1,
      phone_number,
      phone_number_1,
      phone_number_2,
      phone_number_personal,
      phone_number_professional,
      job_title,
      biography,
      postal_code,
      zip_code,
      country,
      city,
      facebook_url,
      instagram_url,
      linkedin_url,
      company,
      profile_picture,
      cover_image,
      user_id,
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
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("first_name", first_name || "");
    formData.append("last_name", last_name || "");
    formData.append("email", email || "");
    if (email_1) {
      formData.append("email_1", email_1 || "");
    }
    formData.append("phone_number", phone_number || "");
    if (phone_number_1) {
      formData.append("phone_number_1", phone_number_1 || "");
    }
    formData.append("phone_number_2", phone_number_2 || "");
    formData.append("phone_number_personal", phone_number_personal || "");
    formData.append(
      "phone_number_professional",
      phone_number_professional || ""
    );
    formData.append("job_title", job_title || "");
    formData.append("bio_graphy", biography || "");
    formData.append("postal_code", postal_code || "");
    formData.append("zip_code", zip_code || "");
    formData.append("country", country || "");
    formData.append("city", city || "");
    formData.append("facebook_url", facebook_url || "");
    formData.append("instagram_url", instagram_url || "");
    formData.append("linkedin_url", linkedin_url || "");
    formData.append("other_link_media_1", other_link_media_1 || "");
    formData.append("other_link_media_2", other_link_media_2 || "");
    formData.append("other_link_media_3", other_link_media_3 || "");
    formData.append("other_link_media_4", other_link_media_4 || "");
    formData.append("other_link_media_5", other_link_media_5 || "");
    SocialLinks.forEach((link, index) => {
      formData.append(`other_link_${index + 1}`, link || "");
    });
    formData.append("company", currentCompany?.id || "");
    formData.append("profile_picture", profile_picture || "");
    formData.append("cover_image", cover_image || "");
    // formData.append("save_button_value", saveButtonColor);
    // formData.append("exchange_button_value", exchangeButtonColor);
    // formData.append("background_button_value", backgroundColor);
    formData.append("facebook_icon", selectedFacebookIcon || "");
    formData.append("instagram_icon", selectedInstagramIcon || "");
    formData.append("linkedin_icon", selectedLinkedInIcon || "");
    formData.append("website_icon", selectedWebsiteIcon || "");

    const formBuilderData = $("#fb-editor").formBuilder("getData");
    console.log("FormBuilder Data:", formBuilderData);
    formData.append("formBuilderData", JSON.stringify(formBuilderData));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/superadmin/create_user/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success(t("User Added Successfully"));
      setLoading(false);
      modalHideShow();
      getCompanyUser();
      form.resetFields();
    } catch (error) {
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
        message.error(t("Failed: No response received from the server."));
      } else {
        message.error(t("Failed: Error setting up the request."));
      }
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
      setAdditionalPhones([...additionalPhones, ""]);
    }
  };

  const handleAddEmail = () => {
    if (additionalEmails.length < 2) {
      setAdditionalEmails([...additionalEmails, ""]);
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
    if (SocialLinks.length < 5) {
      setSocialLinks([...SocialLinks, ""]);
    }
  };

  const handleRemoveLink = (index) => {
    const newLinks = SocialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  useEffect(() => {
    setCurrentCompany(CompaniesData);
  }, [CompaniesData]);
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
            form
              .validateFields()
              .then(() => {
                setLoading(true);
                form.submit();
              })
              .catch((error) => {
                setLoading(false);
              });
          }}
          loading={loading}
        >
          {t("Add")}
        </Button>,
      ]}
    >
      <div
        className="custom-scrollbar"
        style={{ overflowX: "auto", height: "450px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            company: currentCompany?.name || "",
          }}
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
              <Button
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
                form.setFieldsValue({ cover_image: file });
              }}
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
              name="first_name"
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
              label={`${t("Last Name")}*`}
              name="last_name"
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
            <Form.Item
              label={`${t("Company")}*`}
              name="company"
              rules={[
                {
                  required: true,
                  message: "Please enter a company",
                },
              ]}
            >
              <Input defaultValue={currentCompany?.name} />
            </Form.Item>
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
          {SocialLinks.map((_, index) => (
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
                      {`${t("Additional Site internet")} ${index + 1}`}{" "}
                    </span>
                    <SocialMediaIconSelector
                      icons={websiteIcons}
                      selectedIcon={selectedWebsiteIcon}
                      onIconSelect={setSelectedWebsiteIcon}
                      style={{ marginLeft: "10px" }}
                    />
                  </div>
                }
                name={`other_link_${index + 1}`}
                rules={[
                  {
                    type: "url",
                    message: t("Invalid URL format"),
                  },
                ]}
              >
                <div style={{ display: "flex" }}>
                  <Input
                    placeholder={t("Enter your site internet url")}
                    style={{ width: "90%" }}
                    value={SocialLinks[index]}
                    onChange={(e) => {
                      const newLinks = [...SocialLinks];
                      newLinks[index] = e.target.value;
                      setSocialLinks(newLinks);
                    }}
                  />
                  <Button
                    style={{ marginLeft: "6px" }}
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                    onClick={() => handleRemoveLink(index)}
                  />
                </div>
              </Form.Item>
            </>
          ))}

          {SocialLinks.length < 5 && (
            <Form.Item>
              <Button
                type="dashed"
                onClick={handleAddLink}
                icon={<PlusOutlined />}
              >
                {t("Add Another Social Link")}
              </Button>
            </Form.Item>
          )}

          <Form.Item
            label={`${t("Email")}*`}
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
          {additionalEmails.map((email, index) => (
            <Form.Item
              key={index}
              label={t("Additional Email")}
              name={`email_${index + 1}`}
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
                  onClick={() => handleRemoveEmail(index)}
                />
              </div>
            </Form.Item>
          ))}
          {additionalEmails.length < 1 && (
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={handleAddEmail}
                  icon={<PlusOutlined />}
                >
                  {t("Email")}
                </Button>
              </Form.Item>
            </>
          )}
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
            ></InputMask>
          </Form.Item>
          <Form.Item label={t("Phone Type")} name="phoneType">
            <Radio.Group>
              <Radio name="phone_number_professional" value="Professionnel">
                {t("Professionnel")}
              </Radio>
              <Radio name="phone_number_personal" value="Personal">
                {t("Personal")}
              </Radio>
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
          {additionalPhones.length < 1 && (
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

          {/* <Form.Item>
            <div className="color-picker-container">
              <div className="color-picker-item">
                <label>{t("Save Button Theme")}:</label>
                <input
                  type="color"
                  value={saveButtonColor}
                  onChange={handleSaveButtonColorChange}
                />
              </div>
              <div className="color-picker-item">
                <label>{t("Exchange Button Theme")}:</label>
                <input
                  type="color"
                  value={exchangeButtonColor}
                  onChange={handleExchangeButtonColorChange}
                />
              </div>
              <div className="color-picker-item">
                <label>{t("Background Theme")}:</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                />
              </div>
            </div>
          </Form.Item> */}
          <div id="fb-editor"></div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddUser;
