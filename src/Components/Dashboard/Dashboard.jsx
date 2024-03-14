import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { message, Spin, Button, Modal } from 'antd';
import axios from 'axios';
import './Dashboard.scss';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import { Link, useNavigate } from 'react-router-dom';
import CompanyLogo from '../../Inspect/CompanyLogo.png'
import Sidebar from '../Common/Sidebar';
function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const modalHideShow = () => {
    setIsModalVisible(prev => !prev);
  };

  const updateUser = (user) => {
    setSelectedUser(user);
    UpdatemodalHideShow();
  };
  const UpdatemodalHideShow = () => {
    setOpenUserEditModal(prev => !prev);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userToken = localStorage.getItem('userinfo');
        if (userToken === "true") {
          setUserType("SuperAdmin");
          const response = await axios.get(
            'https://api.smartconnect.cards/api/companies/',
            {
              params: {
                limit: 10,
                offset: 0,
              },
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );

          setCompaniesData(response.data);
          setLoading(false);
        } else {
          setUserType("User");
          const userResponse = await axios.get(
            'https://api.smartconnect.cards/api/usercontacts/',
            {
              params: {
                limit: 10,
                offset: 0,
              },
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          console.log(userResponse.data?.results);
          setUserData(userResponse.data.results);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        message.error('Failed to load list');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteUser = (id) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to delete this user?',
      onOk() {
        console.log(id);
        const accessToken = localStorage.getItem('accessToken');
        axios.delete(
          `https://api.smartconnect.cards/api/usercontacts/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        )
          .then(response => {
            console.log("response", response);
            message.success("User Deleted Successfully");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch(error => {
            console.log("error", error);
          });
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };

  // getuserprofile
  const GetUserProfile = (id) => {
    navigate(`/userprofile/${id}`);
  }

  const getCompanyUsers = (company) => {
    navigate('/companyuser', { state: { company } })
  }
  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar />
      <div className="content">
        <div className='content-header'>
          {
            userType === "SuperAdmin" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <img className='content-header-logo' src={CompanyLogo} alt="" />
                  <div className='AddUser-action'>
                    <Button className='Add-user-btn'>
                      Add Company
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
              </>
            )
          }
        </div>
        {
          userType === "SuperAdmin" ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  {/* <th>Email</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr>
                      <td colSpan="3"><Spin /></td>
                    </tr>
                  ) : (
                    <>
                      {
                        companiesData.length > 0 ? (
                          companiesData.map((company, key) => (
                            <tr key={key}>
                              <td >{company.company}</td>
                              {/* <td>{company.email}</td> */}
                              <td className='Actions-btns'>
                                <button className='view-eye-btn' onClick={() => getCompanyUsers(company)}><EyeOutlined /></button>
                                <button className="Delete-button" onClick={() => alert(`Action clicked by ${company.key}`)}><DeleteOutlined /></button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No Company found</td>
                          </tr>
                        )
                      }
                    </>
                  )
                }
              </tbody>
            </table>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr>
                      <td colSpan="3"><Spin /></td>
                    </tr>
                  ) : (
                    <>
                      {userData.length > 0 ? (
                        userData.map((user, key) => (
                          <tr key={key}>
                            <td>{user.first_name + "  " + user.last_name}</td>
                            <td>{user.email}</td>
                            <td className='Actions-btns'>
                              <button  className='view-eye-btn' onClick={() => GetUserProfile(user.id)}><EyeOutlined /></button>
                              <button className="Delete-button" onClick={() => deleteUser(user.id)}>
                                <DeleteOutlined />
                              </button>
                              <button className="Edit-button" onClick={() => updateUser(user)}><EditOutlined /></button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">No users found</td>
                        </tr>
                      )}
                    </>
                  )
                }
              </tbody>
            </table>
          )
        }
      </div>
      <AddUser
        isModalVisible={isModalVisible}
        modalHideShow={modalHideShow}
      />
      <UpdateUser
        openEditModal={openUserEditModal}
        user={selectedUser}
        UpdatemodalHideShow={UpdatemodalHideShow}
      />
    </div>
  );
}

export default Dashboard;
