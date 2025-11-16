import React, { useState, useEffect } from 'react';
import { LogOut, User, Briefcase, ClipboardList, CheckCircle, Clock, Zap } from 'lucide-react';
import { signOutProvider } from '../utils/providerAuth';
import { getFirebase, auth } from '../../firebase/firebase';

const ProviderDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const { auth } = getFirebase();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email || '');
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOutProvider();
      window.location.href = '/provider-login';
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 211, 0, 0.2)',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #FFD300 0%, #FFA500 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Zap size={24} color="#000" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                margin: 0
              }}
            >
              Provider Dashboard
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 211, 0, 0.8)',
                margin: '0.25rem 0 0 0'
              }}
            >
              {userEmail}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 211, 0, 0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.2)';
            }
          }}
        >
          <LogOut size={18} />
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 211, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 211, 0, 0.2)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 0.5rem 0'
            }}
          >
            Welcome to Your Provider Portal
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}
          >
            Manage your electrical services, view job requests, and track your business performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {/* Active Jobs */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 211, 0, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 211, 0, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.2)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(255, 211, 0, 0.1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Clock size={24} color="#FFD300" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Active Jobs
                </p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: '0.25rem 0 0 0' }}>
                  0
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>
              Currently in progress
            </p>
          </div>

          {/* Completed Jobs */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 211, 0, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 211, 0, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.2)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle size={24} color="#22c55e" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Completed Jobs
                </p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: '0.25rem 0 0 0' }}>
                  0
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>
              Total completed
            </p>
          </div>

          {/* Pending Requests */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 211, 0, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 211, 0, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.2)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ClipboardList size={24} color="#3b82f6" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                  Pending Requests
                </p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: '0.25rem 0 0 0' }}>
                  0
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>
              Awaiting response
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 211, 0, 0.2)',
            borderRadius: '16px',
            padding: '2rem'
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
              margin: '0 0 1.5rem 0'
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              style={{
                padding: '1rem',
                background: 'rgba(255, 211, 0, 0.1)',
                border: '1px solid rgba(255, 211, 0, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 211, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Job Requests
            </button>
            <button
              style={{
                padding: '1rem',
                background: 'rgba(255, 211, 0, 0.1)',
                border: '1px solid rgba(255, 211, 0, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 211, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Update Profile
            </button>
            <button
              style={{
                padding: '1rem',
                background: 'rgba(255, 211, 0, 0.1)',
                border: '1px solid rgba(255, 211, 0, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 211, 0, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Calendar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
