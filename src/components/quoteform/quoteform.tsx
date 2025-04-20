import React, { useState } from "react";

// ↓— swap this with your real Firebase helper
import submitQuote from "../../firebase/submitQuote";

const QuoteForm = () => {
  const [sending, setSending] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    file: null as File | null,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitQuote(values); // 🔗 your existing Firebase call
      alert("Thanks! We’ll get back to you ASAP.");
      setValues({
        name: "",
        email: "",
        phone: "",
        description: "",
        file: null,
      });
    } catch (err) {
      console.error(err);
      alert("Whoops—something went wrong. Try again?");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-neutral-50 py-16 px-4">
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

          {/* spans 2 columns on desktop */}
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
