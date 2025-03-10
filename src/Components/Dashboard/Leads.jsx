import React, { useState, useEffect } from "react";
import "./Leads.scss";
import Sidebar from "../Common/Sidebar";
import {
  DeleteOutlined,
  MenuOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import {
  message,
  Spin,
  Button,
  Avatar,
  Empty,
  Modal,
  Form,
  Input,
  Menu,
  Checkbox,
  Dropdown,
} from "antd";
import axios from "axios";
import InputMask from "react-input-mask";
import { useTranslation } from "react-i18next";

const Leads = () => {
  const { t, i18n } = useTranslation("translation");
  const [form] = Form.useForm();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [exchangeData, setExchangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState({});

  useEffect(() => {
    getExchangeUser();
  }, []);

  const getExchangeUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userid = localStorage.getItem("userid");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/exchange/?company_id=${userid}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setExchangeData(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchanged users:", error);
      message.error("Failed to fetch exchanged users");
      setLoading(false);
    }
  };

  const deleteExchangeUser = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .delete(`${process.env.REACT_APP_BASE_API_URL}/exchange/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response, "delete user resp");
        message.success(t("User Deleted Successfully"));
        getExchangeUser();
      })
      .catch((error) => console.log("error", error));
  };

  const onFinish = async (values) => {
    try {
      setUpdating(true);
      const accessToken = localStorage.getItem("accessToken");
      await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/exchange/${selectedUser.id}/`,
        values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsModalVisible(false);
      message.success("User updated successfully");
      getExchangeUser();
    } catch (error) {
      console.log("error", error);
      const responseData = error.response.data;
      let errorMessage = "";
      for (const prop in responseData) {
        if (responseData.hasOwnProperty(prop)) {
          errorMessage = responseData[prop][0];
          break;
        }
      }
      message.error(errorMessage);
    } finally {
      setUpdating(false); // Hide loading indicator on update button
    }
  };

  // const handleEdit = (user) => {
  //     setSelectedUser(user);
  //     setIsModalVisible(true);
  //     form.setFieldsValue(user); // Set form fields value with selected user data
  // };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields on cancel
  };

  const handleDeleteConfirm = (id) => {
    Modal.confirm({
      title: t("Confirm"),
      content: t("Are you sure you want to delete this user?"),
      okText: t("OK"), // Translate the OK button text
      cancelText: t("Cancel"), // Translate the Cancel button text
      onOk() {
        deleteExchangeUser(id);
      },
      onCancel() {
        console.log("Deletion canceled");
      },
    });
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const parseCheckboxGroup = (value) => {
    let jsonString = value
      .replace(/'/g, '"')
      .replace(/True/g, "true")
      .replace(/False/g, "false");
    jsonString = jsonString.replace(/,\s*([}\]])/g, "$1"); // Clean trailing commas

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  };

  const handleCheckboxChange = (checkedValues) => {
    setCheckboxOptions(checkedValues);
  };
  // const changeLanguage = (lng) => {
  //     i18n.changeLanguage(lng);
  //   };
  //   const menu = (
  //     <Menu>
  //       <Menu.Item key="fr" onClick={() => changeLanguage('fr')}>
  //         French
  //       </Menu.Item>
  //       <Menu.Item key="en" onClick={() => changeLanguage('en')}>
  //         English
  //       </Menu.Item>
  //     </Menu>
  //   );
  return (
    <div className="leads">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className="leads-content">
        <div className="leads-header">
          <button
            className="sidebar-toggler"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
          </button>
          <div style={{ paddingLeft: "10px", color: "white" }}>
            <h2>
              {t("Leads")}
              <span style={{ fontSize: "15px", padding: "4px" }}>
                {loading ? "" : exchangeData && `(${exchangeData?.length})`}
              </span>
            </h2>
          </div>
          {/* <div className='language-translate-btn'>
                    <Dropdown overlay={menu} trigger={['click']} >
                    <Button type="primary" style={{ width: "100px", marginLeft: "4px" }}>
                      {i18n.language === 'fr' ? t('French') : t('English')} <DownOutlined />
                    </Button>
                  </Dropdown>
                    </div> */}
        </div>
        <div className="scrollable-wrapper">
          <div className="table-container">
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("Name")}</th>
                    <th>{t("Company Name")}</th>
                    <th>{t("Phone")}</th>
                    <th>{t("Email")}</th>
                    <th>{t("Owner Name")}</th>
                    <th>{t("Date")}</th>
                    {/* <th>{t("Text Field")}</th>
                    <th>{t("Checkboxes")}</th> */}
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeData.length > 0 ? (
                    exchangeData.map((user, index) => {
                      const extraFieldContent = user.extra_fields
                        .filter((field) => field.field_type === "text")
                        .map((field) => `${field.label}: ${field.value}`)
                        .join(", ");

                      const checkboxGroups = user.extra_fields
                        .filter(
                          (field) => field.field_type === "checkbox-group"
                        )
                        .map((field) => {
                          const options = parseCheckboxGroup(field.value);
                          return {
                            label: field.label,
                            options: options,
                          };
                        });

                      return (
                        <tr key={index}>
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                size="small"
                                style={{
                                  backgroundColor: getRandomColor(),
                                  padding: "20px",
                                  fontSize: "15px",
                                  marginBottom: "8px",
                                }}
                              >
                                {`${user.first_name
                                  .charAt(0)
                                  .toUpperCase()}${user.last_name
                                  .charAt(0)
                                  .toUpperCase()}`}
                              </Avatar>
                              <div
                                style={{ fontSize: "14px", fontWeight: "bold" }}
                              >
                                {`${user.first_name} ${user.last_name}`.slice(
                                  0,
                                  25
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            {user.company && user.company.length > 25
                              ? user.company.substring(0, 25) + "..."
                              : user.company}
                          </td>
                          <td>{user.phone_number}</td>
                          <td>
                            {user.email && user.email.length > 30
                              ? user.email.substring(0, 30) + "..."
                              : user.email}
                          </td>
                          <td>
                            {user?.owner && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: user.owner,
                                }}
                              />
                            )}
                          </td>
                          <td>
                            {(() => {
                              const date = new Date(user.created_at);
                              return `${date.toLocaleDateString()}`;
                            })()}
                          </td>
                          <td>
                            <div
                              className="extra-fields"
                              style={{ textAlign: "left" }}
                            >
                              {user.extra_fields
                                .filter((field) => field.field_type === "text")
                                .map((field, i) => (
                                  <div
                                    key={i}
                                    className="field-item"
                                    style={{ marginBottom: "12px" }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        marginBottom: "4px",
                                      }}
                                      className="field-label"
                                      dangerouslySetInnerHTML={{
                                        __html: field.label,
                                      }}
                                    ></div>
                                    <div
                                      className="field-value"
                                      dangerouslySetInnerHTML={{
                                        __html: field.value,
                                      }}
                                    ></div>
                                  </div>
                                ))}
                            </div>
                          </td>
                          {/* <td>
                            {checkboxGroups.map((group, i) => (
                              <div key={i}>
                                <h5
                                  dangerouslySetInnerHTML={{
                                    __html: group.label,
                                  }}
                                ></h5>
                                {group.options.map((option, j) => (
                                  <label
                                    key={j}
                                    style={{ display: "block", margin: "8px" }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={option.selected}
                                      readOnly
                                      style={{ marginRight: "8px" }} // Adds space between checkbox and label text
                                    />
                                    {option.label}
                                  </label>
                                ))}
                              </div>
                            ))}
                          </td> */}

                          <td>
                            <div className="Actions-btns">
                              <button
                                className="Delete-button"
                                shape="circle"
                                onClick={() => handleDeleteConfirm(user.id)}
                              >
                                <DeleteOutlined />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center" }}>
                        <Empty
                          description={<span>{t("No Records Found")}</span>}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Modal
        layout="vertical"
        width={450}
        title="Update Leads"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Update" // Update OK button text
        cancelText="Cancel" // Update Cancel button text
        confirmLoading={updating}
      >
        {" "}
        {/* Show loading indicator on OK button */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <label htmlFor="first_name">{t("First Name")}*</label>
          <Form.Item
            name="first_name"
            rules={[
              { required: true, message: t("Please input your first name!") },
            ]}
          >
            <Input />
          </Form.Item>
          <label htmlFor="last_name">{t("Last Name")}*</label>
          <Form.Item
            name="last_name"
            rules={[
              { required: true, message: t("Please input your last name!") },
            ]}
          >
            <Input />
          </Form.Item>
          <label htmlFor="company name">{t("Company Name")}*</label>
          <Form.Item
            name="company"
            rules={[
              { required: true, message: "Please input your company name!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <label htmlFor="email">{t("Email")}*</label>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: t("Please input a valid email!"),
              },
              {
                required: true,
                message: t("Please enter an email"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <label htmlFor="phone_number">{t("Phone")}*</label>
          <Form.Item
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
            />
          </Form.Item>
          {/* Dynamic Checkboxes */}
          {checkboxOptions && (
            <Form.Item name="checkboxes" label={t("Checkboxes")}>
              <Checkbox.Group
                options={checkboxOptions}
                onChange={handleCheckboxChange}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Leads;
