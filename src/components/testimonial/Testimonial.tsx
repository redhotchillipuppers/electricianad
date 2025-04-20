import React from "react";
import { MessageSquareQuote } from "lucide-react"; // tiny SVG icon (comes with shadcn setup)

const Testimonial = () => (
  <section className="bg-white py-16 px-4">
    <div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-8 items-start">
      {/* avatar */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 rounded-full bg-neutral-200 grid place-items-center">
          <MessageSquareQuote size={40} className="text-neutral-500" />
        </div>
      </div>

      {/* quote copy */}
      <blockquote className="relative">
        <p className="text-xl leading-relaxed font-medium">
          “The team rewired our entire kitchen in a day—no mess, no drama.
          Finally a sparkie who shows up and actually cares.”
        </p>
        <footer className="mt-4 text-sm text-neutral-600">— Sarah T, Grimsby</footer>

        {/* subtle left border on desktop */}
        <span className="hidden md:block absolute -left-6 top-2 h-12 w-1 bg-sky-500 rounded" />
      </blockquote>
    </div>
  </section>
);

export default Testimonial;
