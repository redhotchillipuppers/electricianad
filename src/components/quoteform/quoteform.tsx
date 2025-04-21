import React, { useState } from "react";
import { Phone, MessageSquare, Mail } from "lucide-react";

// ↓— swap this with your real Firebase helper
import submitQuote from "../../firebase/submitQuote";

const QuoteForm = () => {
  const [sending, setSending] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    file: null as File | null,
    contactMethod: "email", // Default contact method
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, file: e.target.files?.[0] ?? null }));
  };

  const handleContactMethodChange = (method: string) => {
    setValues((prev) => ({ ...prev, contactMethod: method }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitQuote(values); // 🔗 your existing Firebase call
      alert("Thanks! We'll get back to you ASAP.");
      setValues({
        name: "",
        email: "",
        phone: "",
        description: "",
        file: null,
        contactMethod: "email",
      });
    } catch (err) {
      console.error(err);
      alert("Whoops—something went wrong. Try again?");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="quote-form" className="bg-neutral-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight text-center">
          REQUEST A QUOTE
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6 text-base"
        >
          <input
            className="border border-neutral-300 rounded-md px-4 py-3 outline-sky-500"
            type="text"
            name="name"
            placeholder="Name"
            value={values.name}
            required
            onChange={handleChange}
          />

          <input
            className="border border-neutral-300 rounded-md px-4 py-3 outline-sky-500"
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            required
            onChange={handleChange}
          />

          <input
            className="border border-neutral-300 rounded-md px-4 py-3 outline-sky-500"
            type="tel"
            name="phone"
            placeholder="Phone"
            value={values.phone}
            onChange={handleChange}
          />

          {/* Contact Method Selection */}
          <div className="md:col-span-2">
            <p className="text-neutral-700 font-medium mb-2">
              Preferred contact method (we'll only use this method to reach you):
            </p>
            <div className="flex flex-wrap gap-4">
              <label 
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  values.contactMethod === "phone" 
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200" 
                    : "border-neutral-300 hover:border-sky-300"
                } cursor-pointer transition`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={values.contactMethod === "phone"}
                  onChange={() => handleContactMethodChange("phone")}
                  className="sr-only"
                />
                <Phone size={20} className={values.contactMethod === "phone" ? "text-sky-600" : "text-neutral-500"} />
                <span className={values.contactMethod === "phone" ? "font-medium text-sky-700" : "text-neutral-700"}>Phone Call</span>
              </label>

              <label 
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  values.contactMethod === "text" 
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200" 
                    : "border-neutral-300 hover:border-sky-300"
                } cursor-pointer transition`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="text"
                  checked={values.contactMethod === "text"}
                  onChange={() => handleContactMethodChange("text")}
                  className="sr-only"
                />
                <MessageSquare size={20} className={values.contactMethod === "text" ? "text-sky-600" : "text-neutral-500"} />
                <span className={values.contactMethod === "text" ? "font-medium text-sky-700" : "text-neutral-700"}>Text Message</span>
              </label>

              <label 
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  values.contactMethod === "email" 
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200" 
                    : "border-neutral-300 hover:border-sky-300"
                } cursor-pointer transition`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={values.contactMethod === "email"}
                  onChange={() => handleContactMethodChange("email")}
                  className="sr-only"
                />
                <Mail size={20} className={values.contactMethod === "email" ? "text-sky-600" : "text-neutral-500"} />
                <span className={values.contactMethod === "email" ? "font-medium text-sky-700" : "text-neutral-700"}>Email</span>
              </label>
            </div>
          </div>

          {/* Description - spans 2 columns on desktop */}
          <textarea
            className="md:col-span-2 h-32 border border-neutral-300 rounded-md px-4 py-3 outline-sky-500 resize-none"
            name="description"
            placeholder="Tell us what needs doing…"
            value={values.description}
            onChange={handleChange}
          />

          {/* file uploader */}
          <label className="md:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-md py-6 cursor-pointer hover:border-sky-500 transition">
            <span className="text-sm text-neutral-600">
              {values.file ? values.file.name : "Attach photo or video"}
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className="md:col-span-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
          >
            {sending ? "Submitting…" : "SUBMIT"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default QuoteForm;