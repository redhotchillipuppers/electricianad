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

// Your existing ServiceProviderForm component
import ServiceProviderForm from "./components/serviceproviders/ServiceProviderForm";

// NEW: Import your admin panel
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
            <footer className="p-8 bg-blue-900 text-white">
              <p className="text-center">© 2025. All rights reserved.</p>
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