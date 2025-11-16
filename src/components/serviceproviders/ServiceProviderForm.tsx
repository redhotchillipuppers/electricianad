import React, { useState, useEffect } from "react";
import { UserPlus, MapPin, Wrench, CheckCircle, ArrowLeft, ChevronDown, Zap, AlertCircle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import submitServiceProvider from "../../firebase/submitServiceProvider";

const ServiceProviderForm = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [serviceAreasOpen, setServiceAreasOpen] = useState(false);

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    primaryContactNumber: "",
    email: "",
    serviceAreas: "",
  });

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    primaryContactNumber: "",
    email: "",
    serviceAreas: [] as string[],
  });

  // Service Areas - Based on your actual coverage areas
  const availableServiceAreas = [
    // Primary Service Areas
    "Grimsby",
    "Cleethorpes",
    "Lincoln",
    "Scunthorpe",
    "Louth",
    // Extended Coverage Areas
    "Boston",
    "Skegness",
    "Spalding",
    "Sleaford",
    "Gainsborough",
    "Market Rasen",
    "Horncastle",
    // Other
    "Other"
  ];

  const benefits = [
    {
      icon: <UserPlus size={24} />,
      title: "Grow Your Business",
      description: "Connect with customers actively seeking electrical services in your area"
    },
    {
      icon: <MapPin size={24} />,
      title: "Local Coverage",
      description: "Serve customers in your specific service areas and expand your reach"
    },
    {
      icon: <Wrench size={24} />,
      title: "Quality Projects",
      description: "Work on vetted projects with customers ready to hire qualified electricians"
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Verified Platform",
      description: "Join a trusted network that values licensed, professional electricians"
    }
  ];


  const validateField = (name: string, value: string | string[]) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        if (!value || (typeof value === 'string' && !value.trim())) {
          errorMessage = "First name is required";
        }
        break;
      case "lastName":
        if (!value || (typeof value === 'string' && !value.trim())) {
          errorMessage = "Last name is required";
        }
        break;
      case "email":
        if (!value || (typeof value === 'string' && !value.trim())) {
          errorMessage = "Email is required";
        } else if (typeof value === 'string' && !/^\S+@\S+\.\S+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "primaryContactNumber":
        if (!value || (typeof value === 'string' && !value.trim())) {
          errorMessage = "Primary contact number is required";
        } else if (typeof value === 'string' && !/^[0-9+\-() ]{6,20}$/.test(value)) {
          errorMessage = "Please enter a valid phone number";
        }
        break;
      case "serviceAreas":
        if (Array.isArray(value) && value.length === 0) {
          errorMessage = "Please select at least one service area";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear the error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleServiceAreaChange = (area: string) => {
    setValues(prev => {
      const newServiceAreas = prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area];

      // Clear service areas error if user selects at least one
      if (newServiceAreas.length > 0 && formErrors.serviceAreas) {
        setFormErrors(prevErrors => ({ ...prevErrors, serviceAreas: "" }));
      }

      return { ...prev, serviceAreas: newServiceAreas };
    });
  };

  const resetForm = () => {
    setValues({
      firstName: "",
      lastName: "",
      companyName: "",
      primaryContactNumber: "",
      email: "",
      serviceAreas: [],
    });
    setFormErrors({
      firstName: "",
      lastName: "",
      primaryContactNumber: "",
      email: "",
      serviceAreas: "",
    });
  };

  const validateForm = (formData: typeof values) => {
    const errors: string[] = [];

    // Required field validation
    if (!formData.firstName?.trim()) errors.push('First name is required');
    if (!formData.lastName?.trim()) errors.push('Last name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.primaryContactNumber?.trim()) errors.push('Primary contact number is required');
    if (!formData.serviceAreas?.length) errors.push('At least one service area is required');

    // Length validation
    if (formData.firstName && formData.firstName.length > 50) errors.push('First name too long (max 50 characters)');
    if (formData.lastName && formData.lastName.length > 50) errors.push('Last name too long (max 50 characters)');
    if (formData.companyName && formData.companyName.length > 100) errors.push('Company name too long (max 100 characters)');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) errors.push('Invalid email format');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Use the enhanced validation function
    const errors = validateForm(values);
    if (errors.length > 0) {
      setError('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setSending(true);
    setSuccess(false);

    try {
      await submitServiceProvider(values);
      setSuccess(true);
      resetForm();
    } catch (err) {
      console.error("Service provider form submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f23' }}>
      {/* Navigation Header */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          padding: '1rem 1.5rem',
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
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#FFD300',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <Link
            to="/provider-login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
              color: '#1a1a2e',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(255, 211, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 211, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 211, 0, 0.2)';
            }}
          >
            <LogIn size={18} />
            Provider Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          color: '#fff',
          padding: '4rem 1.5rem',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        {/* Enhanced geometric background */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-providers-modern" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Main circuit structure */}
                <path d="M25 25 L75 25 L75 75 L25 75 Z" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.5" />
                <path d="M0 50 L25 50" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
                <path d="M75 50 L100 50" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
                <path d="M50 0 L50 25" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
                <path d="M50 75 L50 100" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
                
                {/* Connection points */}
                <circle cx="25" cy="25" r="3" fill="#FFD300" opacity="0.8" />
                <circle cx="75" cy="75" r="3" fill="#667eea" opacity="0.6" />
                <circle cx="75" cy="25" r="2" fill="#8b9aef" opacity="0.5" />
                <circle cx="25" cy="75" r="2" fill="#8b9aef" opacity="0.5" />
                
                {/* Internal pathways */}
                <path d="M25 50 H50 V75" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
                <path d="M50 25 V50 H75" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
                
                {/* Detail elements */}
                <rect x="40" y="40" width="20" height="20" fill="none" stroke="#667eea" strokeWidth="1" opacity="0.3" />
                <circle cx="35" cy="35" r="1.5" fill="#8b9aef" opacity="0.4" />
                <circle cx="65" cy="65" r="1.5" fill="#8b9aef" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-providers-modern)" />
          </svg>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                background: 'rgba(255, 211, 0, 0.1)',
                border: '1px solid rgba(255, 211, 0, 0.3)',
                borderRadius: '50px',
                color: '#FFD300',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem'
              }}
            >
              Service Provider Network
            </div>
            
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '800',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #8b9aef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2'
              }}
            >
              JOIN OUR NETWORK
            </h1>
            
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}
            >
              Partner with us to grow your electrical contracting business. Connect with customers who need quality electrical services.
            </p>
          </div>

          {/* Benefits Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
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
                <div
                  style={{
                    background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                    color: '#1a1a2e',
                    borderRadius: '50%',
                    padding: '1rem',
                    width: '4rem',
                    height: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 10px 25px rgba(255, 211, 0, 0.3)'
                  }}
                >
                  {benefit.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: '#8b9aef'
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%)',
          color: '#fff',
          padding: '6rem 1.5rem',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        {/* Circuit background for form section */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-form-modern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M20 20 L60 20 L60 60 L20 60 Z" fill="none" stroke="#667eea" strokeWidth="1.5" opacity="0.4" />
                <circle cx="20" cy="20" r="2" fill="#FFD300" opacity="0.6" />
                <circle cx="60" cy="60" r="2" fill="#8b9aef" opacity="0.5" />
                <path d="M20 40 H40 V60" fill="none" stroke="#FFD300" strokeWidth="1" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-form-modern)" />
          </svg>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '50px',
                color: '#8b9aef',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem'
              }}
            >
              Application Form
            </div>
            
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: '800',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #8b9aef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2'
              }}
            >
              START YOUR PARTNERSHIP
            </h2>
            
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '500px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}
            >
              Fill out the form below and we'll review your application to join our trusted network.
            </p>
          </div>

          {/* Main Form Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Form header icon */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b9aef 0%, #667eea 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(139, 154, 239, 0.3)'
            }}>
              <UserPlus size={20} style={{ color: '#fff' }} />
            </div>

            {/* Success Message */}
            {success && (
              <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <CheckCircle size={24} style={{ color: '#10b981' }} />
                <div>
                  <h4 style={{ color: '#10b981', margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                    Application Submitted!
                  </h4>
                  <p style={{ color: 'rgba(16, 185, 129, 0.8)', margin: 0, fontSize: '0.875rem' }}>
                    Thank you! We'll review your application and get back to you soon.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <AlertCircle size={24} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ color: '#ef4444', margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                    Please Fix These Issues:
                  </h4>
                  <pre style={{ 
                    color: 'rgba(239, 68, 68, 0.8)', 
                    margin: 0, 
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-line',
                    fontFamily: 'inherit'
                  }}>
                    {error}
                  </pre>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Personal Information Section */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  color: '#8b9aef',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  👤 Personal Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div>
                    <input
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${formErrors.firstName ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      value={values.firstName}
                      required
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = formErrors.firstName ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        handleBlur(e);
                      }}
                    />
                    {formErrors.firstName && (
                      <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${formErrors.lastName ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      type="text"
                      name="lastName"
                      placeholder="Last Name *"
                      value={values.lastName}
                      required
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = formErrors.lastName ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        handleBlur(e);
                      }}
                    />
                    {formErrors.lastName && (
                      <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <input
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      type="text"
                      name="companyName"
                      placeholder="Company Name (Optional)"
                      value={values.companyName}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  color: '#8b9aef',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📞 Contact Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div>
                    <input
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${formErrors.primaryContactNumber ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      type="tel"
                      name="primaryContactNumber"
                      placeholder="Primary Contact Number *"
                      value={values.primaryContactNumber}
                      required
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = formErrors.primaryContactNumber ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        handleBlur(e);
                      }}
                    />
                    {formErrors.primaryContactNumber && (
                      <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                        {formErrors.primaryContactNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${formErrors.email ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={values.email}
                      required
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = formErrors.email ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        handleBlur(e);
                      }}
                    />
                    {formErrors.email && (
                      <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Areas Section */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  color: '#8b9aef',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📍 Service Areas
                </h3>
                
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setServiceAreasOpen(!serviceAreasOpen)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formErrors.serviceAreas ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <span style={{ color: values.serviceAreas.length > 0 ? '#fff' : 'rgba(255, 255, 255, 0.4)' }}>
                      {values.serviceAreas.length > 0
                        ? `${values.serviceAreas.length} area${values.serviceAreas.length > 1 ? 's' : ''} selected`
                        : 'Select service areas *'
                      }
                    </span>
                    <ChevronDown size={16} style={{
                      transform: serviceAreasOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }} />
                  </button>

                  {serviceAreasOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                    }}>
                      {availableServiceAreas.map((area) => (
                        <label
                          key={area}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#1a1a2e',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 154, 239, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <input
                            type="checkbox"
                            checked={values.serviceAreas.includes(area)}
                            onChange={() => handleServiceAreaChange(area)}
                            style={{ 
                              marginRight: '0.75rem',
                              accentColor: '#667eea',
                              transform: 'scale(1.1)'
                            }}
                          />
                          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{area}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {formErrors.serviceAreas && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                    {formErrors.serviceAreas}
                  </p>
                )}
                
                {values.serviceAreas.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                      Selected areas:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {values.serviceAreas.map((area) => (
                        <span
                          key={area}
                          style={{
                            fontSize: '0.875rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #8b9aef 100%)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontWeight: '500'
                          }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                style={{
                  width: '100%',
                  padding: '1.25rem 2rem',
                  background: sending 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'linear-gradient(135deg, #8b9aef 0%, #667eea 100%)',
                  color: sending ? 'rgba(255, 255, 255, 0.5)' : '#fff',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  fontSize: '1.125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease',
                  boxShadow: sending ? 'none' : '0 10px 30px rgba(139, 154, 239, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                onMouseOver={(e) => {
                  if (!sending) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 154, 239, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!sending) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 154, 239, 0.3)';
                  }
                }}
              >
                {sending ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application
                    <UserPlus size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Modern wave divider */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6rem',
          overflow: 'hidden'
        }}>
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '8rem'
            }}
          >
            <defs>
              <linearGradient id="waveGradientProvider" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
                <stop offset="100%" stopColor="#F5F5F5" />
              </linearGradient>
            </defs>
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="url(#waveGradientProvider)"
            />
          </svg>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder,
          textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
          
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
            -webkit-text-fill-color: white;
            transition: background-color 5000s ease-in-out 0s;
          }
          
          /* Custom scrollbar for dropdown */
          div[style*="overflowY: auto"]::-webkit-scrollbar {
            width: 6px;
          }
          
          div[style*="overflowY: auto"]::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          
          div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
            background: rgba(139, 154, 239, 0.5);
            border-radius: 3px;
          }
          
          div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 154, 239, 0.7);
          }
          
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <p style={{ margin: 0 }}>© 2025. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServiceProviderForm;