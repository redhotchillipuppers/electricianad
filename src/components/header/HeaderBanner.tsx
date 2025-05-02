import React from "react";

const HeaderBanner = () => {
  const scrollToQuote = () => {
    const quoteSection = document.getElementById("quote-form");
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section data-aos="fade-down" className="relative gradient-electric text-white text-center py-20 px-6 overflow-hidden">
      <div className="section-content">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            YOUR QUICK FIX <br className="hidden md:inline" /> FOR A BRIGHTER HOME
          </h1>

          <p className="mt-4 text-lg md:text-xl max-w-md mx-auto">
            Quick, reliable electrical work.
            <br className="hidden sm:inline" />
            Snap a pic for a no‑pressure quote
          </p>

          <button
            type="button"
            onClick={scrollToQuote}
            className="mt-8 btn-primary"
          >
            REQUEST A QUOTE
          </button>
        </div>
      </div>
      <div className="diagonal-divider"></div>
    </section>
  );
};

export default HeaderBanner;
