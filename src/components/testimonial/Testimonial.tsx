import React from "react";
import { MessageSquareQuote } from "lucide-react";

const Testimonial = () => (
  <section
    data-aos="fade-up"
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
        <pattern id="circuit-testimonial" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
          <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
          <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-testimonial)" />
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
          CLIENT REVIEW
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
          WHAT OUR CUSTOMERS SAY
        </h2>
      </div>

      <div 
        style={{
          backgroundColor: 'rgba(30, 64, 175, 0.4)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.75rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          margin: '0 auto',
          maxWidth: '800px'
        }}
      >
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div 
              style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '50%',
                backgroundColor: '#FFD300',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <MessageSquareQuote size={40} style={{ color: '#1E3A8A' }} />
            </div>
          </div>

          {/* Quote copy */}
          <blockquote className="relative">
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              fontStyle: 'italic',
              lineHeight: '1.3',
              color: '#fff',
              marginBottom: '1rem'
            }}>
              "The team rewired our entire kitchen in a day—no mess, no drama.
              Finally a sparkie who shows up and actually cares."
            </p>
            <footer style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              — Sarah T, Grimsby
            </footer>

            {/* Subtle accent on desktop */}
            <span 
              className="hidden md:block absolute -left-6 top-2 h-12 w-1 rounded"
              style={{
                backgroundColor: '#FFD300'
              }}
            />
          </blockquote>
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
          fill="white"
        />
      </svg>
    </div>
  </section>
);

export default Testimonial;
