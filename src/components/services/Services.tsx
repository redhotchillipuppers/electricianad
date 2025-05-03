import React from "react";
import { Zap, Clock, Shield } from "lucide-react";

const Services = () => {
  const featuresData = [
    {
      icon: <Zap size={28} />,
      title: "Fast Response",
      description: "Same-day service for urgent electrical needs"
    },
    {
      icon: <Clock size={28} />,
      title: "On-Time Service",
      description: "We value your time with punctual appointments"
    },
    {
      icon: <Shield size={28} />,
      title: "Licensed & Insured",
      description: "Fully qualified professionals for your peace of mind"
    }
  ];

  return (
    <section
      id="services"
      className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-12 px-6 overflow-hidden"
      style={{
        position: 'relative',
        padding: '3rem 1.5rem',
        backgroundColor: '#1E40AF',
        background: 'linear-gradient(180deg, #1E40AF, #1E3A8A)',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* Circuit pattern background - Matching the how-it-works style */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-services" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
            <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
            <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-services)" />
        </svg>
      </div>
      
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            flexDirection: 'column'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontWeight: '500',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            OUR SERVICES
          </span>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              color: '#fff'
            }}
          >
            BRIGHT SOLUTIONS<br />FOR YOUR HOME
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '42rem',
              textAlign: 'center',
              margin: '0 auto'
            }}
          >
            Professional electrical services with upfront pricing. No hidden costs, no surprises — just reliable work you can trust.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}
        >
          {featuresData.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(30, 64, 175, 0.4)',
                backdropFilter: 'blur(4px)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  margin: '0 auto',
                  marginBottom: '1.25rem',
                  backgroundColor: '#FFD300',
                  color: '#1E3A8A',
                  borderRadius: '9999px',
                  padding: '1rem',
                  width: '4rem',
                  height: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              >
                {feature.icon}
              </div>
              
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: '#fff'
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem'
          }}
        >
<a 
  href="#quote-form" 
  style={{
    display: 'block',
    width: 'fit-content',
    margin: '0 auto',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#FFD300',
    color: '#1E3A8A',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s',
    textTransform: 'uppercase',
    cursor: 'pointer',
    textDecoration: 'none'
  }}
>
  GET A QUOTE NOW
</a>
        </div>
      </div>
      
      {/* Wave divider at bottom - matching how-it-works */}
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
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Services;