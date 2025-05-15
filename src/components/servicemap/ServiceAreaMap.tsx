import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const ServiceAreaMap = () => {
  const [activeArea, setActiveArea] = useState<string | null>(null);
  
  // Define your service areas with approximate coordinates
  const serviceAreas = [
    { name: "Grimsby", primary: true, coordinates: { x: 70, y: 30 } },
    { name: "Cleethorpes", primary: true, coordinates: { x: 77, y: 32 } },
    { name: "Lincoln", primary: true, coordinates: { x: 50, y: 60 } },
    { name: "Scunthorpe", primary: true, coordinates: { x: 40, y: 35 } },
    { name: "Louth", primary: true, coordinates: { x: 65, y: 45 } },
    { name: "Boston", coordinates: { x: 65, y: 75 } },
    { name: "Skegness", coordinates: { x: 80, y: 65 } },
    { name: "Spalding", coordinates: { x: 55, y: 85 } },
    { name: "Sleaford", coordinates: { x: 55, y: 70 } },
    { name: "Gainsborough", coordinates: { x: 30, y: 55 } },
    { name: "Market Rasen", coordinates: { x: 50, y: 45 } },
    { name: "Horncastle", coordinates: { x: 60, y: 55 } }
  ];

  return (
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
      {/* Circuit pattern background - same as in testimonial */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit-map" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10 L40 10 L40 40 L10 40 Z" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" fill="#F5F5F5" />
            <circle cx="40" cy="40" r="2" fill="#F5F5F5" />
            <path d="M10 25 H30 V40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
            <path d="M25 10 V30 H40" fill="none" stroke="#F5F5F5" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-map)" />
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
            COVERAGE AREA
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
          <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
            {/* Map visualization */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(30, 58, 138, 0.5)' }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simplified Lincolnshire county outline */}
                <path 
                  d="M20,20 L80,15 L85,35 L90,60 L75,85 L40,90 L25,75 L15,40 z" 
                  fill="rgba(255, 255, 255, 0.1)" 
                  stroke="#FFD300" 
                  strokeWidth="1.5"
                />
                
                {/* Plot the cities */}
                {serviceAreas.map((area, idx) => (
                  <g key={idx}>
                    <circle 
                      cx={area.coordinates.x} 
                      cy={area.coordinates.y} 
                      r={area.primary ? 4 : 3} 
                      fill={area.primary ? "#FFD300" : "#60A5FA"}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveArea(area.name)}
                      onMouseLeave={() => setActiveArea(null)}
                    />
                    
                    {/* City labels - only show for primary areas or active area */}
                    {(area.primary || activeArea === area.name) && (
                      <text 
                        x={area.coordinates.x} 
                        y={area.coordinates.y - 5} 
                        fontSize="3.5"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontWeight={area.primary ? "bold" : "normal"}
                      >
                        {area.name}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
              
              <div className="absolute bottom-2 right-2 text-xs bg-blue-900 bg-opacity-70 p-2 rounded">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span>Primary service area</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <span>Extended service area</span>
                </div>
              </div>
            </div>
            
            {/* List of service areas */}
            <div className="w-full">
              <div className="mb-2 font-bold text-sm uppercase" style={{ color: '#FFD300' }}>Primary Areas:</div>
              <ul className="mb-4 grid grid-cols-1 gap-2">
                {serviceAreas.filter(area => area.primary).map((area, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center text-sm"
                    onMouseEnter={() => setActiveArea(area.name)}
                    onMouseLeave={() => setActiveArea(null)}
                  >
                    <MapPin size={16} style={{ color: '#FFD300' }} className="mr-2" />
                    {area.name}
                  </li>
                ))}
              </ul>
              
              <div className="mb-2 font-bold text-sm uppercase">Also Serving:</div>
              <ul className="grid grid-cols-1 gap-2">
                {serviceAreas.filter(area => !area.primary).map((area, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center text-sm"
                    onMouseEnter={() => setActiveArea(area.name)}
                    onMouseLeave={() => setActiveArea(null)}
                  >
                    <MapPin size={16} className="text-blue-300 mr-2" />
                    {area.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <p>We provide reliable electrical services throughout Lincolnshire. <br/>
            <span className="font-bold" style={{ color: '#FFD300' }}>Same day service available in primary service areas.</span></p>
          </div>
        </div>
      </div>

      {/* Wave divider at bottom - same as in testimonial */}
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