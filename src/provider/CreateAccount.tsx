import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getFirebase } from '../firebase/firebase';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return 'This field is required';
        }
        if (value.length < 2) {
          return 'Must be at least 2 characters';
        }
        return '';

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          return 'Email is required';
        }
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'phone':
        const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
        if (!value.trim()) {
          return 'Phone number is required';
        }
        if (!phoneRegex.test(value)) {
          return 'Please enter a valid phone number';
        }
        return '';

      case 'businessName':
        if (!value.trim()) {
          return 'Business name is required';
        }
        return '';

      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(value)) {
          return 'Password must contain at least one number';
        }
        return '';

      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your password';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    const error = validateField(field, value);
    setErrors(prev => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });

    // Also validate confirmPassword if password changes
    if (field === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => {
        const next = { ...prev };
        if (confirmError) {
          next.confirmPassword = confirmError;
        } else {
          delete next.confirmPassword;
        }
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setErrorMessage('Please fix all errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const { auth, db } = getFirebase();

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create provider profile in Firestore
      await setDoc(doc(db, 'providers', user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        role: 'provider',
        emailVerified: false,
        status: 'pending', // Admin needs to approve
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      setSuccessMessage(
        'Account created successfully! Please check your email to verify your account. You will receive approval notification from our admin team.'
      );

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        businessName: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/provider/login');
      }, 3000);

    } catch (error: any) {
      console.error('Account creation error:', error);

      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please use a different email or login.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/network-request-failed') {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to create account. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' }}
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Provider Account</h1>
          <p className="text-gray-400">Join AMPALIGN's network of electrical service providers</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-200 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] p-8 rounded-lg shadow-xl">
          {/* Personal Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0A0A0A] text-white rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-[#FFD300] transition`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0A0A0A] text-white rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-[#FFD300] transition`}
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-[#0A0A0A] text-white rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-[#FFD300] transition`}
                placeholder="john.smith@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 bg-[#0A0A0A] text-white rounded-lg border ${
                  errors.phone ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-[#FFD300] transition`}
                placeholder="01522 123456"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* Business Name */}
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className={`w-full px-4 py-3 bg-[#0A0A0A] text-white rounded-lg border ${
                  errors.businessName ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-[#FFD300] transition`}
                placeholder="Smith Electrical Services"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-400">{errors.businessName}</p>
              )}
            </div>
          </div>

          {/* Account Security */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Security</h2>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-[#0A0A0A] text-white rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-[#FFD300] transition`}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-[#0A0A0A] text-white rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-[#FFD300] transition`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFD300] text-black font-semibold py-4 rounded-lg hover:bg-[#E6C000] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/provider/login')}
                className="text-[#FFD300] hover:text-[#E6C000] font-medium transition"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400">
            <strong className="text-white">Note:</strong> After creating your account, you'll receive a verification email.
            Your account will be reviewed by our admin team before you can start receiving job assignments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
