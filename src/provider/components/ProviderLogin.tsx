import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { signInProvider } from '../utils/providerAuth';

interface ProviderLoginProps {
  onLoginSuccess: () => void;
}

const ProviderLogin: React.FC<ProviderLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInProvider(email, password);
      // Small delay to ensure auth state propagates
      setTimeout(() => {
        onLoginSuccess();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A2A0A 100%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD300' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: 'none'
          }}
        />

        {/* Login Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 211, 0, 0.2)',
            borderRadius: '20px',
            padding: '3rem',
            width: '100%',
            maxWidth: '420px',
            minWidth: '320px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1,
            boxSizing: 'border-box'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #FFD300 0%, #FFA500 100%)',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 30px rgba(255, 211, 0, 0.3)'
              }}
            >
              <Zap size={28} color="#000" />
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem',
                letterSpacing: '-0.025em',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Provider Portal
            </h1>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.95rem',
                fontWeight: '400',
                margin: '0',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Access your service dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <AlertCircle size={18} color="#ef4444" />
              <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.025em'
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 211, 0, 0.6)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 211, 0, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 211, 0, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 211, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 211, 0, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="provider@yourcompany.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.025em'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 211, 0, 0.6)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 211, 0, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 211, 0, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 211, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 211, 0, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 211, 0, 0.6)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 211, 0, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 211, 0, 0.6)'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'linear-gradient(135deg, #FFD300 0%, #FFA500 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 10px 30px rgba(255, 211, 0, 0.3)',
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
                opacity: loading ? 0.7 : 1,
                boxSizing: 'border-box',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 211, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 211, 0, 0.3)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0, 0, 0, 0.3)',
                      borderTop: '2px solid #000',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  Authenticating...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 211, 0, 0.1)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.8rem',
                margin: '0',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Secure provider access
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
          -webkit-text-fill-color: white;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </>
  );
};

export default ProviderLogin;
