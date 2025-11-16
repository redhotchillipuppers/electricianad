import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderLogin from '../components/ProviderLogin';

const ProviderLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/provider-dashboard');
  };

  return <ProviderLogin onLoginSuccess={handleLoginSuccess} />;
};

export default ProviderLoginPage;
