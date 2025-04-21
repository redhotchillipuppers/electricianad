import React, { useState, useEffect } from "react";
import { Phone, MessageSquare, Mail, Upload, Check, AlertCircle } from "lucide-react";

// ↓— swap this with your real Firebase helper
import submitQuote from "../../firebase/submitQuote";

const QuoteForm = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    file: null as File | null,
    contactMethod: "email", // Default contact method
  });

  // Generate a simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateField = (name: string, value: string) => {
    let errorMessage = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMessage = "Name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMessage = "Phone number is required";
        } else if (!/^[0-9+\-() ]{6,20}$/.test(value)) {
          errorMessage = "Please enter a valid phone number";
        }
        break;
      case "description":
        if (!value.trim()) {
          errorMessage = "Description is required";
        } else if (value.trim().split(/\s+/).length < 10) {
          errorMessage = "Please provide at least 10 words, be as detailed as possible";
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large. Please select a file under 5MB.");
        return;
      }
      // Reset error if it was related to file
      if (error && error.includes("file")) {
        setError(null);
      }
    }
    setValues((prev) => ({ ...prev, file }));
  };

  const handleContactMethodChange = (method: string) => {
    setValues((prev) => ({ ...prev, contactMethod: method }));
  };

  const resetForm = () => {
    setValues({
      name: "",
      email: "",
      phone: "",
      description: "",
      file: null,
      contactMethod: "email",
    });
    setCaptchaError(false);
    setFormErrors({
      name: "",
      email: "",
      phone: "",
      description: "",
    });
    generateCaptcha(); // Generate a new captcha after form reset
  };

  const validateForm = () => {
    const errors = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      phone: validateField("phone", values.phone),
      description: validateField("description", values.description),
    };
    
    setFormErrors(errors);
    
    // Check if any errors exist
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate the captcha
    if (captchaAnswer !== e.currentTarget.querySelector<HTMLInputElement>('input[name="captcha"]')?.value) {
      setCaptchaError(true);
      return;
    } else {
      setCaptchaError(false);
    }
    
    // Validate all fields
    if (!validateForm()) {
      return;
    }
    
    setSending(true);
    setSuccess(false);
    
    try {
      await submitQuote(values); // 🔗 your existing Firebase call
      setSuccess(true);
      resetForm();
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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

        {success && (
          <div role="alert" aria-live="assertive" className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
            <Check size={20} className="text-green-600" />
            <span className="text-green-800 font-medium">
              Thanks! We'll get back to you ASAP.
            </span>
          </div>
        )}

        {error && (
          <div role="alert" aria-live="assertive" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6 text-base"
        >
          <div>
            <input
              className={`border ${formErrors.name ? "border-red-500" : "border-neutral-300"} rounded-md px-4 py-3 outline-sky-500 w-full`}
              type="text"
              name="name"
              placeholder="Name *"
              value={values.name}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <input
              className={`border ${formErrors.email ? "border-red-500" : "border-neutral-300"} rounded-md px-4 py-3 outline-sky-500 w-full`}
              type="email"
              name="email"
              placeholder="Email *"
              value={values.email}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <input
              className={`border ${formErrors.phone ? "border-red-500" : "border-neutral-300"} rounded-md px-4 py-3 outline-sky-500 w-full`}
              type="tel"
              name="phone"
              placeholder="Phone *"
              value={values.phone}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
            )}
          </div>

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
          <div className="md:col-span-2">
            <textarea
              className={`w-full h-32 border ${formErrors.description ? "border-red-500" : "border-neutral-300"} rounded-md px-4 py-3 outline-sky-500 resize-none`}
              name="description"
              placeholder="Tell us what needs doing… (min 10 words) *"
              value={values.description}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* File uploader with improved UX */}
          <label className={`md:col-span-2 flex flex-col items-center justify-center border-2 border-dashed rounded-md py-6 cursor-pointer transition ${
            values.file ? "border-green-500 bg-green-50" : "border-neutral-300 hover:border-sky-500"
          }`}>
            <div className="flex flex-col items-center">
              {values.file ? (
                <>
                  <Check size={24} className="text-green-600 mb-2" />
                  <span className="text-green-700 font-medium">File selected</span>
                  <span className="text-sm text-neutral-700 mt-1">{values.file.name}</span>
                  <span className="text-xs text-neutral-500 mt-1">
                    {(values.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-neutral-500 mb-2" />
                  <span className="text-neutral-700 font-medium">Attach photo or video</span>
                  <span className="text-xs text-neutral-500 mt-1">Click to select a file (5MB max)</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>

          {/* Simple Captcha */}
          <div className="md:col-span-2">
            <div className="border border-neutral-300 rounded-md p-4 bg-neutral-50">
              <p className="font-medium mb-2">Security Check:</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white border border-neutral-300 p-3 rounded font-mono text-lg">
                  {captchaValue} = ?
                </div>
                <div className="flex-grow max-w-xs">
                  <input
                    type="text"
                    name="captcha"
                    placeholder="Enter result"
                    required
                    className={`border ${captchaError ? 'border-red-500' : 'border-neutral-300'} rounded-md px-4 py-2 w-full outline-sky-500`}
                    onChange={() => captchaError && setCaptchaError(false)}
                  />
                  {captchaError && (
                    <p className="text-red-500 text-sm mt-1">Incorrect answer, please try again</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-sky-600 hover:text-sky-800 text-sm underline"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="md:col-span-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 flex items-center justify-center"
          >
            {sending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "SUBMIT"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default QuoteForm;