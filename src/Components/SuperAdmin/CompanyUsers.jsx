import React, { useState } from 'react';
import { DeleteOutlined, UserOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Spin, Button, Modal, Avatar } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import CompanyLogo from '../../Inspect/CompanyLogo.png';
import Sidebar from '../Common/Sidebar';
import './CompanyUser.scss';
import AddUser from '../Dashboard/AddUser';
const CompanyUsers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { company } = state || {};
    console.log(company.name)
    const [isModalVisible, setIsModalVisible] = useState(false);

    const modalHideShow = () => {
        setIsModalVisible(prev => !prev);
    };
    const GetUserProfile = (id) => {
        navigate(`/userprofile/${id}`);
    }
    return (
        <div className='companyusers-container'>
            <Sidebar />
            <div className='compnayusers-content'>
                <div className='content-header'>
                    {/* <img className='content-header-logo' src={CompanyLogo} alt="" /> */}
                    <div className='content-header-logo'>
                        {/* < Avatar style={{color:"white" , fontSize:"34px" , padding:"10px"}}/> */}
                        {<Avatar icon={<UserOutlined />} style={{ padding: "25px" }} />}
                    </div>
                    <div className='company-actions'>
                        <Button type='primary' className='Add-company-btn' onClick={modalHideShow}>Add User</Button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>User Name </th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {company && company.users.map((user, key) => (
                            <tr key={key}>
                                <td >{user.first_name + "" + user.last_name}</td>
                                <td >{user.email}</td>
                                <td className='Actions-btns'>
                                    <button className="view-eye-btn" onClick={() => GetUserProfile(user.id)}><EyeOutlined /></button>
                                    <button className="Delete-button" onClick={() => alert(`Action clicked by ${user.key}`)}><DeleteOutlined /></button>
                                    <button className="Edit-button"><EditOutlined /></button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddUser
                CompaniesDate={company}
                isModalVisible={isModalVisible}
                modalHideShow={modalHideShow}
            />
        </div>
    );
}

export default CompanyUsers;
