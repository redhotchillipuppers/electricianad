import React from "react";
import HeaderBanner from "./components/header/HeaderBanner";
import Services from "./components/services/Services";
import Testimonial from "./components/testimonial/Testimonial";
import QuoteForm from "./components/quoteform/quoteform";

 function App() {
   return (
     <>
      <HeaderBanner />
      <Services />
      <Testimonial />
      <QuoteForm />
     </>
   );
 }

 export default App;

