import React, { useState, useEffect } from 'react';
import { UserOutlined, SettingOutlined, TeamOutlined, DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { message, Spin, Button, Modal } from 'antd';
import axios from 'axios';
import './Dashboard.scss';
import Smartlogo from "../../Inspect/Smart-logo.png"
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import { Link, useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("User");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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
          console.log("I'm super admin");
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
          console.log("I'm a simple user");
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


  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sider">
        <img className='logo-image' src={Smartlogo} alt="" />
        {
          userType === "SuperAdmin" ? (
            <ul className="menu">
              <li className="menu-item"><TeamOutlined /> Companies</li>
              <li className="menu-item"><SettingOutlined /> Settings</li>
            </ul>
          ) : (
            <ul className='menu'>
              <li className='menu-item'><UserOutlined /> Users</li>
              <Link to='/usersetting' style={{textDecoration:"none"}}>
              <li className='menu-item' ><SettingOutlined /> Settings</li>
              </Link>

            </ul>
          )
        }
        <button className="collabs-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
        </button>
      </div>
      <div className="content">
        <div className='content-header'>
          {
            userType === "SuperAdmin" ? (
              <h2 className='content-header-headings'>Companies</h2>
            ) : (
              <h2 className='content-header-headings'>John Elix</h2>
            )
          }
          {
            userType === "User" && (
              <div className='AddUser-action'>
                <Button className='Add-user-btn' onClick={modalHideShow}>
                  Add User
                </Button>
              </div>
            )
          }

        </div>
        {
          userType === "SuperAdmin" ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Companies</th>
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
                          companiesData.map(company => (
                            <tr key={company}>
                              <td>{company.company}</td>
                              {/* <td>{company.email}</td> */}
                              <td className='Actions-btns'>
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
                        userData.map(user => (
                          <tr key={user.key}>
                            <td onClick={() => GetUserProfile(user.id)}>{user.first_name + "  " + user.last_name}</td>
                            <td>{user.email}</td>
                            <td className='Actions-btns'>
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
