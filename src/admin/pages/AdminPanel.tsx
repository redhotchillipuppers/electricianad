import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../components/AdminDashboard';

const AdminPanel: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminPanel;