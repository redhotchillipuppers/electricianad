import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";

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
      className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-12 px-6 overflow-hidden"
      style={{
        position: 'relative',
        padding: '3rem 1.5rem',
        backgroundColor: '#1E40AF',
        background: 'linear-gradient(180deg, #1E40AF, #1E3A8A)',
        color: '#333',
        overflow: 'hidden'
      }}
    >
      {/* Circuit pattern background - Updated to match header style with off-white color */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-quote" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
            <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
            <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-quote)" />
        </svg>
      </div>
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '650px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginLeft: '0.5rem',
            textTransform: 'uppercase',
            color: '#1E3A8A'
          }}>
            REQUEST A FREE QUOTE
          </h2>
        </div>

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
              Thanks! We'll get back to you ASAP.
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
          <div style={{ marginBottom: '1rem' }}>
            <input
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.name ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              type="text"
              name="name"
              placeholder="Name *"
              value={values.name}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.name && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.name}</p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.email ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              type="email"
              name="email"
              placeholder="Email *"
              value={values.email}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.email && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.phone ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              type="tel"
              name="phone"
              placeholder="Phone *"
              value={values.phone}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.phone && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.phone}</p>
            )}
          </div>

          {/* Address fields */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.houseFlatNumber ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              type="text"
              name="houseFlatNumber"
              placeholder="House/Flat Name or Number *"
              value={values.houseFlatNumber}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.houseFlatNumber && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.houseFlatNumber}</p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.streetName ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              type="text"
              name="streetName"
              placeholder="Street Name *"
              value={values.streetName}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.streetName && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.streetName}</p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.postcode ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              type="text"
              name="postcode"
              placeholder="Postcode *"
              value={values.postcode}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.postcode && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.postcode}</p>
            )}
          </div>

          {/* Contact Method Selection */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ 
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              Preferred contact method:
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={values.contactMethod === "phone"}
                  onChange={() => handleContactMethodChange("phone")}
                  style={{ marginRight: '0.25rem' }}
                />
                <span>Phone</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="contactMethod"
                  value="text"
                  checked={values.contactMethod === "text"}
                  onChange={() => handleContactMethodChange("text")}
                  style={{ marginRight: '0.25rem' }}
                />
                <span>Text</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={values.contactMethod === "email"}
                  onChange={() => handleContactMethodChange("email")}
                  style={{ marginRight: '0.25rem' }}
                />
                <span>Email</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <textarea
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${formErrors.description ? '#EF4444' : '#ccc'}`,
                borderRadius: '0.25rem',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
              name="description"
              placeholder="Tell us what electrical work you need... (min 10 words) *"
              value={values.description}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.description && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{formErrors.description}</p>
            )}
          </div>

          {/* File uploader with standard HTML file input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Upload size={16} style={{ marginRight: '0.5rem' }} />
              Attach photo or diagram
            </label>
            <input
              type="file"
              accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFile}
              style={{ 
                width: '100%',
                padding: '0.25rem 0'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
              Optional - Images, PDF, text, or Word documents (10MB max)
            </p>
          </div>

          {/* Simple Captcha */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>Security Check:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
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
                    border: `1px solid ${captchaError ? '#EF4444' : '#ccc'}`,
                    borderRadius: '0.25rem'
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
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
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
              width: 'fit-content',
              backgroundColor: '#FFD300',
              color: '#1E3A8A',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: sending ? 'not-allowed' : 'pointer',
              opacity: sending ? 0.7 : 1,
              textTransform: 'uppercase'
            }}
          >
            {sending ? "SUBMITTING..." : "GET YOUR FREE QUOTE"}
          </button>
        </form>
      </div>
      
      {/* Wave divider at bottom */}
      <div style={{
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '4rem', 
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
            height: '5rem'
          }}
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default QuoteForm;