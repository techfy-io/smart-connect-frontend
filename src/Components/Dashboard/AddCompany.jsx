import React from 'react'
import { Modal, Form, Input, Button } from 'antd'; // Import Form, Input, Button from antd

const AddCompany = ({ openAddcompanymodal, toggleAddCompanyModal }) => { // Destructure props
    const [form] = Form.useForm();

    const handleCancel = () => {
        toggleAddCompanyModal();
        form.resetFields();
    };

    return (
        <Modal
            title="Add Company"
            visible={openAddcompanymodal}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                name="exchangeForm"
                form={form}

            // onFinish={onFinish}
            >
                <label htmlFor="firstname">First Name*</label>
                <Form.Item
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="lastname">Last Name*</label>
                <Form.Item
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="companyname">Company Name*</label>
                <Form.Item
                    name="companyName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your company name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="email">Email*</label>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not a valid email!',
                        },
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <label htmlFor="phone">Phone</label>
                <Form.Item
                    name="phone"
                >
                    <Input />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: "#ff8000" }}>
                        Add Company
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddCompany