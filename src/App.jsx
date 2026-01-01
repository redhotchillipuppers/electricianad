import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
// Import routing components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import QuoteForm from "./components/quoteform/quoteform";

// Import ServiceProviderForm component
import ServiceProviderForm from "./components/serviceproviders/ServiceProviderForm";

// Import provider pages
import ProviderLoginPage from "./provider/pages/ProviderLoginPage";
import ProviderAccountCreationPage from "./provider/pages/ProviderAccountCreationPage";
import ProtectedProviderRoute from "./provider/components/ProtectedProviderRoute";
import ProviderDashboard from "./provider/pages/ProviderDashboard";

// Import admin panel
import AdminPanel from "./admin/pages/AdminPanel";

function App() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Landing Page Route */}
        <Route path="/" element={
          <>
            <QuoteForm />
            <footer
              style={{
                position: 'relative',
                padding: '3rem 1.5rem 2rem',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
                color: '#fff',
                overflow: 'hidden',
                fontFamily: 'Inter, system-ui, sans-serif',
                borderTop: '1px solid rgba(255, 211, 0, 0.1)'
              }}
            >
              {/* Enhanced circuit pattern background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.1
                }}
              >
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="circuit-footer-enhanced" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M25 25 L75 25 L75 75 L25 75 Z" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.5" />
                      <path d="M0 50 L25 50" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
                      <path d="M75 50 L100 50" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
                      <circle cx="25" cy="25" r="3" fill="#FFD300" opacity="0.8" />
                      <circle cx="75" cy="75" r="3" fill="#667eea" opacity="0.6" />
                      <path d="M25 50 H50 V75" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
                      <path d="M50 25 V50 H75" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#circuit-footer-enhanced)" />
                </svg>
              </div>

              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {/* Footer Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem'
                }}>
                  {/* Brand Section */}
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      marginBottom: '0.5rem',
                      color: '#ffffff'
                    }}>
                      AMPALIGN
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#FFD300',
                      fontWeight: '600',
                      letterSpacing: '0.1em',
                      marginBottom: '1rem'
                    }}>
                      LINCOLNSHIRE
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: '1.6'
                    }}>
                      Professional electrical services with transparent pricing and quick turnaround.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      color: '#FFD300'
                    }}>
                      For Customers
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <a href="#quote-form" style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#FFD300'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                        >
                          Request a Quote
                        </a>
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <span style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.875rem'
                        }}>
                          Emergency Services
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* For Electricians - Featured */}
                  <div style={{
                    background: 'rgba(255, 211, 0, 0.05)',
                    border: '1px solid rgba(255, 211, 0, 0.2)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                      color: '#FFD300'
                    }}>
                      Are You an Electrician?
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      Join our network and connect with customers in your area.
                    </p>
                    <a
                      href="/providers"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                        color: '#1a1a2e',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 211, 0, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Join Our Network →
                    </a>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.875rem'
                  }}>
                    © 2025 AMPALIGN. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </>
        } />

        {/* Service Provider Page Route */}
        <Route path="/providers" element={<ServiceProviderForm />} />

        {/* Provider Login Page Route */}
        <Route path="/provider-login" element={<ProviderLoginPage />} />

        {/* Provider Account Creation Route */}
        <Route path="/provider-create-account" element={<ProviderAccountCreationPage />} />

        {/* Provider Dashboard Route (Protected) */}
        <Route path="/provider-dashboard" element={
          <ProtectedProviderRoute>
            <ProviderDashboard />
          </ProtectedProviderRoute>
        } />

        {/* Admin Panel Route */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;