import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, DownOutlined, DownloadOutlined } from '@ant-design/icons';
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
import html2canvas from 'html2canvas';
import QRCodeModal from "../Common/QRCodeModals";

function Dashboard() {
  const { t, i18n } = useTranslation('translation');

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateCompanyloading, setupdateCompanyloading] = useState(false);
  const [qrModalVisible, setQRModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [addCompanyModalVisible, setAddCompanyModalVisible] = useState(false);
  const [updateCompanyModalVisible, setUpdateCompanyModalVisible] = useState(false); 
  const [companyName, setCompanyName] = useState('')
  const [companyInfo, setCompanyInfo] = useState({}); 

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

  const fetchCompanies = () => {
    setUserType("SuperAdmin")

    const accessToken = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/companies/`, {
      // params: { limit: 10, offset: 0 },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then((response) => {
        setUserType("SuperAdmin")
        console.log(response);
        setCompaniesData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
        setLoading(false);
      });
  };

  const fetchUsers = () => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userid');
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/user/?company_id=${userId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then((response) => {
        setUserType("User")
        console.log(response.data.results);
        setCompanyName(response.data.results[0].company_name);
        console.log(companyName)
        setUserData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };

  const deleteCompany = (id) => {
    Modal.confirm({
      title: t('Confirm'), 
      content: t('Are you sure you want to delete this Company?'), 
      okText: t('OK'), 
      cancelText: t('Cancel'), 
      onOk() {
        const accessToken = localStorage.getItem('accessToken');
        axios.delete(`${process.env.REACT_APP_BASE_API_URL}/companies/${id}/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
          .then(response => {
            console.log(response, "delete Company resp")
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
      name: company.name,
      email: company.email,
      phone_number: company.phone_number,
    });
    toggleUpdateCompanyModal();
  };
  const handleUpdateCompany = () => {
    form.validateFields().then((values) => {
      setupdateCompanyloading(true);
      const accessToken = localStorage.getItem('accessToken');
      const { id } = companyInfo; 
      axios.patch(`${process.env.REACT_APP_BASE_API_URL}/companies/${id}/`, values, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
        .then((response) => {
          console.log(response);
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
    });
  };

  const handleCancel = () => {
    form.resetFields();
    toggleUpdateCompanyModal();
  };

  const GetUserProfile = (id) => {
    navigate(`/profile/${id}`);
  }; const getCompanyUsers = (company) => navigate('/companyuser', { state: { company } });

  const handleDownloadClick = (user) => {
    setSelectedUser(user);
    setQRModalVisible(true);
  };

  const closeModal = () => {
    setQRModalVisible(false);
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const menu = (
    <Menu>
      <Menu.Item key="fr" onClick={() => changeLanguage('fr')}>
        French
      </Menu.Item>
      <Menu.Item key="en" onClick={() => changeLanguage('en')}>
        English
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <div className='content-header'>
          {userType === "SuperAdmin" ? (
            <>
              {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
              {/* <img className='content-header-logo' src={CompanyLogo} alt="" /> */}
              {/* <div className='content-header-companyName'> */}
              <i class="fa fa-building-o content-header-logo" aria-hidden="true" style={{ color: "white", fontSize: "50px" }}></i>
              {/* </div> */}
              <div className='AddUser-action'>
                <Button className='Add-user-btn' onClick={toggleAddCompanyModal}>{t('Add Company')}</Button>
                <Dropdown overlay={menu} trigger={['click']} >
                  <Button className='language-change-btn' type="primary" style={{ marginLeft: "4px" }}>
                    {i18n.language === 'fr' ? t('French') : t('English')} <DownOutlined />
                  </Button>
                </Dropdown>


                {/* </div> */}
              </div>
              {/* </div> */}
            </>) : (
            <>
              {/* <div className='content-company-header'> */}
              <div className='content-company-name'>
                {companyName.length > 30 ? `${companyName.substring(0, 30)}...` : companyName}
              </div>
              <div className='AddUser-action'>
                <a href="https://smartconnect.cards/completer-mon-parc-smartconnect/" target='_blank' style={{ textDecoration: "none" }}> <Button className='Add-user-btn'>{t('Purchase New Card')}</Button></a>
                <Dropdown overlay={menu} trigger={['click']} >
                  <Button type="primary" style={{ marginLeft: "4px" }}>
                    {i18n.language === 'fr' ? t('French') : t('English')} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
              {/* </div> */}
            </>
          )
          }
        </div>
        {/* <div className="scrollable-table "> */}
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
                                    onClick={() => openUpdateCompanyModal(company)} // Pass company info here
                                  >
                                    <EditOutlined />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <>
                            <td colSpan="4">
                              <Empty description={t('No Company found')} />
                            </td>
                          </>
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
                              <td>{`${user.job_title?.slice(0, 25)}${user.job_title?.length > 25 ? '...' : ''}`}</td>

                              <td className='Actions-btns'>
                                <button className='view-eye-btn' onClick={() => GetUserProfile(user.id)}>
                                  <EyeOutlined />
                                </button>
                                <button className="Edit-button" onClick={() => updateUser(user)}>
                                  <EditOutlined />
                                </button>
                                {/* <button className="Delete-button" onClick={() => deleteUser(user.id)}>
                                  <DeleteOutlined />
                                </button> */}
                                <button className="Edit-button" onClick={() => handleDownloadClick(user)}>
                                  <DownloadOutlined />
                                </button>

                              </td>
                            </tr>
                          ))
                        ) : (
                          <td colSpan="4">
                            <Empty description={t('No users found')} />
                          </td>
                        )}
                      </tbody>
                    </>
                  )
                }
              </>
            )
          }
        </table>
        {/* </div> */}
      </div>
      <UpdateUser openEditModal={openUserEditModal} user={selectedUser} UpdatemodalHideShow={toggleUpdateUserModal} />
      <AddCompany openAddcompanymodal={addCompanyModalVisible} toggleAddCompanyModal={toggleAddCompanyModal} />
      {/* Update company Modal */}
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
            <Input />
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

        </Form>
      </Modal>
      <QRCodeModal
        visible={qrModalVisible}
        onClose={closeModal}
        qrCodeValue={selectedUser ? `https://app.smartconnect.cards/profile/${selectedUser.id}` : ''}
        firstName={selectedUser ? selectedUser.first_name : ''}
      />
    </div >
  );
}

export default Dashboard;
