import React, { useState } from 'react';
import { DeleteOutlined, UserOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Spin, Button, Modal, Avatar, message } from 'antd';
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
    const {company } = state || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [companyUserList, setCompanyUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserEditModal, setOpenUserEditModal] = useState(false);
    const [loading, setLoading] = useState(true); // State to track loading status
    console.log("hi",company)
    const modalHideShow = () => {
        setIsModalVisible(prev => !prev);
    };

    const updateUser = (user) => {
        setSelectedUser(user);
        toggleUpdateUserModal();
    };

    const toggleUpdateUserModal = () => setOpenUserEditModal(prev => !prev);

    const GetUserProfile = (id) => {
        navigate(`/profile/${id}`);
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.get(`https://api.smartconnect.cards/api/user/?company_id=${company.id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
            .then((response) => {
                setCompanyUserList(response.data.results);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false); // Update loading status regardless of success or failure
            });
    }, []);
    const deleteUser = (id) => {
        Modal.confirm({
          title: 'Confirm',
          content: 'Are you sure you want to delete this user?',
          onOk() {
            const accessToken = localStorage.getItem('accessToken');
            axios.delete(`${process.env.REACT_APP_BASE_API_URL}/user/${id}/`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            })
              .then(response => {
                console.log("deleted user responce",response)
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
    return (
        <div className='companyusers-container'>
            <Sidebar />
            <div className='compnayusers-content'>
                <div className='content-header'>
                    <div className='content-header-logo'>
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
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? ( // Show loading spinner if loading
                            <tr>
                                <td colSpan="3"><Spin /></td>
                            </tr>
                        ) : companyUserList.length === 0 ? ( // Show message if no users found
                            <tr>
                                <td colSpan="3">No users found.</td>
                            </tr>
                        ) : (
                            companyUserList.map((user, key) => (
                                <tr key={key}>
                                    <td>{user.first_name + " " + user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.job_title}</td>
                                    <td className='Actions-btns'>
                                        <button className="view-eye-btn" onClick={() => GetUserProfile(user.id)}><EyeOutlined /></button>
                                        <button className="Delete-button" onClick={() => deleteUser(user.id)}><DeleteOutlined /></button>
                                        <button className="Edit-button" onClick={() => updateUser(user)}><EditOutlined /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <AddUser
                CompaniesDate={company.name}
                isModalVisible={isModalVisible}
                modalHideShow={modalHideShow}
            />
            <UpdateUser openEditModal={openUserEditModal} user={selectedUser} UpdatemodalHideShow={toggleUpdateUserModal} />
        </div>
    );
}

export default CompanyUsers;