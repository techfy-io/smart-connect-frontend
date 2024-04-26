import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { message, Spin, Button, Modal, Avatar, Form, Input, Empty } from 'antd';
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
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

function Dashboard() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [addCompanyModalVisible, setAddCompanyModalVisible] = useState(false);
  const [updateCompanyModalVisible, setUpdateCompanyModalVisible] = useState(false); // Step 1
  const [companyName, setCompanyName] = useState('')
  const [companyInfo, setCompanyInfo] = useState({}); // Step 1
  const updateUser = (user) => {
    setSelectedUser(user);
    toggleUpdateUserModal();
  };

  const toggleUpdateUserModal = () => setOpenUserEditModal(prev => !prev);
  const toggleAddCompanyModal = () => setAddCompanyModalVisible(prev => !prev); // Step 2
  const toggleUpdateCompanyModal = () => setUpdateCompanyModalVisible(prev => !prev); // Step 2

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

  const deleteUser = (id) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to delete this user?',
      onOk() {
        const accessToken = localStorage.getItem('accessToken');
        axios.delete(`${process.env.REACT_APP_BASE_API_URL}/usercontacts/${id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
          .then(response => {
            console.log(response, "delete user resp")
            message.success("User Deleted Successfully");
            // setTimeout(() => window.location.reload(), 1000);
            fetchUsers();
          })
          .catch(error => console.log("error", error));
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };
  const deleteCompany = (id) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to delete this Company?',
      onOk() {
        const accessToken = localStorage.getItem('accessToken');
        axios.delete(`${process.env.REACT_APP_BASE_API_URL}/companies/${id}/`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
          .then(response => {
            console.log(response, "delete Company resp")
            message.success("Company Deleted Successfully");
            // setTimeout(() => window.location.reload(), 1000);
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
      phone_number: company.phone_number
    });
    toggleUpdateCompanyModal();
  };
  const handleUpdateCompany = () => {
    form.validateFields().then((values) => {
      const accessToken = localStorage.getItem('accessToken');
      const { id } = companyInfo; // Get the company id from companyInfo state
      axios.patch(`${process.env.REACT_APP_BASE_API_URL}/companies/${id}/`, values, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
        .then((response) => {
          console.log(response);
          message.success("Company Updated Successfully");
          toggleUpdateCompanyModal(); // Close modal after successful update
          fetchCompanies(); // Refresh company data
        })
        .catch((error) => { // Added parentheses around error parameter
          console.log("error", error);
          const responseData = error.response.data;
          let errorMessage = '';
          for (const prop in responseData) {
            if (responseData.hasOwnProperty(prop)) {
              errorMessage = responseData[prop][0];
              break;
            }
          }
          message.error(errorMessage);
          setLoading(false);
        });
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  };

// dasd
  const handleCancel = () => {
    form.resetFields();
    toggleUpdateCompanyModal();
  };

  const GetUserProfile = (id) => {
    navigate(`/profile/${id}`);
  }; const getCompanyUsers = (company) => navigate('/companyuser', { state: { company } });
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <div className='content-header'>
          {userType === "SuperAdmin" ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* <img className='content-header-logo' src={CompanyLogo} alt="" /> */}
                <i class="fa fa-building-o content-header-logo" aria-hidden="true" style={{color:"white" , fontSize:"50px" }}></i>
                
                <div className='AddUser-action'>
                  <Button className='Add-user-btn' onClick={toggleAddCompanyModal}>Add Company</Button>
                </div>
              </div>
            </>) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className='content-header-companyName'>
                  {companyName}
                </div>
                <div className='AddUser-action'>
                  <a href="https://smartconnect.cards/completer-mon-parc-smartconnect/" target='_blank' style={{ textDecoration: "none" }}> <Button className='Add-user-btn'>Purchase New Card</Button></a>
                </div>
              </div>
            </>
          )
          }
        </div>
        {/* <div className="scrollable-table "> */}
        <table className="table">
          <thead>
            {userType === "SuperAdmin" ? (
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            ) : (
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
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
                        {companiesData ? (
                          <> {
                            companiesData.map((company, key) => (
                              <tr key={key}>
                                <td>{company.name}</td>
                                <td>{company.email}</td>
                                <td className='Actions-btns'>
                                  <button className='view-eye-btn' onClick={() => getCompanyUsers(company)}><EyeOutlined /></button>
                                  <button className="Delete-button" onClick={() => deleteCompany(company.id)}><DeleteOutlined /></button>
                                  <button
                                    className="Edit-button"
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
                              <Empty description="No Company found" />
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
                              <td>{user.first_name + " " + user.last_name}</td>
                              <td>{user.email}</td>
                              <td>{user.job_title}</td>
                              <td className='Actions-btns'>
                                <button className='view-eye-btn' onClick={() => GetUserProfile(user.id)}>
                                  <EyeOutlined />
                                </button>
                                <button className="Delete-button" onClick={() => deleteUser(user.id)}>
                                  <DeleteOutlined />
                                </button>
                                <button className="Edit-button" onClick={() => updateUser(user)}>
                                  <EditOutlined />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <td colSpan="4">
                            <Empty description="No users found" />
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
        title="Update Company"
        open={updateCompanyModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateCompany} loading={loading}>
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={companyInfo}
          onFinish={handleUpdateCompany}
        >
          <Form.Item label="Company Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
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
          <Form.Item
            label="Phone"
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

    </div >
  );
}

export default Dashboard;
