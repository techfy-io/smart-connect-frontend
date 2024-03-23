import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { message, Spin, Button, Modal, Avatar } from 'antd';
import axios from 'axios';
import './Dashboard.scss';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import { Link, useNavigate } from 'react-router-dom';
import CompanyLogo from '../../Inspect/CompanyLogo.png';
import Sidebar from '../Common/Sidebar';
import AddCompany from './AddCompany';
import CompanyUsers from '../SuperAdmin/CompanyUsers';

function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [addCompanyModalVisible, setAddCompanyModalVisible] = useState(false); // Step 1
  const updateUser = (user) => {
    setSelectedUser(user);
    toggleUpdateUserModal();
  };

  const toggleUpdateUserModal = () => setOpenUserEditModal(prev => !prev);
  const toggleAddCompanyModal = () => setAddCompanyModalVisible(prev => !prev); // Step 2

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
      params: { limit: 10, offset: 0 },
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
            message.success("User Deleted Successfully");
            setTimeout(() => window.location.reload(), 1000);
          })
          .catch(error => console.log("error", error));
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };
  const GetUserProfile = (id) => navigate(`/userprofile/${id}`);
  const getCompanyUsers = (company) => navigate('/companyuser', { state: { company } });
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <div className='content-header'>
          {userType === "SuperAdmin" ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <img className='content-header-logo' src={CompanyLogo} alt="" />
                <div className='AddUser-action'>
                  {/* <Button className='Add-user-btn' onClick={toggleAddCompanyModal}>Add Company</Button> Step 4 */}
                </div>
              </div>
            </>) : (
            <>
              <div style={{ padding: "10px" }}>
                {< Avatar icon={<UserOutlined />} style={{ padding: "25px" }} />}
              </div>
            </>
          )
          }
        </div>
        <div className="scrollable-table ">
          <table className="table">
            <thead>
              {userType === "SuperAdmin" ? (
                <tr>
                  <th>Company Name</th>
                  <th>Action</th>
                </tr>
              ) : (
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              )}
            </thead>
            {
              loading ? (
                <>
                  <tbody>
                    <tr>
                      <td colSpan="3"> <Spin /></td></tr>
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
                                  <td className='Actions-btns'>
                                    <button className='view-eye-btn' onClick={() => getCompanyUsers(company)}><EyeOutlined /></button>
                                    <button className="Delete-button"><DeleteOutlined /></button>
                                    <button className="Edit-button"><EditOutlined /></button>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                              <tr>
                                <td colSpan="3">No Company found</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </>
                    ) : (
                      <>
                        <tbody>
                          {userData ? (
                            userData.map((user, key) => (
                              <tr key={key}>
                                <td>{user.first_name + " " + user.last_name}</td>
                                <td>{user.email}</td>
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
                            <tr>
                              <td colSpan="3">No User found</td>
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
      <UpdateUser openEditModal={openUserEditModal} user={selectedUser} UpdatemodalHideShow={toggleUpdateUserModal} />
      <AddCompany openAddcompanymodal={addCompanyModalVisible} toggleAddCompanyModal={toggleAddCompanyModal} />
    </div >
  );
}

export default Dashboard;
