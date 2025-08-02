import React from 'react';
import { MapPin, Zap, Building, Home, Factory, ArrowRight } from 'lucide-react';

const ServiceAreasList = () => {
  const primaryAreas = [
    { 
      name: "Grimsby", 
      description: "Our main service hub providing comprehensive electrical solutions",
      isHQ: true,
      services: [
        "Residential electricians",
        "Commercial electricians", 
        "Industrial electricians",
        "Emergency electrical services",
        "Electrical installations",
        "Electrical testing & inspection"
      ]
    },
    { 
      name: "Cleethorpes", 
      description: "Complete electrical services for homes and businesses",
      services: [
        "Domestic electricians",
        "Commercial electrical work",
        "Electrical repairs",
        "Consumer unit upgrades",
        "Electric vehicle charging points"
      ]
    },
    { 
      name: "Lincoln", 
      description: "Professional electrical solutions across the city and suburbs",
      services: [
        "Residential electrical services",
        "Commercial electricians",
        "Office electrical installations",
        "Lighting design & installation",
        "Electrical maintenance"
      ]
    },
    { 
      name: "Scunthorpe", 
      description: "Specialized in industrial and domestic electrical expertise",
      services: [
        "Industrial electricians",
        "Factory electrical systems",
        "Domestic electrical work",
        "Three-phase installations",
        "Electrical fault finding"
      ]
    },
    { 
      name: "Louth", 
      description: "Rural and urban electrical services specialist",
      services: [
        "Rural electricians",
        "Agricultural electrical work",
        "Residential services",
        "Barn & outbuilding wiring",
        "Security lighting systems"
      ]
    }
  ];

  const secondaryAreas = [
    { 
      name: "Boston", 
      services: ["Residential electricians", "Commercial electrical work", "Industrial maintenance"]
    },
    { 
      name: "Skegness", 
      services: ["Holiday home electrical services", "Commercial electricians", "Seaside property maintenance"]
    },
    { 
      name: "Spalding", 
      services: ["Agricultural electricians", "Commercial installations", "Domestic electrical work"]
    },
    { 
      name: "Sleaford", 
      services: ["Residential electrical services", "Small commercial work", "Electrical repairs"]
    },
    { 
      name: "Gainsborough", 
      services: ["Industrial electricians", "Commercial electrical systems", "Domestic services"]
    },
    { 
      name: "Market Rasen", 
      services: ["Rural electricians", "Residential work", "Farm electrical installations"]
    },
    { 
      name: "Horncastle", 
      services: ["Domestic electricians", "Commercial electrical work", "Heritage building electrical"]
    }
  ];

  const serviceIcons = {
    "Residential": <Home size={16} />,
    "Commercial": <Building size={16} />,
    "Industrial": <Factory size={16} />,
    "Domestic": <Home size={16} />,
    "Agricultural": <Factory size={16} />,
    "Rural": <Home size={16} />
  };

  const getServiceIcon = (service) => {
    const serviceType = service.split(' ')[0];
    return serviceIcons[serviceType] || <Zap size={16} />;
  };

  return (
    <section 
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
          opacity: 0.06
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-service-modern" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M40 40 L120 40 L120 120 L40 120 Z" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.5" />
              <path d="M0 80 L40 80" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              <path d="M120 80 L160 80" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              <path d="M80 0 L80 40" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              <path d="M80 120 L80 160" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.3" />
              
              <circle cx="40" cy="40" r="5" fill="#FFD300" opacity="0.8" />
              <circle cx="120" cy="120" r="5" fill="#667eea" opacity="0.7" />
              <circle cx="120" cy="40" r="4" fill="#8b9aef" opacity="0.6" />
              <circle cx="40" cy="120" r="4" fill="#8b9aef" opacity="0.6" />
              <circle cx="80" cy="80" r="3" fill="#10b981" opacity="0.5" />
              
              <path d="M40 80 H80 V120" fill="none" stroke="#FFD300" strokeWidth="2" opacity="0.4" />
              <path d="M80 40 V80 H120" fill="none" stroke="#FFD300" strokeWidth="2" opacity="0.4" />
              <path d="M60 60 L100 100" fill="none" stroke="#8b9aef" strokeWidth="1" opacity="0.3" />
              
              <rect x="65" y="65" width="30" height="30" fill="none" stroke="#667eea" strokeWidth="1" opacity="0.4" />
              <circle cx="55" cy="55" r="2" fill="#f59e0b" opacity="0.6" />
              <circle cx="105" cy="105" r="2" fill="#f59e0b" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-service-modern)" />
        </svg>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1400px',
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
            Service Coverage
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
            WHERE WE WORK
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
            Professional electrical services across Lincolnshire covering residential, 
            commercial, and industrial electrical work with expert qualified electricians.
          </p>
        </div>

        {/* Primary Service Areas */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#FFD300',
              borderRadius: '50%'
            }} />
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0
            }}>
              Primary Service Areas
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}>
            {primaryAreas.map((area, index) => (
              <div
                key={area.name}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 211, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* HQ indicator */}
                {area.isHQ && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                    color: '#1a1a2e',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    🏢 HQ
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: area.isHQ ? '#FFD300' : '#667eea',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.8)'
                  }} />
                  <h4 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#fff',
                    margin: 0
                  }}>
                    {area.name}
                  </h4>
                </div>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  marginBottom: '1.5rem'
                }}>
                  {area.description}
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <h5 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#8b9aef',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Electrical Services:
                  </h5>
                  {area.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <div style={{ color: '#FFD300' }}>
                        {getServiceIcon(service)}
                      </div>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Service Areas */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: 'rgba(139, 154, 239, 0.7)',
              borderRadius: '50%'
            }} />
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0
            }}>
              Secondary Service Areas
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {secondaryAreas.map((area, index) => (
              <div
                key={area.name}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(139, 154, 239, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <MapPin size={18} style={{ color: '#8b9aef' }} />
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: 0
                  }}>
                    {area.name}
                  </h4>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem'
                }}>
                  {area.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 0.5rem',
                        background: 'rgba(139, 154, 239, 0.05)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <div style={{ color: '#8b9aef' }}>
                        {getServiceIcon(service)}
                      </div>
                      {service}
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
              maxWidth: '700px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(255, 211, 0, 0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />

            <MapPin size={48} style={{ color: '#FFD300', marginBottom: '1.5rem' }} />
            
            <h3
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}
            >
              Need Electrical Services?
            </h3>
            
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}
            >
              Whether you need residential, commercial, or industrial electrical work, 
              our qualified electricians are ready to help with professional service and transparent pricing.
            </p>

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
              Get Your Free Quote
              <ArrowRight size={20} />
            </button>
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
            <linearGradient id="waveGradientServiceMap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path  
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="url(#waveGradientServiceMap)"
          />
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .service-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ServiceAreasList;