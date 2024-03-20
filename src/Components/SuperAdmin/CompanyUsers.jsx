import React, { useState } from 'react';
import { DeleteOutlined, UserOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Spin, Button, Modal, Avatar } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import CompanyLogo from '../../Inspect/CompanyLogo.png';
import Sidebar from '../Common/Sidebar';
import './CompanyUser.scss';
import AddUser from '../Dashboard/AddUser';
import { useEffect } from 'react';
import axios from 'axios';
import UpdateUser from '../Dashboard/UpdateUser';
const CompanyUsers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { company } = state || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [companyUserList, setCompanyUserList] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserEditModal, setOpenUserEditModal] = useState(false);
    const modalHideShow = () => {
        setIsModalVisible(prev => !prev);
    };
    const updateUser = (user) => {
        setSelectedUser(user);
        toggleUpdateUserModal();
    };
    const toggleUpdateUserModal = () => setOpenUserEditModal(prev => !prev);
    const GetUserProfile = (id) => {
        navigate(`/userprofile/${id}`);
    }
    useEffect(() => {
        // const accessToken = localStorage.getItem("accessToken");
        // axios.get(`${process.env.REACT_APP_BASE_API_URL}/companies/`, {
        //     params: { limit: 10, offset: 0 },
        //     headers: { 'Authorization': `Bearer ${accessToken}` }
        // }).then(response => {
        //     setCompanyUserList(response.data.results);
        //     console.log(response.data.results);
        // })
        setCompanyUserList(company)
    }, [])
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
                        {companyUserList && companyUserList.users.map((user, key) => (
                            <tr key={key}>
                                <td >{user.first_name + " " + user.last_name}</td>
                                <td >{user.email}</td>
                                <td className='Actions-btns'>
                                    <button className="view-eye-btn" onClick={() => GetUserProfile(user.id)}><EyeOutlined /></button>
                                    <button className="Delete-button" onClick={() => alert(`Action clicked by ${user.key}`)}><DeleteOutlined /></button>
                                    <button className="Edit-button" onClick={()=>updateUser(user)}><EditOutlined /></button>
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
            <UpdateUser openEditModal={openUserEditModal} user={selectedUser} UpdatemodalHideShow={toggleUpdateUserModal} />
        </div>
    );
}

export default CompanyUsers;
