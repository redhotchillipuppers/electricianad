import React from "react";
import { Zap, Clock, Shield, ArrowRight, CheckCircle, Star, MessageCircle } from "lucide-react";

const Services = () => {
  const featuresData = [
    {
      icon: <Zap size={28} />,
      title: "Qualified Local Electricians",
      description: "Connect with certified and experienced electricians in your area who deliver quality work",
      highlight: "Expert Network"
    },
    {
      icon: <Clock size={28} />,
      title: "Reliable Electricians", 
      description: "Our network includes electricians who respect your time with professional scheduling and punctuality",
      highlight: "Dependable Service"
    },
    {
      icon: <Shield size={28} />,
      title: "Vetted Professionals",
      description: "All electricians in our network are fully licensed with comprehensive insurance coverage",
      highlight: "Peace of Mind"
    },
    {
      icon: <MessageCircle size={28} />,
      title: "Easy Connection",
      description: "Simply tell us your needs and preferred contact method - local electricians will reach out to you.",
      highlight: "Your Way"
    }
  ];

  const serviceTypes = [
    {
      category: "Residential",
      services: ["Socket Installation", "Lighting Upgrades", "Fuse Box Replacement", "Wiring Repairs"],
      icon: "🏠"
    },
    {
      category: "Commercial", 
      services: ["Office Rewiring", "Security Lighting", "Industrial Systems", "Maintenance"],
      icon: "🏢"
    },
    {
      category: "Electrical Work",
      services: ["Power Installation", "Electrical Faults", "Safety Inspections", "System Upgrades"],
      icon: "⚡"
    }
  ];

  return (
    <section
      id="services"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%)',
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
          opacity: 0.12
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-services-modern" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Main grid structure */}
              <path d="M30 30 L90 30 L90 90 L30 90 Z" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.5" />
              <path d="M0 60 L30 60" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              <path d="M90 60 L120 60" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              <path d="M60 0 L60 30" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              <path d="M60 90 L60 120" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              
              {/* Connection nodes */}
              <circle cx="30" cy="30" r="4" fill="#FFD300" opacity="0.7" />
              <circle cx="90" cy="90" r="4" fill="#667eea" opacity="0.6" />
              <circle cx="90" cy="30" r="3" fill="#8b9aef" opacity="0.5" />
              <circle cx="30" cy="90" r="3" fill="#8b9aef" opacity="0.5" />
              
              {/* Internal circuitry */}
              <path d="M30 60 H60 V90" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
              <path d="M60 30 V60 H90" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
              
              {/* Micro elements */}
              <rect x="50" y="50" width="20" height="20" fill="none" stroke="#667eea" strokeWidth="1" opacity="0.3" />
              <circle cx="45" cy="45" r="2" fill="#8b9aef" opacity="0.4" />
              <circle cx="75" cy="75" r="2" fill="#8b9aef" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-services-modern)" />
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
        {/* Section Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}
        >
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
            Our Services
          </div>
          
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #8b9aef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}
          >
            PROFESSIONAL ELECTRICAL
            <br />
            SOLUTIONS
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
            Connect with qualified local electricians for repairs to complete installations. Get transparent pricing with no hidden costs from trusted professionals in your area.
          </p>
        </div>

        {/* Key Features Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}
        >
          {featuresData.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              {/* Background accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '80px',
                  height: '80px',
                  background: 'radial-gradient(circle, rgba(255, 211, 0, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />

              {/* Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(255, 211, 0, 0.2)',
                  border: '1px solid rgba(255, 211, 0, 0.3)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#FFD300',
                  textTransform: 'uppercase'
                }}
              >
                {feature.highlight}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon */}
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px rgba(255, 211, 0, 0.3)',
                    color: '#1a1a2e'
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#ffffff'
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Service Categories */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '3rem',
            marginBottom: '4rem'
          }}
        >
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '3rem',
              color: '#ffffff'
            }}
          >
            Service Categories
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {serviceTypes.map((category, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}
                >
                  {category.icon}
                </div>
                
                <h4
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#8b9aef'
                  }}
                >
                  {category.category}
                </h4>
                
                <div style={{ textAlign: 'left' }}>
                  {category.services.map((service, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <CheckCircle size={16} style={{ color: '#FFD300' }} />
                      <span style={{ fontSize: '0.95rem' }}>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            textAlign: 'center'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '3rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <Star size={48} style={{ color: '#FFD300', marginBottom: '1rem' }} />
            
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}
            >
              Ready to Connect with Local Electricians?
            </h3>
            
            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}
            >
              Submit your electrical project details and preferred contact method. 
              Qualified local electricians will reach out to you.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const quoteSection = document.getElementById("quote-form");
                  if (quoteSection) {
                    quoteSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                  color: '#1a1a2e',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(255, 211, 0, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 211, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 211, 0, 0.3)';
                }}
              >
                Connect with Electricians
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
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
            <linearGradient id="waveGradientServices" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="url(#waveGradientServices)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Services;