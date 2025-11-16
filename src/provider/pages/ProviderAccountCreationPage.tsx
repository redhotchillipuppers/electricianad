import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderAccountCreation from '../components/ProviderAccountCreation';

const ProviderAccountCreationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirect to provider login after successful account creation
    navigate('/provider-login');
  };

  return <ProviderAccountCreation onSuccess={handleSuccess} />;
};

export default ProviderAccountCreationPage;
