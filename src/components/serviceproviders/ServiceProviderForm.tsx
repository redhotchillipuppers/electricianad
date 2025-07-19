import React from "react";
import { UserPlus, MapPin, Wrench, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceProviderForm = () => {
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

          {/* Placeholder Form */}
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
            <p
              style={{
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: '2rem'
              }}
            >
              This form is currently under development. Check back soon!
            </p>

            {/* Placeholder Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#F9FAFB',
                    color: '#9CA3AF'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}
                >
                  License Number
                </label>
                <input
                  type="text"
                  placeholder="Your electrical contractor license"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#F9FAFB',
                    color: '#9CA3AF'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}
                >
                  Service Areas
                </label>
                <input
                  type="text"
                  placeholder="Cities/regions you serve"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#F9FAFB',
                    color: '#9CA3AF'
                  }}
                />
              </div>

              <button
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'not-allowed',
                  textTransform: 'uppercase',
                  marginTop: '1rem'
                }}
              >
                Coming Soon
              </button>
            </div>
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