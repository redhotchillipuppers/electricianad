import React from "react";
import {
  Camera,
  ClipboardEdit,
  SendHorizontal,
  CheckCircle2,
  ArrowRight,
  Star
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Camera size={32} />,
      title: "Snap a Photo",
      description: "Take a quick photo of the issue or project area and upload it with your request.",
      color: "#667eea"
    },
    {
      icon: <ClipboardEdit size={32} />,
      title: "Fill the Form",
      description: "Provide your contact information and a brief description of the electrical service you need.",
      color: "#8b9aef"
    },
    {
      icon: <SendHorizontal size={32} />,
      title: "Get Your Quote",
      description: "Receive a clear, detailed quote with no hidden costs.",
      color: "#FFD300"
    },
    {
      icon: <CheckCircle2 size={32} />,
      title: "Schedule Service",
      description: "Choose a convenient time slot and our licensed electricians will arrive ready to solve your issue.",
      color: "#10b981"
    },
  ];

  const benefits = [
    { icon: "⚡", title: "Fast Response", value: "Quick Turnaround" },
    { icon: "🔒", title: "No Hidden Costs", value: "Transparent Pricing" },
    { icon: "👨‍🔧", title: "Licensed Pros", value: "Fully Qualified" },
    { icon: "📱", title: "Easy Process", value: "Mobile Friendly" }
  ];

  return (
    <section
      id="how-it-works"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%)',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Section Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '5rem'
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '50px',
            color: '#8b9aef',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1.5rem'
          }}
        >
          Simple Process
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #8b9aef 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2'
          }}
        >
          HOW IT WORKS
        </h2>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}
        >
          We've streamlined our service process to be quick and hassle-free, 
          getting your electrical needs addressed without unnecessary complications.
        </p>
      </div>

      {/* Steps */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = `${step.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto',
                boxShadow: `0 15px 30px ${step.color}30`,
                color: step.color === '#FFD300' ? '#1a1a2e' : '#fff',
                position: 'relative',
                zIndex: 1
              }}
            >
              {step.icon}
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              {step.description}
            </p>

            <div
              style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${(index + 1) * 25}%`,
                  height: '100%',
                  background: `linear-gradient(to right, ${step.color}, #FFD300)`,
                  borderRadius: '2px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '4rem'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                padding: '1rem'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                {benefit.icon}
              </div>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#8b9aef',
                  marginBottom: '0.25rem'
                }}
              >
                {benefit.title}
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0
                }}
              >
                {benefit.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255, 211, 0, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />

          <Star size={48} style={{ color: '#FFD300', marginBottom: '1.5rem' }} />

          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#ffffff' }}>
            Ready to Get Started?
          </h3>

          <p
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}
          >
            Join thousands of satisfied customers who chose our streamlined process 
            for their electrical needs.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                const quoteSection = document.getElementById("quote-form");
                if (quoteSection) quoteSection.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #FFD300 0%, #f59e0b 100%)',
                color: '#1a1a2e',
                fontWeight: '700',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(255, 211, 0, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 211, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 211, 0, 0.3)';
              }}
            >
              Start Your Quote Now
              <ArrowRight size={20} />
            </button>

            <button
              type="button"
              onClick={() => {
                const servicesSection = document.getElementById("services");
                if (servicesSection) servicesSection.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
