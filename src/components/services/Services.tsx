import React from "react";

const services = [
  "Electrical installations",
  "Repairs & upgrades",
  "Smart tech setups",
];

const Services = () => (
  <section className="bg-white py-14 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
        OUR SERVICES
      </h2>

      {/* horizontal bullets */}
      <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-lg">
        {services.map((item) => (
          <li
            key={item}
            className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-sky-500"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Services;
