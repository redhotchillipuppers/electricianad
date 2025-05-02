import React from "react";
import {
  Camera,
  ClipboardEdit,
  SendHorizontal,
  CheckCircle2,
} from "lucide-react";

const steps = [
  { icon: Camera, title: "Snap a Photo", blurb: "Show us the job in seconds." },
  {
    icon: ClipboardEdit,
    title: "Fill the Form",
    blurb: "Tell us the basics—contact & overview.",
  },
  {
    icon: SendHorizontal,
    title: "We Send a Quote",
    blurb: "Clear price, zero obligation, usually < 2 hrs.",
  },
  {
    icon: CheckCircle2,
    title: "Schedule & Relax",
    blurb: "Pick a slot—our team handles the sparks.",
  },
];

const HowItWorks = () => (
  <section
    data-aos="fade-up"
    className="relative gradient-electric text-white py-20 px-4 overflow-hidden"
  >
    <div className="section-content">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-14 tracking-tight">
          HOW&nbsp;IT&nbsp;WORKS
        </h2>

        <ol className="grid gap-12 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, blurb }, i) => (
            <li key={title} className="group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary grid place-items-center mb-5 shadow-lg shadow-md hover:shadow-xl transition-transform transform group-hover:-translate-y-1">
                <Icon size={32} />
              </div>

              <h3 className="text-lg font-semibold mb-2">{`${i + 1}. ${title}`}</h3>
              <p className="text-sm text-neutral-300 max-w-[14ch]">{blurb}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
    <div className="diagonal-divider"></div>

  </section>
);

export default HowItWorks;
