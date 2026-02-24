import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';

const ProtectedRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setValidUser(false);
      setLoading(false);
    } else {
      setValidUser(true);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return validUser ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
