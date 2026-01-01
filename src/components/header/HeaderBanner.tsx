import React from "react";
import { ArrowRight } from "lucide-react";
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
        padding: '2rem 1.5rem 3rem',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Minimal background pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`
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
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '2rem',
        textAlign: 'center'
      }}>
        {/* Compact title */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
            color: '#ffffff'
          }}
        >
          AMPALIGN
          <span
            style={{
              fontSize: '0.5em',
              fontWeight: '600',
              color: '#FFD300',
              letterSpacing: '0.2em',
              display: 'block',
              marginTop: '0.25rem'
            }}
          >
            LINCOLNSHIRE
          </span>
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: '1.5',
            marginBottom: '0',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          Snap a pic for an instant quote
        </p>
      </div>
    </section>
  );
};

export default HeaderBanner;