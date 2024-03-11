import React, { useState } from 'react';
import { Layout, Card, Button, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './UserSetting.scss';
const { Header } = Layout;

const UserSetting = () => {
    return (
        <>
            <div className='setting-main-layout'>
                <div className='setting-custom-card'>
                    <h2 className='setting-heading'>Setting</h2>
                    <div className='setting-tab-container'>
                        <button type='primary'
                            className={'button-style active-button-style'}
                        >
                            Profile
                        </button>
                    </div>
                    <div className="setting-tab-content">
                        <form className="setting-profile-form">
                            <Input type="email" id="signupEmail" className="setting-form-input" placeholder="Your email" />
                            <Input id="signupUsername" className="setting-form-input" placeholder="Your username" />
                            <Input.Password id="signupPassword" className="setting-form-input" placeholder="Password" />
                            <Input.Password id="confirmPassword" className="setting-form-input" placeholder="Confirm Password" />
                            <button type="primary" htmlType="submit" className="setting-form-button">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default UserSetting