import React, { useState } from 'react';
import { DashboardOutlined, UserOutlined, SettingOutlined, TeamOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './Dashboard.scss';
import Smartlogo from "../../Inspect/Smart-logo.png"

const companiesData = [
  {
    key: '1',
    companyName: 'Company A',
    email: 'companya@example.com',
  },
  {
    key: '2',
    companyName: 'Company B',
    email: 'companyb@example.com',
  },
  {
    key: '3',
    companyName: 'Company C',
    email: 'companyc@example.com',
  },
  {
    key: '4',
    companyName: 'Company D',
    email: 'companyd@example.com',
  },
  {
    key: '5',
    companyName: 'Company E',
    email: 'companye@example.com',
  },
  {
    key: '6',
    companyName: 'Company F',
    email: 'companyf@example.com',
  },
  {
    key: '7',
    companyName: 'Company G',
    email: 'companyG@example.com',
  },
  {
    key: '8',
    companyName: 'Company H',
    email: 'companyH@example.com',
  },
  {
    key: '9',
    companyName: 'Company I',
    email: 'companyI@example.com',
  },
  // Add more companies as needed
];
const userData = [
  {
    key: '1',
    companyName: 'User A',
    email: 'User@example.com',
  },
  {
    key: '2',
    companyName: 'User B',
    email: 'User@example.com',
  },
  {
    key: '3',
    companyName: 'User C',
    email: 'User@example.com',
  },
  {
    key: '4',
    companyName: 'User D',
    email: 'User@example.com',
  },
  {
    key: '5',
    companyName: 'User E',
    email: 'companye@example.com',
  },
  {
    key: '6',
    companyName: 'User F',
    email: 'companyf@example.com',
  },
  {
    key: '7',
    companyName: 'User G',
    email: 'companyG@example.com',
  },
  {
    key: '8',
    companyName: 'User H',
    email: 'companyH@example.com',
  },
  {
    key: '9',
    companyName: 'User I',
    email: 'companyI@example.com',
  },
  // Add more companies as needed
];

function Dashboard() {
  const [UserType, SetUserType] = useState("SuperAdmin")

  return (
    <div className="dashboard">
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
        {/* compnies table for super Admin */}
        <div className='User-type'>
          <label htmlFor="SuperAdmin">Super Admin</label>
          <input
            id="SuperAdmin"
            name="userType"
            value="SuperAdmin"
            type="radio"
            onChange={(e) => SetUserType(e.target.value)}
          />

          <label htmlFor="User">User</label>
          <input
            id="User"
            name="userType"
            value="User"
            type="radio"
            onChange={(e) => SetUserType(e.target.value)}
          />
        </div>
        {
          UserType === "SuperAdmin" ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companiesData.map(company => (
                  <tr key={company.key}>
                    <td>{company.companyName}</td>
                    <td>{company.email}</td>
                    <td className='Actions-btns'>
                      <button className="Delete-button" onClick={() => alert(`Action clicked by ${company.key}`)}><DeleteOutlined /></button>
                    </td>
                  </tr>
                ))}
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
                {userData.map(company => (
                  <tr key={company.key}>
                    <td>{company.companyName}</td>
                    <td>{company.email}</td>
                    <td className='Actions-btns'>
                      <button className="Delete-button" onClick={() => alert(`Action clicked by ${company.key}`)}><DeleteOutlined /></button>
                      <button className="Edit-button" onClick={() => alert(`Action clicked by ${company.key}`)}><EditOutlined /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }


      </div>
    </div>
  );
}

export default Dashboard;
