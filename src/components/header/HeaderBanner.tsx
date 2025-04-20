import React from "react";

const HeaderBanner = () => (
  <section className="bg-neutral-800 text-white text-center py-16 px-4">
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
        className="mt-8 bg-white text-neutral-800 font-semibold rounded-md px-8 py-4 shadow hover:bg-gray-200 transition"
      >
        REQUEST A QUOTE
      </button>
    </div>
  </section>
);

export default HeaderBanner;
