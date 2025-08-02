import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
// Import routing components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import HeaderBanner from "./components/header/HeaderBanner";
import Services from "./components/services/Services";
import QuoteForm from "./components/quoteform/quoteform";
import HowItWorks from "./components/howitworks/HowItWorks";
import ServiceAreaMap from "./components/servicemap/ServiceAreaMap";

// Import ServiceProviderForm component
import ServiceProviderForm from "./components/serviceproviders/ServiceProviderForm";

// Import admin panel
import AdminPanel from "./admin/pages/AdminPanel";

function App() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Landing Page Route */}
        <Route path="/" element={
          <>
            <HeaderBanner />
            <Services />
            <QuoteForm />
            <HowItWorks />
            <ServiceAreaMap />
<footer
  style={{
    position: 'relative',
    padding: '2rem 1.5rem',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
    color: '#fff',
    overflow: 'hidden',
    fontFamily: 'Inter, system-ui, sans-serif'
  }}
>
  {/* Circuit pattern background */}
  <div 
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.05
    }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit-footer-simple" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M20 20 L60 20 L60 60 L20 60 Z" fill="none" stroke="#667eea" strokeWidth="2" opacity="0.5" />
          <circle cx="20" cy="20" r="3" fill="#FFD300" opacity="0.7" />
          <circle cx="60" cy="60" r="3" fill="#667eea" opacity="0.6" />
          <path d="M20 40 H40 V60" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
          <path d="M40 20 V40 H60" fill="none" stroke="#FFD300" strokeWidth="1.5" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-footer-simple)" />
    </svg>
  </div>

  {/* Content */}
  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
    <p style={{ 
      margin: 0, 
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.875rem'
    }}>
      © 2025. All rights reserved.
    </p>
  </div>
</footer>
          </>
        } />

        {/* Service Provider Page Route */}
        <Route path="/providers" element={<ServiceProviderForm />} />

        {/* NEW: Admin Panel Route */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;