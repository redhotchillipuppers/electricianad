import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Zap, CheckCircle } from 'lucide-react';
import ProviderLogin from '../components/ProviderLogin';
import { onProviderAuthStateChanged, signOutProvider, ProviderUser } from '../utils/providerAuth';

const ProviderPanel: React.FC = () => {
  const [user, setUser] = useState<ProviderUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onProviderAuthStateChanged((providerUser) => {
      setUser(providerUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setLoading(true);
  };

  const handleSignOut = async () => {
    try {
      await signOutProvider();
      navigate('/providers');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          color: '#fff'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 211, 0, 0.3)',
              borderTop: '4px solid #FFD300',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <ProviderLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(255, 211, 0, 0.3)'
              }}
            >
              <Zap size={24} color="#1a1a2e" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Provider Dashboard</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Welcome, {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '3rem 2rem'
        }}
      >
        {/* Welcome Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
              borderRadius: '50%',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(255, 211, 0, 0.3)'
            }}
          >
            <CheckCircle size={40} color="#1a1a2e" />
          </div>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #FFD300 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome to Your Provider Dashboard
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Your dashboard is currently being set up. You'll soon be able to manage quotes, view customer requests, and update your profile here.
          </p>
        </div>

        {/* Coming Soon Features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {['View Quote Requests', 'Manage Your Profile', 'Track Your Jobs', 'Communication Tools'].map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#FFD300'
                }}
              >
                {feature}
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.875rem',
                  margin: 0
                }}
              >
                Coming soon
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '4rem'
        }}
      >
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.875rem' }}>
          © 2025. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ProviderPanel;
