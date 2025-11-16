import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onProviderAuthStateChanged, ProviderUser } from '../utils/providerAuth';

interface ProtectedProviderRouteProps {
  children: React.ReactNode;
}

const ProtectedProviderRoute: React.FC<ProtectedProviderRouteProps> = ({ children }) => {
  const [user, setUser] = useState<ProviderUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onProviderAuthStateChanged((providerUser) => {
      setUser(providerUser);
      setLoading(false);
    });

    // Backup timer - if still loading after 3 seconds, refresh page
    const timer = setTimeout(() => {
      if (loading) {
        console.log('Auth verification taking too long, refreshing...');
        window.location.reload();
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [loading]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
            Verifying credentials...
          </p>
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

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/provider-login" replace />;
  }

  // Authenticated - show provider content
  return <>{children}</>;
};

export default ProtectedProviderRoute;
