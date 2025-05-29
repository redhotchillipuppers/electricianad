import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const ServiceAreaMap = () => {
  const primaryAreas = [
    { name: "Grimsby", description: "Our main service hub" },
    { name: "Cleethorpes", description: "Full residential & commercial services" },
    { name: "Lincoln", description: "Complete electrical solutions" },
    { name: "Scunthorpe", description: "Industrial & domestic expertise" },
    { name: "Louth", description: "Rural & urban electrical services" }
  ];

  const extendedAreas = [
    "Boston", "Skegness", "Spalding", "Sleaford", 
    "Gainsborough", "Market Rasen", "Horncastle"
  ];

  return (
    <section 
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
          <pattern id="circuit-service" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
            <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
            <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-service)" />
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
        {/* Header */}
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
            SERVICE COVERAGE
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
            WHERE WE WORK
          </h2>
        </div>

        {/* Service Areas Grid */}
        <div 
          style={{
            backgroundColor: 'rgba(30, 64, 175, 0.4)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem'
          }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Primary Service Areas */}
            <div className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <h3 className="text-2xl font-bold text-white">Primary Service Areas</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {primaryAreas.map((area, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-blue-800 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-colors">
                      <MapPin className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">{area.name}</h4>
                        <p className="text-sm text-blue-100">{area.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center p-4 bg-green-800 bg-opacity-30 rounded-xl border border-green-600 border-opacity-30">
                  <Clock className="w-5 h-5 text-green-300 mr-3" />
                  <div>
                    <p className="font-semibold text-green-200">Same-Day Service Available</p>
                    <p className="text-sm text-green-300">Emergency callouts within 2 hours in primary areas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Coverage */}
            <div>
              <div className="p-6 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">Extended Coverage</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {extendedAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-blue-800 bg-opacity-20 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-300 mr-3" />
                      <span className="text-white">{area}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-800 bg-opacity-30 rounded-xl border border-amber-600 border-opacity-30">
                  <p className="text-sm text-amber-200 font-medium mb-1">Extended Areas</p>
                  <p className="text-sm text-amber-300">48-hour response time, travel charges may apply</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className="text-center text-white"
          style={{
            backgroundColor: 'rgba(30, 64, 175, 0.4)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 className="text-2xl font-bold mb-4">Need Electrical Services?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you're in our primary service area or extended coverage zone, 
            we're here to help with all your electrical needs.
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
              width: 'fit-content',
              backgroundColor: '#FFD300',
              color: '#1E3A8A',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            GET YOUR FREE QUOTE
          </button>
        </div>

        {/* Service Info */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(255, 211, 0, 0.2)' }}
            >
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Quick Response</h4>
            <p className="text-blue-100 text-sm">Same-day service in primary areas, 48hr in extended zones</p>
          </div>
          
          <div className="p-6">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(255, 211, 0, 0.2)' }}
            >
              <MapPin className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">Wide Coverage</h4>
            <p className="text-blue-100 text-sm">Serving all of Lincolnshire with professional electrical services</p>
          </div>
          
          <div className="p-6">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(255, 211, 0, 0.2)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">24/7 Emergency</h4>
            <p className="text-blue-100 text-sm">Emergency electrical services available around the clock</p>
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
};

export default ServiceAreaMap;