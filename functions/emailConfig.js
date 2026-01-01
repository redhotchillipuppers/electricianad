// functions/emailConfig.js
// Configuration file for email settings and templates

const emailConfig = {
  // Company/Brand Information
  company: {
    name: "AMPALIGN",
    website: "https://Ampalign.pro", // Update with your actual website
    phone: "", // Update with your actual phone number
    email: "Info@Ampalign.pro",
    address: "Lincolnshire" // Update with your actual business address
  },

  // Email Settings
  settings: {
    // Response time promises
    quoteResponseTime: "24 hours",
    applicationReviewTime: "3-5 business days",
    
    // Admin notification settings
    adminEmails: [
      "johnconnolly38@googlemail.com"
      // Add more admin emails here if needed
    ],
    
    // Service provider notification settings
    notifyServiceProviders: false, // Set to true to notify SPs of new jobs
    serviceProviderNotificationAreas: [], // Specific areas to notify about
    
    // Email frequency limits (future feature)
    maxEmailsPerHour: 50,
    enableRateLimiting: false
  },

  // Email Templates Configuration
  templates: {
    quote: {
      subject: "Quote Request Received - We'll Be In Touch Soon!",
      headerColor: "#1E40AF",
      accentColor: "#FFD300",
      includeNextSteps: true,
      includeBranding: true,
      customMessage: "" // Add custom message to all quote confirmations
    },
    
    serviceProvider: {
      subject: "Service Provider Application Received",
      headerColor: "#1E40AF",
      accentColor: "#FFD300",
      includeApplicationProcess: true,
      includeBranding: true,
      customMessage: "" // Add custom message to all SP confirmations
    },
    
    admin: {
      quoteSubjectPrefix: "🔔 New Quote Request",
      serviceProviderSubjectPrefix: "🔔 New Service Provider Application",
      urgentFlag: true, // Show urgent styling for quotes
      includeDirectLinks: false, // Set to true if you have an admin dashboard
      customNotifications: {
        highValueJobs: 1000, // Flag jobs over this value
        priorityAreas: [], // Flag jobs in these postcodes
        urgentKeywords: ["emergency", "urgent", "asap"] // Flag descriptions with these words
      }
    }
  },

  // Email Content Customization
  content: {
    quote: {
      greeting: "Hi {name},",
      thankYou: "Thank you for requesting a quote! We've received your details and one of our qualified electricians will be in touch.",
      
      nextSteps: [
        "We'll review your requirements",
        "One of our electricians will contact you to discuss your needs",
        "We'll arrange a convenient time for a free, no-obligation quote",
        "You'll receive a detailed written quote."
      ],
      
      contactInfo: "",
      
      signature: "Best regards,\n{companyName} Team",
      
      footer: "This is an automated confirmation email. Please do not reply to this address."
    },
    
    serviceProvider: {
      greeting: "Hi {firstName},",
      thankYou: "Thank you for your interest in joining our network of service providers! We've received your application and will review it carefully.",
      
      reviewProcess: [
        "Verification of qualifications and certifications",
        "Reference checks", 
        "Discussion of our partnership terms",
        "Onboarding process if approved"
      ],
      
      reviewTime: "Our review process typically takes {reviewTime}. We'll contact you with next steps, which may include:",
      
      signature: "Best regards,\nPartnership Team",
      
      footer: "This is an automated confirmation email. Please do not reply to this address."
    }
  },

  // Styling Configuration
  styling: {
    primaryColor: "#1E40AF",
    secondaryColor: "#1E3A8A", 
    accentColor: "#FFD300",
    textColor: "#333333",
    backgroundColor: "#f9f9f9",
    containerMaxWidth: "600px",
    
    fonts: {
      primary: "Arial, sans-serif",
      heading: "Arial, sans-serif"
    },
    
    spacing: {
      containerPadding: "20px",
      sectionPadding: "15px",
      borderRadius: "8px"
    }
  }
};

module.exports = emailConfig;