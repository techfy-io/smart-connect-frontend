import React from 'react';
import { DashboardOutlined, UserOutlined, SettingOutlined, TeamOutlined,DeleteOutlined } from '@ant-design/icons';
import './Dashboard.scss';
import logo from "../../Inspect/logo.png";
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


const columns = [
  {
    title: 'Company Name',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <button className="action-button" onClick={() => alert('Action clicked')}>
        Edit
      </button>
    ),
  },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="sider">
        <img className='logo-image' src={Smartlogo} alt="" srcset="" />
        <ul className="menu">
          {/* <li className="menu-item"><DashboardOutlined/> Dashboard</li> */}
          <li className="menu-item"><TeamOutlined /> Companies</li>
          {/* <li className="menu-item"><UserOutlined/>  Super Admin</li> */}
          <li className="menu-item"><SettingOutlined />  Settings</li>
          {/* <li className="menu-item"><UserOutlined/> Users</li> */}
        </ul>
      </div>
      <div className="content">
        <div className='content-header'>
          <h2 className='content-header-headings'>Companies </h2>
        </div>
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
                <td><button className="Delete-button" onClick={() => alert(`Action clicked by ${company.key}`)}><DeleteOutlined/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
