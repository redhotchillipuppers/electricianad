import React from "react";
import { MessageSquareQuote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeaderBanner = () => {
  const scrollToQuote = () => {
    const quoteSection = document.getElementById("quote-form");
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      data-aos="fade-down"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '2rem 1.5rem 6rem',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Enhanced geometric pattern background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-header-modern" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Main circuit paths */}
              <path d="M20 20 L60 20 L60 60 L20 60 Z" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.6" />
              <path d="M0 40 L20 40" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.4" />
              <path d="M60 40 L80 40" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.4" />
              <path d="M40 0 L40 20" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.4" />
              <path d="M40 60 L40 80" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.4" />
              
              {/* Circuit nodes */}
              <circle cx="20" cy="20" r="3" fill="#FFD300" opacity="0.8" />
              <circle cx="60" cy="60" r="3" fill="#667eea" opacity="0.6" />
              <circle cx="60" cy="20" r="2" fill="#8b9aef" opacity="0.5" />
              <circle cx="20" cy="60" r="2" fill="#8b9aef" opacity="0.5" />
              
              {/* Secondary paths */}
              <path d="M20 40 H40 V60" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.4" />
              <path d="M40 20 V40 H60" fill="none" stroke="#8b9aef" strokeWidth="1.5" opacity="0.4" />
              
              {/* Micro circuits */}
              <rect x="35" y="35" width="10" height="10" fill="none" stroke="#FFD300" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-header-modern)" />
        </svg>
      </div>

      {/* Floating particles effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.8'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 20s ease-in-out infinite'
        }}
      />

      {/* Top Navigation */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 10
        }}
      >
        <Link
          to="/providers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 211, 0, 0.3)',
            borderRadius: '12px',
            color: '#FFD300',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 211, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 211, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}
        >
          Service Providers
          <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        maxWidth: '1200px', 
        margin: '0 auto',
        paddingTop: '4rem'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '4rem', 
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          {/* Left column - Main content */}
          <div style={{ order: 1 }}>
            {/* Animated title */}
            <div style={{ marginBottom: '2rem' }}>
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
                  marginBottom: '2rem'
                }}
              >
                Electrical Excellence
              </div>
              
              <h1 
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: '800',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #8b9aef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <span style={{ display: 'block' }}>AMPALIGN</span>
                <span 
                  style={{
                    fontSize: '0.4em',
                    fontWeight: '700',
                    color: '#FFD300',
                    letterSpacing: '0.3em',
                    display: 'block',
                    marginTop: '0.5rem'
                  }}
                >
                  LINCOLNSHIRE
                </span>
              </h1>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <p 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  lineHeight: '1.3'
                }}
              >
                YOUR QUICK FIX FOR A BRIGHTER HOME
              </p>
              
              <p 
                style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  maxWidth: '500px'
                }}
              >
                Professional electrical services with transparent pricing. 
                Quick, reliable work you can trust — snap a pic for an instant quote.
              </p>
            </div>

            {/* CTA Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}>
              <button
                type="button"
                onClick={scrollToQuote}
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
                Request Free Quote
                <ArrowRight size={20} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const servicesSection = document.getElementById("services");
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Our Services
              </button>
            </div>

            {/* Trust indicators */}
            <div 
              style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              {['Licensed & Insured', 'Same-Day Service', '24/7 Emergency'].map((item, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#FFD300'
                    }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Testimonial Card */}
          <div style={{ order: 2 }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2.5rem',
                maxWidth: '450px',
                margin: '0 auto',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Card background pattern */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(255, 211, 0, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />

              <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 10px 25px rgba(255, 211, 0, 0.3)'
                  }}
                >
                  <MessageSquareQuote size={24} style={{ color: '#1a1a2e' }} />
                </div>

                {/* Quote content */}
                <div style={{ flex: 1 }}>
                  <blockquote style={{ margin: 0 }}>
                    <p style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      fontStyle: 'italic',
                      lineHeight: '1.5',
                      color: '#ffffff',
                      marginBottom: '1rem',
                      position: 'relative'
                    }}>
                      "Ampalign installed our outdoor security lighting. They were professional, efficient, and the price was very reasonable. Highly recommend!"
                    </p>
                    
                    <footer style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: '#FFD300'
                        }}>
                          Jamie R.
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          Grimsby
                        </div>
                      </div>
                      
                      {/* Rating stars */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '2px',
                        marginLeft: 'auto'
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            style={{
                              width: '12px',
                              height: '12px',
                              background: '#FFD300',
                              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                            }}
                          />
                        ))}
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>

              {/* Accent line */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  width: '4px',
                  height: '40%',
                  background: 'linear-gradient(to bottom, #FFD300, #f59e0b)',
                  borderRadius: '0 4px 4px 0',
                  transform: 'translateY(-50%)'
                }}
              />
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
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="url(#waveGradient)"
          />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeaderBanner;