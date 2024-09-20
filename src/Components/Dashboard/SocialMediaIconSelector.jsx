import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';

const SocialMediaIconSelector = ({ icons, selectedIcon, onIconSelect }) => {
    const menu = (
        <Menu>
            {icons.map((icon, index) => (
                <Menu.Item key={index} onClick={() => onIconSelect(icon)}>
                    <img src={icon} alt={`Icon ${index + 1}`} style={{ width: '30px', height: '30px' }} />
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <div>
                <img src={selectedIcon || icons[0]} alt="Selected Icon" style={{ width: '30px', height: '30px', cursor: 'pointer', marginLeft: '5px' }} />
            </div>
        </Dropdown>
    );
};

export default SocialMediaIconSelector;
