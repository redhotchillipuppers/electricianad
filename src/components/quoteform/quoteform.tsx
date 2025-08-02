import React, { useState, useEffect } from "react";
import { Upload, CheckCircle, AlertCircle, Zap, RefreshCw } from "lucide-react";

// ↓— swap this with your real Firebase helper
import submitQuote from "../../firebase/submitQuote";

const QuoteForm = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    houseFlatNumber: "",
    streetName: "",
    postcode: "",
  });

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    file: null,
    contactMethod: "email", // Default contact method
    houseFlatNumber: "",
    streetName: "",
    postcode: "",
  });

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

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMessage = "Name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMessage = "Phone number is required";
        } else if (!/^[0-9+\-() ]{6,20}$/.test(value)) {
          errorMessage = "Please enter a valid phone number";
        }
        break;
      case "description":
        if (!value.trim()) {
          errorMessage = "Description is required";
        } else if (value.trim().split(/\s+/).length < 10) {
          errorMessage = "Please provide at least 10 words, be as detailed as possible";
        }
        break;
      case "houseFlatNumber":
        if (!value.trim()) {
          errorMessage = "House/Flat number is required";
        }
        break;
      case "streetName":
        if (!value.trim()) {
          errorMessage = "Street name is required";
        }
        break;
      case "postcode":
        if (!value.trim()) {
          errorMessage = "Postcode is required";
        } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(value)) {
          errorMessage = "Please enter a valid UK postcode";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear the error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Please select a file under 10MB.");
        return;
      }
      // Reset error if it was related to file
      if (error && error.includes("file")) {
        setError(null);
      }
    }
    setValues((prev) => ({ ...prev, file }));
  };

  const handleContactMethodChange = (method) => {
    setValues((prev) => ({ ...prev, contactMethod: method }));
  };

  const resetForm = () => {
    setValues({
      name: "",
      email: "",
      phone: "",
      description: "",
      file: null,
      contactMethod: "email",
      houseFlatNumber: "",
      streetName: "",
      postcode: "",
    });
    setCaptchaError(false);
    setFormErrors({
      name: "",
      email: "",
      phone: "",
      description: "",
      houseFlatNumber: "",
      streetName: "",
      postcode: "",
    });
    generateCaptcha(); // Generate a new captcha after form reset
  };

  // Add this validation function in your QuoteForm component
  const validateForm = (formData) => {
    const errors: string[] = [];
    
    // Required field validation
    if (!formData.name?.trim()) errors.push('Name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.contactMethod) errors.push('Contact method is required');
    if (!formData.houseFlatNumber?.trim()) errors.push('House/Flat number is required');
    if (!formData.streetName?.trim()) errors.push('Street name is required');
    if (!formData.postcode?.trim()) errors.push('Postcode is required');
    
    // Length validation
    if (formData.name && formData.name.length > 100) errors.push('Name too long (max 100 characters)');
    if (formData.description && formData.description.length > 2000) errors.push('Description too long (max 2000 characters)');
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) errors.push('Invalid email format');
    
    // File validation
    if (formData.file) {
      const allowedTypes = ['image/', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const isValidType = allowedTypes.some(type => formData.file.type.startsWith(type) || formData.file.type === type);
      
      if (!isValidType) errors.push('Invalid file type. Please use images, PDF, text, or Word documents.');
      if (formData.file.size > 10 * 1024 * 1024) errors.push('File too large. Maximum size is 10MB.');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate the captcha
    if (captchaAnswer !== e.currentTarget.querySelector('input[name="captcha"]')?.value) {
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
      await submitQuote(values);
      setSuccess(true);
      resetForm();
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="quote-form"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#fff',
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
            <pattern id="circuit-quote-modern" width="100" height="100" patternUnits="userSpaceOnUse">
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
          <rect width="100%" height="100%" fill="url(#circuit-quote-modern)" />
        </svg>
      </div>
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
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
            Get Your Quote
          </div>
          
          <h2
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
            REQUEST A FREE QUOTE
          </h2>
          
          <p
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Tell us about your electrical project and get a transparent, no-obligation quote within 2 hours.
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
            background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(255, 211, 0, 0.3)'
          }}>
            <Zap size={20} style={{ color: '#1a1a2e' }} />
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
                  Quote Request Submitted!
                </h4>
                <p style={{ color: 'rgba(16, 185, 129, 0.8)', margin: 0, fontSize: '0.875rem' }}>
                  Thanks! We'll get back to you within 2 hours with your free quote.
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
                📋 Contact Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <input
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formErrors.name ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={values.name}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formErrors.name ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      handleBlur(e);
                    }}
                  />
                  {formErrors.name && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                      {formErrors.name}
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

                <div>
                  <input
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formErrors.phone ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={values.phone}
                    required
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formErrors.phone ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      handleBlur(e);
                    }}
                  />
                  {formErrors.phone && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
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
                📍 Property Address
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <input
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formErrors.houseFlatNumber ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    type="text"
                    name="houseFlatNumber"
                    placeholder="House/Flat Number *"
                    value={values.houseFlatNumber}
                    required
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formErrors.houseFlatNumber ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      handleBlur(e);
                    }}
                  />
                  {formErrors.houseFlatNumber && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                      {formErrors.houseFlatNumber}
                    </p>
                  )}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <input
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formErrors.streetName ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    type="text"
                    name="streetName"
                    placeholder="Street Name *"
                    value={values.streetName}
                    required
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formErrors.streetName ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      handleBlur(e);
                    }}
                  />
                  {formErrors.streetName && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                      {formErrors.streetName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${formErrors.postcode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    type="text"
                    name="postcode"
                    placeholder="Postcode *"
                    value={values.postcode}
                    required
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formErrors.postcode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      handleBlur(e);
                    }}
                  />
                  {formErrors.postcode && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                      {formErrors.postcode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Method Selection */}
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
                📞 Preferred Contact Method
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '1rem' 
              }}>
                {['phone', 'text', 'email'].map((method) => (
                  <label 
                    key={method}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      background: values.contactMethod === method 
                        ? 'rgba(255, 211, 0, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: values.contactMethod === method 
                        ? '2px solid rgba(255, 211, 0, 0.5)' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      if (values.contactMethod !== method) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (values.contactMethod !== method) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method}
                      checked={values.contactMethod === method}
                      onChange={() => handleContactMethodChange(method)}
                      style={{ margin: 0, accentColor: '#FFD300' }}
                    />
                    <span style={{ 
                      color: values.contactMethod === method ? '#FFD300' : '#fff',
                      fontWeight: values.contactMethod === method ? '600' : '400',
                      textTransform: 'capitalize'
                    }}>
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Project Description */}
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
                ⚡ Project Details
              </h3>
              
              <textarea
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${formErrors.description ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                name="description"
                placeholder="Tell us about your electrical project... (minimum 10 words) *"
                value={values.description}
                required
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formErrors.description ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  handleBlur(e);
                }}
              />
              {formErrors.description && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1rem',
                color: '#8b9aef',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                📎 Attach Photos (Optional)
              </label>
              
              <div
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 211, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFile}
                  style={{ 
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={32} style={{ color: '#8b9aef', marginBottom: '1rem' }} />
                <div>
                  <p style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {values.file ? values.file.name : 'Click to upload or drag & drop'}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', margin: 0 }}>
                    Images, PDF, text, or Word documents (10MB max)
                  </p>
                </div>
              </div>
            </div>

            {/* Security Check */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                color: '#8b9aef',
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔒 Security Check
              </h3>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#FFD300'
                  }}>
                    What is {captchaValue}?
                  </div>
                  
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    style={{
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#8b9aef',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter your answer"
                  required
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${captchaError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onChange={() => captchaError && setCaptchaError(false)}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = captchaError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                  }}
                />
                
                {captchaError && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                    Incorrect answer, please try again
                  </p>
                )}
              </div>
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
                  : 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                color: sending ? 'rgba(255, 255, 255, 0.5)' : '#1a1a2e',
                fontWeight: '700',
                borderRadius: '12px',
                border: 'none',
                cursor: sending ? 'not-allowed' : 'pointer',
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                boxShadow: sending ? 'none' : '0 10px 30px rgba(255, 211, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
              onMouseOver={(e) => {
                if (!sending) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 211, 0, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!sending) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 211, 0, 0.3)';
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
                  Submitting...
                </>
              ) : (
                <>
                  Get Your Free Quote
                  <Zap size={20} />
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
            <linearGradient id="waveGradientQuote" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="url(#waveGradientQuote)"
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
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default QuoteForm;