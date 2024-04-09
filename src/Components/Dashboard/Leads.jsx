import React, { useState, useEffect } from 'react';
import './Leads.scss';
import Sidebar from '../Common/Sidebar';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { message, Spin, Button, Avatar, Empty, Modal, Form, Input } from 'antd';
import axios from 'axios';
import InputMask from "react-input-mask";

const Leads = () => {
    const [form] = Form.useForm();
    const [exchangeData, setExchangeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updating, setUpdating] = useState(false); // State for update button loading

    useEffect(() => {
        getExchangeUser();
    }, []);

    const getExchangeUser = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/exchange/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setExchangeData(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching exchanged users:", error);
            message.error("Failed to fetch exchanged users");
            setLoading(false);
        }
    };

    const deleteExchangeUser = (id) => {
        const accessToken = localStorage.getItem('accessToken');
        axios.delete(`${process.env.REACT_APP_BASE_API_URL}/exchange/${id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                console.log(response, "delete user resp")
                message.success("User Deleted Successfully");
                getExchangeUser(); // Refresh data after deletion
            })
            .catch(error => console.log("error", error));
    };

    const onFinish = async (values) => {
        try {
            setUpdating(true); // Show loading indicator on update button
            const accessToken = localStorage.getItem('accessToken');
            await axios.put(`${process.env.REACT_APP_BASE_API_URL}/exchange/${selectedUser.id}/`, values, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setIsModalVisible(false);
            message.success("User updated successfully");
            getExchangeUser(); // Refresh data after update
        } catch (error) {
            console.error("Error updating exchanged user:", error);
            message.error("Failed to update exchanged user");
        } finally {
            setUpdating(false); // Hide loading indicator on update button
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
        form.setFieldsValue(user); // Set form fields value with selected user data
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields(); // Reset form fields on cancel
    };

    const handleDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to delete this user?',
            onOk() {
                deleteExchangeUser(id);
            },
            onCancel() {
                console.log('Deletion canceled');
            },
            okText: 'Yes', // Update OK button text
            cancelText: 'No', // Update Cancel button text
        });
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className='leads'>
            <Sidebar />
            <div className='leads-content'>
                <div className='leads-header'>
                    <div style={{ padding: "20px", color: "white" }}>
                        <h2>Leads
                            <span style={{ fontSize: "15px", padding: "4px" }}>
                                {loading ? "" : (exchangeData && `(${exchangeData?.length})`)}
                            </span>
                        </h2>
                    </div>
                </div>
                <div className="table-container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px', marginTop: "20px" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Company Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Owner Name</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exchangeData.length > 0 ? (
                                    exchangeData.map((user, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Avatar size="small" style={{ backgroundColor: getRandomColor(), padding: "20px", marginRight: "10px", fontSize: "15px" }}> {`${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}`}</Avatar>
                                                {`${user.first_name} ${user.last_name}`.slice(0, 15)}
                                            </td>
                                            <td>{user.company_name && user.company_name.length > 15 ? user.company_name.substring(0, 15) + '...' : user.company_name}</td>
                                            <td>{user.phone_number}</td>
                                            <td>{user.email && user.email.length > 20 ? user.email.substring(0, 20) + '...' : user.email}</td>
                                            <td>{user.owner}</td>
                                            <td>
                                                {
                                                    (() => {
                                                        const date = new Date(user.created_at);
                                                        return `${date.toLocaleDateString()}`;
                                                    })()
                                                }
                                            </td>
                                            <td>
                                                <div className="Actions-btns ">
                                                    <Button className="Edit-button" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(user)} />
                                                    <Button className="Delete-button" shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteConfirm(user.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" tyle={{ textAlign: 'center' }}>
                                            <Empty description="No users found" />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Modal
                layout="vertical"
                width={450}
                title="Update User"
                visible={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Update" // Update OK button text
                cancelText="Cancel" // Update Cancel button text
                confirmLoading={updating}> {/* Show loading indicator on OK button */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}>
                    <label htmlFor="first_name">First Name*</label>
                    <Form.Item name="first_name"
                        rules={[{ required: true, message: 'Please input your first name!' }]}>
                        <Input />
                    </Form.Item>
                    <label htmlFor="last_name">Last Name*</label>
                    <Form.Item name="last_name"
                        rules={[{ required: true, message: 'Please input your last name!' }]}>
                        <Input />
                    </Form.Item>
                    <label htmlFor="company name">Company Name*</label>
                    <Form.Item name="company_name"
                        rules={[{ required: true, message: 'Please input your company name!' }]} >
                        <Input disabled />
                    </Form.Item>
                    <label htmlFor="email">Email*</label>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Invalid email format',
                            },
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <label htmlFor="phone_number">Phone Number*</label>
                    <Form.Item name="phone_number"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a phone number',
                            },
                            {
                                pattern: /\+\d{2} \d{1,2} \d{2} \d{2} \d{2} \d{2}/,
                                message: 'Invalid phone number format',
                            },
                        ]}>
                        <InputMask
                            style={{
                                width: "95%",
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
        </div>
    );
}

export default Leads;
