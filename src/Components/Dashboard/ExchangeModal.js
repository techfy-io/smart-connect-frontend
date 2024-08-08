import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import InputMask from "react-input-mask";
import './ExchangeModal.scss'; // Import your CSS file

const ExchangeModal = ({ open, onClose, onSubmit, loading }) => {
    const { t } = useTranslation('translation');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCancel = () => {
        onClose();
        // Reset fields if necessary
        setFirstName('');
        setLastName('');
        setCompany('');
        setEmail('');
        setPhoneNumber('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {
            first_name: firstName,
            last_name: lastName,
            company,
            email,
            phone_number: phoneNumber,
        };
        onSubmit(values);
    };

    return (
        <Modal
            title={t("Exchange")}
            open={open}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    {t("Cancel")}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                >
                    {t("Submit")}
                </Button>,
            ]}
        >
            <form onSubmit={handleSubmit} className="exchange-form">
                <div className="form-item">
                    <label>{`${t("First Name")}*`}</label>
                    <input
                        type="text"
                        maxLength={30}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                        autoComplete="given-name"
                        className="form-input"
                    />
                </div>
                <div className="form-item">
                    <label>{`${t("Last Name")}*`}</label>
                    <input
                        type="text"
                        maxLength={30}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                        autoComplete="family-name"
                        className="form-input"
                    />
                </div>
                <div className="form-item">
                    <label>{t("Company Name")}</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)} 
                        autoComplete="organization" 
                        className="form-input"
                    />
                </div>
                <div className="form-item">
                    <label>{`${t("Email")}*`}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        autoComplete="email"
                        className="form-input"
                    />
                </div>
                <div className="form-item">
                    <label>{`${t("Phone")}*`}</label>
                    {/* <InputMask
                        mask="+33 9 99 99 99 99"
                        maskChar=""
                        placeholder="+33 1 23 45 67 89"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                        autoComplete="tel"
                        className="form-input"
                    /> */}
                     <input
                        type="phone"
                        placeholder="+33 1 23 45 67 89"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                        autoComplete="phone"
                        className="form-input"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default ExchangeModal;
