import React from 'react';
import './Leads.scss';
import Sidebar from '../Common/Sidebar';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { message, Spin, Button, Modal, Avatar } from 'antd';

const Leads = () => {
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Function to get initials
    const getInitials = (name) => {
        const names = name.split(' ');
        return names[0][0].toUpperCase() + (names.length > 1 ? names[names.length - 1][0].toUpperCase() : '');
    };
    const fullName = 'John Doe'; // Example name

    return (
        <div className='leads'>
            <Sidebar />
            <div className='leads-content'>
                <div className='content-header'>
                    <div style={{ padding: "20px", color: "white" }}>
                        {<h2>Leads <span style={{ fontSize: "15px" }}>(4)</span></h2>}
                    </div>
                </div>
                <div className="table-container">
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
                            <tr>
                                <td>
                                    Jhone elix
                                </td>
                                <td>ABC Inc.</td>
                                <td>123-456-7890</td>
                                <td>john.doe@example.com</td>
                                <td>Jane Smith</td>
                                <td>2024-04-03</td>
                                <td><Button><EditOutlined /></Button> <Button><DeleteOutlined /></Button> </td>
                            </tr>
                            <tr>
                                <td>John Doe</td>
                                <td>ABC Inc.</td>
                                <td>123-456-7890</td>
                                <td>john.doe@example.com</td>
                                <td>Jane Smith</td>
                                <td>2024-04-03</td>
                                <td><Button><EditOutlined /></Button> <Button><DeleteOutlined /></Button> </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Leads;
