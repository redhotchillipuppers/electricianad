import React from "react";
import HeaderBanner from "./components/header/HeaderBanner";
import Services from "./components/services/Services";
import Testimonial from "./components/testimonial/Testimonial";
import QuoteForm from "./components/quoteform/quoteform";
import HowItWorks from "./components/howitworks/HowItWorks";

 function App() {
   return (
     <>
      <HeaderBanner />
      <Services />
      <Testimonial />
      <QuoteForm />
      <HowItWorks />
      <footer />
        <p>© 2023. All rights reserved.</p>
     </>
   );
 }

 export default App;

