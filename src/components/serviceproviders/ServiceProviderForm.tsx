import React, { useState, useEffect } from "react";
import { UserPlus, MapPin, Wrench, CheckCircle2, ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import submitServiceProvider from "../../firebase/submitServiceProvider";

const ServiceProviderForm = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
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
      icon: <CheckCircle2 size={24} />,
      title: "Verified Platform",
      description: "Join a trusted network that values licensed, professional electricians"
    }
  ];

  // Generate a simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

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
    setCaptchaError(false);
    setFormErrors({
      firstName: "",
      lastName: "",
      primaryContactNumber: "",
      email: "",
      serviceAreas: "",
    });
    generateCaptcha();
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

    // Validate the captcha
    const captchaInput = (e.target as HTMLFormElement).querySelector('input[name="captcha"]') as HTMLInputElement;
    if (captchaAnswer !== captchaInput?.value) {
      setCaptchaError(true);
      return;
    } else {
      setCaptchaError(false);
    }

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
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* Navigation Header */}
      <header
        style={{
          backgroundColor: '#1E3A8A',
          padding: '1rem 1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
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
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1E40AF, #1E3A8A)',
          color: '#fff',
          padding: '4rem 1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Circuit pattern background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circuit-providers" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M15 15 L45 15 L45 45 L15 45 Z" fill="none" stroke="#FFD300" strokeWidth="2" />
              <circle cx="15" cy="15" r="3" fill="#FFD300" />
              <circle cx="45" cy="45" r="3" fill="#FFD300" />
              <path d="M15 30 H35 V45" fill="none" stroke="#FFD300" strokeWidth="2" />
              <path d="M30 15 V35 H45" fill="none" stroke="#FFD300" strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit-providers)" />
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
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 1rem',
                backgroundColor: 'rgba(255, 211, 0, 0.2)',
                color: '#FFD300',
                fontWeight: '600',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 211, 0, 0.3)'
              }}
            >
              Service Providers
            </span>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontFamily: 'Electrolize, sans-serif',
                textTransform: 'uppercase'
              }}
            >
              Join Our Network
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}
            >
              Partner with us to grow your electrical contracting business.
              Connect with customers who need quality electrical services.
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
                  backgroundColor: 'rgba(30, 64, 175, 0.3)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFD300',
                    color: '#1E3A8A',
                    borderRadius: '9999px',
                    padding: '0.75rem',
                    width: '3.5rem',
                    height: '3.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {benefit.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontFamily: 'Electrolize, sans-serif'
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1E3A8A',
                marginBottom: '1rem',
                textAlign: 'center',
                fontFamily: 'Electrolize, sans-serif'
              }}
            >
              APPLICATION FORM
            </h2>

            {success && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#d1fae5',
                border: '1px solid #a7f3d0',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ color: '#065f46' }}>
                  Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.
                </span>
              </div>
            )}

            {error && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ color: '#991b1b', whiteSpace: 'pre-line' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* First Name */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${formErrors.firstName ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={values.firstName}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {formErrors.firstName && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${formErrors.lastName ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={values.lastName}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {formErrors.lastName && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.lastName}</p>
                )}
              </div>

              {/* Company Name */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  type="text"
                  name="companyName"
                  placeholder="Company Name (Optional)"
                  value={values.companyName}
                  onChange={handleChange}
                />
              </div>

              {/* Primary Contact Number */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${formErrors.primaryContactNumber ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  type="tel"
                  name="primaryContactNumber"
                  placeholder="Primary Contact Number *"
                  value={values.primaryContactNumber}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {formErrors.primaryContactNumber && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.primaryContactNumber}</p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${formErrors.email ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={values.email}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {formErrors.email && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.email}</p>
                )}
              </div>

              {/* Service Areas Dropdown */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Service Areas *
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setServiceAreasOpen(!serviceAreasOpen)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${formErrors.serviceAreas ? '#EF4444' : '#E5E7EB'}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ color: values.serviceAreas.length > 0 ? '#000' : '#9CA3AF' }}>
                      {values.serviceAreas.length > 0
                        ? `${values.serviceAreas.length} area${values.serviceAreas.length > 1 ? 's' : ''} selected`
                        : 'Select service areas'
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
                      backgroundColor: 'white',
                      border: '2px solid #E5E7EB',
                      borderTop: 'none',
                      borderRadius: '0 0 0.5rem 0.5rem',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      {availableServiceAreas.map((area) => (
                        <label
                          key={area}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f3f4f6'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          <input
                            type="checkbox"
                            checked={values.serviceAreas.includes(area)}
                            onChange={() => handleServiceAreaChange(area)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          <span style={{ fontSize: '0.875rem', color: '#000' }}>{area}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {formErrors.serviceAreas && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.serviceAreas}</p>
                )}
                {values.serviceAreas.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Selected areas:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {values.serviceAreas.map((area) => (
                        <span
                          key={area}
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#1E3A8A',
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px'
                          }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Simple Captcha */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#000' }}>Security Check:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ color: '#000' }}>
                    {captchaValue} = ?
                  </div>
                  <div>
                    <input
                      type="text"
                      name="captcha"
                      placeholder="Enter result"
                      required
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        padding: '0.5rem',
                        border: `2px solid ${captchaError ? '#EF4444' : '#E5E7EB'}`,
                        borderRadius: '0.5rem'
                      }}
                      onChange={() => captchaError && setCaptchaError(false)}
                    />
                    {captchaError && (
                      <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Incorrect answer, please try again
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    style={{
                      width: 'fit-content',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f3f4f6',
                      border: '2px solid #d1d5db',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Regenerate
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: sending ? '#E5E7EB' : '#FFD300',
                  color: sending ? '#9CA3AF' : '#1E3A8A',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  fontSize: '1rem'
                }}
              >
                {sending ? "SUBMITTING..." : "SUBMIT APPLICATION"}
              </button>
            </form>
          </div>
        </div>

        {/* Wave divider at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4rem',
            overflow: 'hidden'
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '5rem'
            }}
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="#F5F5F5"
            />
          </svg>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          backgroundColor: '#1E3A8A',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <p>© 2025. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServiceProviderForm;