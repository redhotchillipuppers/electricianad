import React from "react";
import { MessageSquareQuote } from "lucide-react";

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
      className="relative text-white py-20 px-6 overflow-hidden"
      style={{
        position: 'relative',
        padding: '3rem 1.5rem 5rem', // Increased bottom padding to make room for the wave
        backgroundColor: '#1E40AF',
        background: 'linear-gradient(180deg, #1E40AF, #1E3A8A)',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* Circuit pattern background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-header" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
            <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
            <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-header)" />
        </svg>
      </div>

      <div className="section-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          {/* Two-column layout for larger screens */}
          <div className="grid md:grid-cols-2 gap-8 items-start"> {/* Changed items-center to items-start */}
            {/* Left column - Main header content */}
            <div>
              {/* Title with Ampalign and Lincolnshire as one unit with letter spacing */}
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-wider"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#fff',
                  letterSpacing: '0.05em'
                }}>
                <span className="text-4xl md:text-5xl">AMPALIGN</span>
                {' '}
                <span className="text-xs md:text-sm tracking-widest"
                  style={{
                    letterSpacing: '0.3em',
                    fontWeight: 'bold',
                    color: '#FFD300', // Yellow to match the button
                    fontSize: '35%',
                    verticalAlign: 'middle'
                  }}>
                  LINCOLNSHIRE
                </span>
              </h1>

              <p className="mt-4 text-lg md:text-xl max-w-md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                YOUR QUICK FIX FOR A BRIGHTER HOME
              </p>

              <p className="mt-2 text-base md:text-lg max-w-md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Quick, reliable electrical work.
                <br className="hidden sm:inline" />
                Snap a pic for a no-pressure quote
              </p>

              <button
                type="button"
                onClick={scrollToQuote}
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  marginTop: '2rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#FFD300',
                  color: '#1E3A8A',
                  fontWeight: 'bold',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
              >
                REQUEST A QUOTE
              </button>
            </div>

            {/* Right column - Testimonial */}
            <div className="hidden md:block" style={{ marginBottom: '2rem' }}> {/* Added marginBottom */}
              <div
                style={{
                  backgroundColor: 'rgba(30, 64, 175, 0.4)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginLeft: 'auto',
                  maxWidth: '400px',
                  position: 'relative', // Ensure positioned properly
                  top: '-2.5rem' // Moved up to position halfway between current position and top
                }}
              >
                <div className="flex gap-4 items-start">
                  {/* Avatar/Quote icon */}
                  <div className="flex-shrink-0">
                    <div
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        backgroundColor: '#FFD300',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <MessageSquareQuote size={20} style={{ color: '#1E3A8A' }} />
                    </div>
                  </div>

                  {/* Quote copy */}
                  <blockquote className="relative">
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      lineHeight: '1.3',
                      color: '#fff',
                      marginBottom: '0.5rem'
                    }}>
                      "Another electrician couldn't fix our lighting issues. Ampalign solved it in one visit and charged exactly what they quoted."
                    </p>
                    <footer style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      — Jamie R, Grimsby
                    </footer>

                    {/* Yellow accent bar */}
                    <span
                      className="absolute -left-3 top-1 h-10 w-1 rounded"
                      style={{
                        backgroundColor: '#FFD300'
                      }}
                    />
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4rem',
        overflow: 'hidden',
        zIndex: 1 // Ensure wave is above other content
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

export default HeaderBanner;