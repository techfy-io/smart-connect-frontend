import React, { useState, useEffect } from 'react';
import { UserOutlined, SettingOutlined, TeamOutlined, DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import axios from 'axios';
import './Dashboard.scss';
import Smartlogo from "../../Inspect/Smart-logo.png"

function Dashboard() {
  const [UserType, setUserType] = useState("User");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const Userinfo = localStorage.getItem('userinfo');
        console.log(Userinfo);
        if (Userinfo === "true") {
          setUserType("SuperAdmin");
          const response = await axios.get(
            'http://smart-connect.eu-west-3.elasticbeanstalk.com/api/companies/',
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
          setLoading(false)
          console.log("I'm super admin");
        } else {
          setUserType("User");
          const userResponse = await axios.get(
            'http://smart-connect.eu-west-3.elasticbeanstalk.com/api/usercontacts/',
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
          setLoading(false)
          console.log("I'm simple user");
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        message.error('Failed to load list');
        setLoading(false)

      }
    };

    fetchData();
  }, []);

  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sider">
        <img className='logo-image' src={Smartlogo} alt="" srcset="" />
        {
          UserType === "SuperAdmin" ? (
            <ul className="menu">
              <li className="menu-item"><TeamOutlined /> Companies</li>
              <li className="menu-item"><SettingOutlined />  Settings</li>
            </ul>
          ) : (

            <ul className='menu'>
              <li className='menu-item'><UserOutlined /> Users</li>
              <li className='menu-item'><SettingOutlined /> Settings</li>
            </ul>
          )
        }
        <button className="collabs-button" onClick={toggleSidebar}> {isSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}     </button>
      </div>
      <div className="content">
        <div className='content-header'>
          {
            UserType === "SuperAdmin" ? (
              <h2 className='content-header-headings'>Companies </h2>
            ) : (
              <h2 className='content-header-headings'>Jhone Elix </h2>
            )
          }

        </div>

        {
          UserType === "SuperAdmin" ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Companies</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ?
                    <tr>
                      <td colSpan="3"><Spin /></td>
                    </tr>
                    :
                    (
                      <>
                        {
                          companiesData.length > 0 ? (
                            companiesData.map(company => (
                              <tr key={company}>
                                <td>{company.company}</td>
                                <td>{company.email}</td>
                                <td className='Actions-btns'>
                                  <button className="Delete-button" onClick={() => alert(`Action clicked by ${company.key}`)}><DeleteOutlined /></button>
                                </td>
                              </tr>
                            ))
                          ) :
                            (
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
                  loading ?
                    <tr>
                      <td colSpan="3"><Spin /></td>
                    </tr>
                    : (
                      <>
                        {userData.length > 0 ? (
                          userData.map(user => (
                            <tr key={user.key}>
                              <td>{user.first_name + "  " + user.last_name}</td>
                              <td>{user.email}</td>
                              <td className='Actions-btns'>
                                <button className="Delete-button" onClick={() => alert(`Action clicked by ${user.key}`)}><DeleteOutlined /></button>
                                <button className="Edit-button" onClick={() => alert(`Action clicked by ${user.key}`)}><EditOutlined /></button>
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
    </div >
  );
}

export default Dashboard;
