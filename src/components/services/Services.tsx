import React from "react";

const services = [
  "Electrical installations",
  "Repairs & upgrades",
  "Smart tech setups",
];

const Services = () => (
  <section
    data-aos="fade-up"
    className="relative py-16 px-4 bg-white overflow-hidden"
  >
    <div className="section-content">
      <div className="absolute -top-12 right-0 w-40 h-40 bg-primary/10 transform rotate-45"></div>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
          OUR SERVICES
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <div
              key={item}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                {item}
              </h3>
              <p className="text-neutral-600">
                {/* add a 1-sentence blurb here */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

);

export default Services;
