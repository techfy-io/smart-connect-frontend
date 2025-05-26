import React, { useState } from "react";
import {
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Spin,
  Button,
  Modal,
  Avatar,
  message,
  Empty,
  Menu,
  Dropdown,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import CompanyLogo from '../../Inspect/CompanyLogo.png';
import Sidebar from "../Common/Sidebar";
import "./CompanyUser.scss";
import AddUser from "../Dashboard/AddUser";
import { useEffect } from "react";
import axios from "axios";
import UpdateUser from "../Dashboard/UpdateUser";
import { useTranslation } from "react-i18next";
import QRCodeModal from "../Common/QRCodeModals";

const CompanyUsers = () => {
  const { t, i18n } = useTranslation("translation");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { company } = state || {};
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [companyUserList, setCompanyUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [qrModalVisible, setQRModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const modalHideShow = () => {
    setIsModalVisible((prev) => !prev);
  };

  const updateUser = (user) => {
    setSelectedUser(user);
    toggleUpdateUserModal();
  };

  const toggleUpdateUserModal = () => setOpenUserEditModal((prev) => !prev);

  const GetUserProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  useEffect(() => {
    getCompanyUser();
  }, []);
  const getCompanyUser = () => {
    const accessToken = localStorage.getItem("accessToken");
    localStorage.setItem("userid", company?.id);
    axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}/user/?company_id=${company?.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Fetched company users:", response.data);
        setCompanyUserList(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deleteUser = (id) => {
    Modal.confirm({
      title: t("Confirm"),
      content: t("Are you sure you want to delete this user?"),
      okText: t("OK"),
      cancelText: t("Cancel"),
      onOk() {
        const accessToken = localStorage.getItem("accessToken");
        axios
          .delete(`${process.env.REACT_APP_BASE_API_URL}/user/${id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            message.success(t("User Deleted Successfully"));
            getCompanyUser();
          })
          .catch((error) => console.log("error", error));
      },
      onCancel() {
        console.log("Deletion canceled");
      },
    });
  };
  const handleDownloadClick = (user) => {
    setSelectedUser(user);
    setQRModalVisible(true);
  };

  const closeModal = () => {
    setQRModalVisible(false);
  };

  return (
    <div className="companyusers-container">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className="compnayusers-content">
        <div className="content-header">
          <button
            className="sidebar-toggler"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="content-company-name">
            {company?.name
              ? company?.name?.length > 30
                ? `${company?.name.substring(0, 30)}...`
                : company.name
              : ""}
          </div>

          <div className="company-actions">
            <Button className="Add-company-btn" onClick={modalHideShow}>
              {t("Add User")}
            </Button>
          </div>
        </div>
        <div className="scrollable-wrapper">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("User Name")}</th>
                  <th>{t("Email")}</th>
                  <th>{t("Role")}</th>
                  {/* <th>{t("Text Field")}</th>
                  <th>{t("Checkbox Group")}</th>{" "} */}
                  {/* New header for Checkbox Group */}
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">
                      <Spin />
                    </td>
                  </tr>
                ) : companyUserList?.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <Empty description={t("No users found")} />
                    </td>
                  </tr>
                ) : (
                  companyUserList?.map((user, key) => {
                    let formData = [];

                    // Try to parse the form_builder_data for each user
                    try {
                      formData = JSON.parse(user.form_builder_data || "[]");
                    } catch (error) {
                      console.error("Error parsing JSON:", error);
                      console.log(
                        "Raw form_builder_data:",
                        user.form_builder_data
                      );
                    }
                    const textField = formData.filter(
                      (field) => field.type === "text"
                    );
                    const checkboxGroup = formData.filter(
                      (field) => field.type === "checkbox-group"
                    );

                    return (
                      <tr key={key}>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: user.first_name,
                            }}
                          />
                          <div
                            dangerouslySetInnerHTML={{ __html: user.last_name }}
                          />
                        </td>
                        {/* <td>{`${user.first_name?.slice(0, 30)} ${user.last_name?.slice(0, 10)}${user.last_name?.length > 10 ? '...' : ''}`}</td> */}
                        <td>{`${user.email?.slice(0, 30)}${
                          user.email?.length > 30 ? "..." : ""
                        }`}</td>
                        {/* <td>{`${user?.job_title ? (user.job_title.length > 30 ? user.job_title.slice(0, 30) + '...' : user.job_title) : ''}`}</td> */}
                        <td>
                          {user?.job_title && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: user.job_title,
                              }}
                            />
                          )}
                        </td>
                        {/* Display Text Field with Label on Top */}
                        {/* <td>
                          {textField.length > 0 ? (
                            <div>
                              {textField.map((textField, index) => (
                                <div key={index}>
                                  <div
                                    style={{
                                      fontWeight: "bold",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: textField.label,
                                      }}
                                    />
                                  </div>
                                  <div style={{ marginBottom: "8px" }}>
                                    {textField.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td> */}

                        {/* Display Checkbox Group with Label on Top and Selected State */}

                        {/* <td style={{ textAlign: "center" }}>
                          {checkboxGroup.length > 0 ? (
                            <div>
                              {checkboxGroup.map((checkboxGroup, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: "bold",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: checkboxGroup.label,
                                      }}
                                    />
                                  </div>
                                  {checkboxGroup.values.map((item, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "5px",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={item.selected}
                                        readOnly
                                        style={{ marginRight: "10px" }}
                                      />
                                      <span
                                        style={{
                                          display: "inline-block",
                                          width: "100px",
                                          textAlign: "left",
                                        }}
                                      >
                                        {item.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td> */}

                        <td className="Actions-btns">
                          <button
                            className="view-eye-btn"
                            onClick={() => GetUserProfile(user.id)}
                          >
                            <EyeOutlined />
                          </button>
                          <button
                            className="Delete-button"
                            onClick={() => deleteUser(user.id)}
                          >
                            <DeleteOutlined />
                          </button>
                          <button
                            className="Edit-button"
                            onClick={() => updateUser(user)}
                          >
                            <EditOutlined />
                          </button>
                          <button
                            className="download-button"
                            onClick={() => handleDownloadClick(user)}
                          >
                            <DownloadOutlined />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddUser
        CompaniesData={company}
        isModalVisible={isModalVisible}
        modalHideShow={modalHideShow}
        getCompanyUser={getCompanyUser}
      />
      <UpdateUser
        Companyid={company?.id}
        openEditModal={openUserEditModal}
        user={selectedUser}
        UpdatemodalHideShow={toggleUpdateUserModal}
        getCompanyUser={getCompanyUser}
      />
      <QRCodeModal
        visible={qrModalVisible}
        onClose={closeModal}
        qrCodeValue={
          selectedUser
            ? `https://dev.smartconnect.cards/profile/${company?.id}/${selectedUser.id}`
            : ""
        }
        firstName={selectedUser ? selectedUser.first_name : ""}
      />
    </div>
  );
};

export default CompanyUsers;
