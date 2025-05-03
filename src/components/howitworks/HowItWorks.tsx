import React from "react";
import {
  Camera,
  ClipboardEdit,
  SendHorizontal,
  CheckCircle2,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { 
      icon: <Camera size={28} />, 
      title: "Snap a Photo", 
      description: "Take a quick photo of the issue or project area and upload it with your request."
    },
    {
      icon: <ClipboardEdit size={28} />,
      title: "Fill the Form",
      description: "Provide your contact information and a brief description of the electrical service you need."
    },
    {
      icon: <SendHorizontal size={28} />,
      title: "Get Your Quote",
      description: "Receive a clear, detailed quote with no hidden costs, typically within 2 hours."
    },
    {
      icon: <CheckCircle2 size={28} />,
      title: "Schedule Service",
      description: "Choose a convenient time slot and our licensed electricians will arrive ready to solve your issue."
    },
  ];

  return (
    <section
      id="how-it-works"
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
      {/* Circuit pattern background - Matching the quote form style */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-how-it-works" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
            <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
            <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-how-it-works)" />
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
            SIMPLE PROCESS
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
            HOW IT WORKS
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '42rem',
              textAlign: 'center',
              margin: '0 auto'
            }}
          >
            We've streamlined our service process to be quick and hassle-free,
            getting your electrical needs addressed without unnecessary complications.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                position: 'relative'
              }}
            >
              {/* Only show connector line between steps on larger screens */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    display: 'none',
                    position: 'absolute',
                    top: '3rem',
                    left: '100%',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    zIndex: 0,
                    transform: 'translateY(-50%)',
                    marginLeft: '-1rem'
                  }}
                  className="connector-line"
                ></div>
              )}
              
              <div
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
                  {step.icon}
                </div>
                
                <div
                  style={{
                    backgroundColor: 'rgba(30, 58, 138, 0.7)',
                    color: '#FFD300',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: '-0.75rem',
                    left: '-0.75rem'
                  }}
                >
                  {index + 1}
                </div>
                
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem'
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem'
          }}
        >
          <a 
            href="#quote-form" 
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FFD300',
              color: '#1E3A8A',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            Start Your Quote Now
          </a>
        </div>
      </div>
      
      {/* Wave divider at bottom - matching quote form */}
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

export default HowItWorks;