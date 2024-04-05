import React, { useState, useEffect } from 'react';
import './Leads.scss';
import Sidebar from '../Common/Sidebar';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { message, Spin, Button, Avatar } from 'antd';
import axios from 'axios';

const Leads = () => {
    const [exchangeData, setExchangeData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getExchangeUser = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('http://smart-connect.eu-west-3.elasticbeanstalk.com/api/exchange/', {
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

    useEffect(() => {
        getExchangeUser();
    }, []);

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
                        <h2>Leads <span style={{ fontSize: "15px" }}>(4)</span></h2>
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
                                                {user.first_name + " " + user.last_name}
                                            </td>
                                            <td>{user.company_name && user.company_name.length > 15 ? user.company_name.substring(0, 15) + '...' : user.company_name}</td>
                                            <td>{user.phone_number}</td>
                                            <td>{user.email && user.email.length > 20 ? user.email.substring(0, 20) + '...' : user.email}</td>
                                            <td>owner name </td>
                                            <td>date</td>
                                            <td>
                                                <div className="Actions-btns ">
                                                    <Button className="Edit-button" shape="circle" icon={<EditOutlined />} />
                                                    <Button className="Delete-button" shape="circle" icon={<DeleteOutlined />} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>No data found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leads;
