import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined, MenuFoldOutlined, DownloadOutlined } from '@ant-design/icons';
import { message, Spin, Button, Modal, Avatar, Form, Input, Empty, Menu, Dropdown } from 'antd';
import axios from 'axios';
import './Dashboard.scss';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import { Link, useNavigate } from 'react-router-dom';
import CompanyLogo from '../../Inspect/CompanyLogo.png';
import Sidebar from '../Common/Sidebar';
import AddCompany from './AddCompany';
import CompanyUsers from '../SuperAdmin/CompanyUsers';
import InputMask from "react-input-mask";
import 'font-awesome/css/font-awesome.min.css';
import { useTranslation } from "react-i18next";
import QRCodeModal from "../Common/QRCodeModals";
import "./CustomQuill.css";
import "./ColorPicker.css";

function Dashboard() {
  const { t, i18n } = useTranslation('translation');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [userType, setUserType] = useState("");
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [companyId, setCompanyId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateCompanyloading, setupdateCompanyloading] = useState(false);
  const [qrModalVisible, setQRModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [addCompanyModalVisible, setAddCompanyModalVisible] = useState(false);
  const [updateCompanyModalVisible, setUpdateCompanyModalVisible] = useState(false);
  const [companyName, setCompanyName] = useState('')
  const [companyInfo, setCompanyInfo] = useState({});
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
  const updateUser = (user) => {
    setSelectedUser(user);
    toggleUpdateUserModal();
  };

  const toggleUpdateUserModal = () => setOpenUserEditModal(prev => !prev);
  const toggleAddCompanyModal = () => setAddCompanyModalVisible(prev => !prev);
  const toggleUpdateCompanyModal = () => setUpdateCompanyModalVisible(prev => !prev);

  useEffect(() => {
    const userToken = localStorage.getItem('userinfo');
    if (userToken === "true") {
      fetchCompanies();
      setUserType("SuperAdmin")
    } else {
      fetchUsers();
    }
  }, []);

  const fetchCompanies = async () => {
    setUserType("SuperAdmin")

    const accessToken = localStorage.getItem('accessToken');
    await axios.get(`${process.env.REACT_APP_BASE_API_URL}/companies/`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then((response) => {
        setUserType("SuperAdmin")
        setCompaniesData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
        setLoading(false);
      });
  };

  // const fetchUsers = () => {
  // const fetchUsers = () => {
  //   const accessToken = localStorage.getItem('accessToken');
  // testing deployment
  //   const userId = localStorage.getItem('userid');
  //   axios.get(`${process.env.REACT_APP_BASE_API_URL}/user/?company_id=${userId}`, {
  //     headers: { 'Authorization': `Bearer ${accessToken}` }
  //   })
  //     .then((response) => {
  //       console.log(".userData", response?.data?.results)
  //       setUserType("User")
  //       setCompanyName(response?.data?.results[0]?.companies[0]?.company_name);
  //       setCompanyId(response?.data?.results[0]?.companies[0]?.company_id);
  //       setUserData(response?.data?.results);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching users:', error);
  //       setLoading(false);
  //     });
  // };


  const fetchUsers = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userid');

    await axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/user/?company_id=${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const results = response?.data?.results ?? [];
        setUserType('User');

        const first = results?.[0];
        const firstCompany = first?.companies?.[0];

        setCompanyName(firstCompany?.company_name ?? '');
        setCompanyId(firstCompany?.company_id ?? '');

        setUserData(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };


  const deleteCompany = async (id) => {
    Modal.confirm({
      title: t('Confirm'),
      content: t('Are you sure you want to delete this Company?'),
      okText: t('OK'),
      cancelText: t('Cancel'),
      async onOk() {
        const accessToken = localStorage.getItem('accessToken');
        await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/companies/${id}/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
          .then(response => {
            message.success(t('Company Deleted Successfully'));
            fetchCompanies();
          })
          .catch(error => console.log("error", error));
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };

  const openUpdateCompanyModal = (company) => {
    setCompanyInfo(company);
    form.setFieldsValue({
      name: company?.name,
      email: company?.email,
      phone_number: company?.phone_number,
    });
    setBackgroundColor(company?.background_theme_color || "rgba(243, 243, 243, 0.8)")
    setExchangeButtonColor(company?.exchange_button_color || "#616569")
    setSaveButtonColor(company?.save_button_color || "#F47122")
    toggleUpdateCompanyModal();
  };
  const handleUpdateCompany = async () => {
    form.validateFields().then(async (formValues) => {
      const payload = {
        ...formValues,
        save_button_color: saveButtonColor,
        exchange_button_color: exchangeButtonColor,
        background_theme_color: backgroundColor,
      };

      setupdateCompanyloading(true);
      const accessToken = localStorage.getItem('accessToken');
      const { id } = companyInfo;

      await axios.patch(`${process.env.REACT_APP_BASE_API_URL}/companies/${id}/`, payload, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
        .then((response) => {
          message.success(t('Company Updated Successfully'));
          toggleUpdateCompanyModal();
          fetchCompanies();
          setupdateCompanyloading(false);
        })
        .catch((error) => {
          console.log("error", error);
          if (error.response) {
            if (error.response.status === 404 || error.response.status === 500) {
              message.error(t('Failed: Something went wrong with the server.'));
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
            message.error(t('Failed: No response received from the server.'));
          } else {
            console.error("Error setting up the request:", error.message);
            message.error(t('Failed: Error setting up the request.'));
          }
          setupdateCompanyloading(false);
        });
    }).catch((err) => {
      setupdateCompanyloading(false);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    toggleUpdateCompanyModal();
  };

  const GetUserProfile = (id) => {
    navigate(`/profile/${id}`);
  };
  const getCompanyUsers = (company) => navigate('/companyuser', { state: { company } });

  const handleDownloadClick = (user) => {
    setSelectedUser(user);
    setQRModalVisible(true);
  };

  const closeModal = () => {
    setQRModalVisible(false);
  };
  return (
    <div className="dashboard">
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      <div className="content">
        <div className='content-header'>
          <button className="sidebar-toggler" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            {isSidebarCollapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
          </button>
          {userType === "SuperAdmin" ? (
            <>
              <i class="fa fa-building-o content-header-logo" aria-hidden="true" style={{ color: "white", fontSize: "50px" }}></i>
              <div className='AddUser-action'>
                <Button className='Add-user-btn' onClick={toggleAddCompanyModal}>{t('Add Company')}</Button>
              </div>
            </>) : (
            <>
              <div className='content-company-name'>
                {/* {companyName ? companyName.length > 30 ? `${companyName.substring(0, 30)}...` : companyName : ""} */}
              </div>
              <div className='AddUser-action'>
                <a href="https://smartconnect.cards/completer-mon-parc-smartconnect/" target='_blank' style={{ textDecoration: "none" }}> <Button className='Add-user-btn'>{t('Purchase New Card')}</Button></a>
              </div>
            </>
          )
          }
        </div>
        <div className="scrollable-wrapper">
          <table className="table">
            <thead>
              {userType === "SuperAdmin" ? (
                <tr>
                  <th>{t('Company Name')}</th>
                  <th>{t('Email')}</th>
                  <th>{t('Action')}</th>
                </tr>
              ) : (
                <tr>
                  <th>{t('User Name')}</th>
                  <th>{t('Email')}</th>
                  <th>{t('Role')}</th>
                  <th>{t('Action')}</th>
                </tr>
              )}
            </thead>
            {
              loading ? (
                <>
                  <tbody>
                    <tr>
                      <td colSpan="4"> <Spin /></td></tr>
                  </tbody>
                </>
              ) : (
                <>
                  {
                    userType === "SuperAdmin" && companiesData && companiesData.length > 0 ? (
                      <>
                        <tbody>
                          {companiesData.length ? (
                            <> {
                              companiesData.map((company, key) => (
                                <tr key={key}>
                                  <td>{`${company.name?.slice(0, 35)}${company.name?.length > 35 ? '...' : ''}`}</td>
                                  <td>{`${company.email?.slice(0, 35)}${company.email?.length > 35 ? '...' : ''}`}</td>

                                  <td className='Actions-btns'>
                                    <button className='view-eye-btn' onClick={() => getCompanyUsers(company)}><EyeOutlined /></button>
                                    <button className="Delete-button" onClick={() => deleteCompany(company.id)}><DeleteOutlined /></button>
                                    <button
                                      className="download-button"
                                      onClick={() => openUpdateCompanyModal(company)}
                                    >
                                      <EditOutlined />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <tr>
                              <td colSpan="4">
                                <Empty description={t('No Company found')} />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </>
                    ) : (
                      <>
                        <tbody>
                          {userData && userData.length > 0 ? (
                            userData.map((user, key) => (
                              <tr key={key}>
                                <td>{`${user.first_name?.slice(0, 25)} ${user.last_name?.slice(0, 10)}${user.last_name?.length > 15 ? '...' : ''}`}</td>
                                <td>{`${user.email?.slice(0, 25)}${user.email?.length > 25 ? '...' : ''}`}</td>
                                <td>
                                  {user.job_title
                                    ? (user.job_title.length > 25
                                      ? `${user.job_title.slice(0, 25)}...`
                                      : user.job_title
                                    )
                                    : ""
                                  }
                                </td>
                                <td className='Actions-btns'>

                                  <a
                                    href={`/profile/${user.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      GetUserProfile(user.id);
                                    }}
                                    className="view-eye-btn"
                                  >
                                    <EyeOutlined />
                                  </a>
                                  <button className="Edit-button" onClick={() => updateUser(user)}>
                                    <EditOutlined />
                                  </button>
                                  <button className="Edit-button" onClick={() => handleDownloadClick(user)}>
                                    <DownloadOutlined />
                                  </button>

                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4">
                                <Empty description={t('No users found')} />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </>
                    )
                  }
                </>
              )
            }
          </table>
        </div>
      </div>
      <UpdateUser
        openEditModal={openUserEditModal}
        user={selectedUser}
        UpdatemodalHideShow={toggleUpdateUserModal}
        getCompanyUser={fetchUsers}
        Companyid={companyId}
      />
      <AddCompany openAddcompanymodal={addCompanyModalVisible} toggleAddCompanyModal={toggleAddCompanyModal} fetchCompanies={fetchCompanies} />
      <Modal
        title={t('Update Company')}
        open={updateCompanyModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t('Cancel')}
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateCompany} loading={updateCompanyloading}>
            {t('Update')}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={companyInfo}
          onFinish={handleUpdateCompany}
        >
          <Form.Item label={t('Company Name')} name="name"
            rules={[
              {
                required: true,
                message: (t("Please input your company name!")),
              }
            ]}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            label={t('Email')}
            name="email"
            rules={[
              {
                required: true,
                message: (t('Please enter an email')),
              },
              {
                type: 'email',
                message: (t('Please input a valid email!')),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('Phone')}
            name="phone_number"
            rules={[
              {
                pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                message: t('Invalid phone number format'),
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
        </Form>
      </Modal>
      <QRCodeModal
        visible={qrModalVisible}
        onClose={closeModal}
        qrCodeValue={selectedUser ? `https://app.smartconnect.cards/profile/${companyId}/${selectedUser?.public_id}` : ''}
        firstName={selectedUser ? selectedUser.first_name : ''}
      />
    </div >
  );
}

export default Dashboard;
