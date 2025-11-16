import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, Zap, AlertCircle, CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkEmailApproved, checkProviderAccountExists, createProviderAccount } from '../utils/providerAuth';

interface ProviderAccountCreationProps {
  onSuccess?: () => void;
}

type PasswordStrength = 'weak' | 'fair' | 'strong';

const ProviderAccountCreation: React.FC<ProviderAccountCreationProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Email validation states
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailApproved, setEmailApproved] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [providerName, setProviderName] = useState('');

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Validate email in real-time
  useEffect(() => {
    const validateEmail = async () => {
      if (!email || email.length < 5) {
        setEmailApproved(false);
        setAccountExists(false);
        setProviderName('');
        return;
      }

      setEmailValidating(true);
      setError('');

      try {
        // Check if email is approved
        const approvedProvider = await checkEmailApproved(email);

        if (approvedProvider) {
          setEmailApproved(true);
          setProviderName(`${approvedProvider.firstName} ${approvedProvider.lastName}`);

          // Check if account already exists
          const exists = await checkProviderAccountExists(email);
          setAccountExists(exists);
        } else {
          setEmailApproved(false);
          setAccountExists(false);
          setProviderName('');
        }
      } catch (err) {
        console.error('Email validation error:', err);
      } finally {
        setEmailValidating(false);
      }
    };

    const debounceTimer = setTimeout(validateEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [email]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('weak');
      return;
    }

    let strength: PasswordStrength = 'weak';
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

    if (score >= 4) {
      strength = 'strong';
    } else if (score >= 2) {
      strength = 'fair';
    }

    setPasswordStrength(strength);
  }, [password]);

  // Check if passwords match
  useEffect(() => {
    setPasswordsMatch(password.length > 0 && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!emailApproved) {
      setError('Email not approved. Please apply first.');
      return;
    }

    if (accountExists) {
      setError('An account with this email already exists. Please try logging in instead.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await createProviderAccount(email, password);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/provider-login');
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account creation failed');
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'strong':
        return '#10b981';
      case 'fair':
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  };

  const getStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case 'strong':
        return 'Strong';
      case 'fair':
        return 'Fair';
      default:
        return 'Weak';
    }
  };

  if (success) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '3rem',
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <CheckCircle size={32} color="white" />
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem',
              margin: '0 0 1rem 0'
            }}
          >
            Account Created!
          </h2>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.95rem',
              margin: '0 0 1.5rem 0'
            }}
          >
            Your provider account has been created successfully. Redirecting to login...
          </p>

          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
      </div>
    );
  }

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
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          boxSizing: 'border-box',
          fontFamily: 'Inter, system-ui, sans-serif',
          overflowY: 'auto'
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: 'none'
          }}
        />

        {/* Account Creation Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '3rem',
            width: '100%',
            maxWidth: '480px',
            minWidth: '320px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1,
            boxSizing: 'border-box',
            margin: '2rem auto'
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate('/provider-login')}
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            <ArrowLeft size={18} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Zap size={28} color="white" />
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
              Create Provider Account
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
              Set up your service provider account
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

          {/* Account Creation Form */}
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
                    color: 'rgba(255, 255, 255, 0.4)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      emailValidating
                        ? 'rgba(255, 211, 0, 0.3)'
                        : emailApproved
                        ? accountExists
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(16, 185, 129, 0.3)'
                        : email.length > 0
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="your.email@example.com"
                />
                {emailValidating && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 211, 0, 0.3)',
                      borderTop: '2px solid #FFD300',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                )}
                {!emailValidating && email.length > 0 && (
                  emailApproved ? (
                    accountExists ? (
                      <XCircle
                        size={18}
                        color="#ef4444"
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                    ) : (
                      <CheckCircle
                        size={18}
                        color="#10b981"
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                    )
                  ) : (
                    <XCircle
                      size={18}
                      color="#ef4444"
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                  )
                )}
              </div>
              {/* Email validation feedback */}
              {!emailValidating && email.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  {emailApproved ? (
                    accountExists ? (
                      <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: 0 }}>
                        Account already exists for this email
                      </p>
                    ) : (
                      <p style={{ color: '#6ee7b7', fontSize: '0.8rem', margin: 0 }}>
                        ✓ Approved: {providerName}
                      </p>
                    )
                  ) : (
                    <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: 0 }}>
                      Email not approved.{' '}
                      <span
                        onClick={() => navigate('/providers')}
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Apply first
                      </span>
                    </p>
                  )}
                </div>
              )}
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
                    color: 'rgba(255, 255, 255, 0.4)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                      Password strength:
                    </span>
                    <span style={{ color: getStrengthColor(passwordStrength), fontSize: '0.8rem', fontWeight: '600' }}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'fair' ? '66%' : '33%',
                        height: '100%',
                        background: getStrengthColor(passwordStrength),
                        transition: 'all 0.3s ease',
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
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
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  {passwordsMatch ? (
                    <p style={{ color: '#6ee7b7', fontSize: '0.8rem', margin: 0 }}>
                      ✓ Passwords match
                    </p>
                  ) : (
                    <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: 0 }}>
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading || !emailApproved || accountExists || !passwordsMatch || password.length < 6}
              style={{
                width: '100%',
                padding: '1rem',
                background:
                  loading || !emailApproved || accountExists || !passwordsMatch || password.length < 6
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading || !emailApproved || accountExists || !passwordsMatch || password.length < 6 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow:
                  loading || !emailApproved || accountExists || !passwordsMatch || password.length < 6
                    ? 'none'
                    : '0 10px 30px rgba(102, 126, 234, 0.3)',
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
                opacity: loading || !emailApproved || accountExists || !passwordsMatch || password.length < 6 ? 0.5 : 1,
                boxSizing: 'border-box',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (!loading && emailApproved && !accountExists && passwordsMatch && password.length >= 6) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && emailApproved && !accountExists && passwordsMatch && password.length >= 6) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Already have an account?{' '}
              <span
                onClick={() => navigate('/provider-login')}
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#764ba2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#667eea';
                }}
              >
                Login
              </span>
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
                margin: '0',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Not approved yet?{' '}
              <span
                onClick={() => navigate('/providers')}
                style={{
                  color: '#FFD300',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E6C000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#FFD300';
                }}
              >
                Apply First
              </span>
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

export default ProviderAccountCreation;
