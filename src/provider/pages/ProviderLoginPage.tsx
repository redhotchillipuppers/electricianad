import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderLogin from '../components/ProviderLogin';

const ProviderLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // TODO: Navigate to provider dashboard when implemented
    // For now, navigate back to provider application page
    navigate('/providers');
  };

  return <ProviderLogin onLoginSuccess={handleLoginSuccess} />;
};

export default ProviderLoginPage;
