// functions/index.js
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');
const nodemailer = require('nodemailer');
const { defineString, defineSecret } = require('firebase-functions/params');
const emailConfig = require('./emailConfig');
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Environment variables (all using v2 parameter system)
const SMTP_HOST = defineString('SMTP_HOST');
const SMTP_PORT = defineString('SMTP_PORT'); 
const SMTP_USER = defineString('SMTP_USER');
const SMTP_PASS = defineSecret('SMTP_PASS');
const ADMIN_EMAIL = defineString('ADMIN_EMAIL');
const FROM_EMAIL = defineString('FROM_EMAIL');

// Create transporter for Namecheap SMTP
const createTransporter = () => {
  console.log('=== DEBUGGING SMTP SETUP ===');
  console.log('Starting createTransporter function');
  
  try {
    console.log('SMTP_HOST:', SMTP_HOST.value());
    console.log('SMTP_PORT:', SMTP_PORT.value());
    console.log('SMTP_USER:', SMTP_USER.value());
    console.log('SMTP_PASS exists:', SMTP_PASS.value() ? 'YES' : 'NO');
    console.log('SMTP_PASS length:', SMTP_PASS.value() ? SMTP_PASS.value().length : 0);
  } catch (error) {
    console.log('ERROR accessing parameters:', error.message);
  }
  return nodemailer.createTransport({
    host: SMTP_HOST.value(),
    port: parseInt(SMTP_PORT.value()),
    secure: SMTP_PORT.value() === '465', // true for 465, false for other ports
    auth: {
      user: SMTP_USER.value(),
      pass: SMTP_PASS.value(),
    },
  });
};

// Helper function to replace template variables
const replaceTemplateVars = (template, variables) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] || match;
  });
};

// Generate email templates using configuration
const getQuoteConfirmationEmail = (data) => {
  const { name, email, description, houseFlatNumber, streetName, postcode } = data;
  const config = emailConfig;
  
  const templateVars = {
    name,
    responseTime: config.settings.quoteResponseTime,
    phone: config.company.phone,
    companyName: config.company.name
  };
  
  const greeting = replaceTemplateVars(config.content.quote.greeting, templateVars);
  const thankYou = replaceTemplateVars(config.content.quote.thankYou, templateVars);
  const contactInfo = replaceTemplateVars(config.content.quote.contactInfo, templateVars);
  const signature = replaceTemplateVars(config.content.quote.signature, templateVars);
  
  return {
    subject: config.templates.quote.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: ${config.styling.fonts.primary}; line-height: 1.6; color: ${config.styling.textColor}; }
            .container { max-width: ${config.styling.containerMaxWidth}; margin: 0 auto; padding: ${config.styling.containerPadding}; }
            .header { background: linear-gradient(135deg, ${config.styling.primaryColor}, ${config.styling.secondaryColor}); color: white; padding: ${config.styling.containerPadding}; text-align: center; border-radius: ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius} 0 0; }
            .content { background: ${config.styling.backgroundColor}; padding: ${config.styling.containerPadding}; border-radius: 0 0 ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius}; }
            .details { background: white; padding: ${config.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .next-steps { background: white; padding: ${config.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ Quote Request Received!</h1>
            </div>
            <div class="content">
              <p>${greeting}</p>
              
              <p>${thankYou}</p>
              ${config.templates.quote.customMessage ? `<p>${config.templates.quote.customMessage}</p>` : ''}
              
              <div class="details">
                <h3>Your Request Details:</h3>
                <p><strong>Address:</strong> ${houseFlatNumber} ${streetName}, ${postcode}</p>
                <p><strong>Work Description:</strong> ${description}</p>
                <p><strong>Contact Email:</strong> ${email}</p>
              </div>
              
              ${config.templates.quote.includeNextSteps ? `
              <div class="next-steps">
                <p>In the meantime, here's what happens next:</p>
                <ul>
                  ${config.content.quote.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
              
              <p>${contactInfo}</p>
              
              <p>${signature.replace('\n', '<br>')}</p>
            </div>
            <div class="footer">
              <p>${config.content.quote.footer}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${greeting}

${thankYou}
${config.templates.quote.customMessage || ''}

Your Request Details:
- Address: ${houseFlatNumber} ${streetName}, ${postcode}
- Work Description: ${description}
- Contact Email: ${email}

${config.templates.quote.includeNextSteps ? `
What happens next:
${config.content.quote.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
` : ''}

${contactInfo}

${signature}
    `
  };
};

const getServiceProviderConfirmationEmail = (data) => {
  const { firstName, lastName, email, companyName, serviceAreas } = data;
  const config = emailConfig;
  
  const templateVars = {
    firstName,
    reviewTime: config.settings.applicationReviewTime
  };
  
  const greeting = replaceTemplateVars(config.content.serviceProvider.greeting, templateVars);
  const thankYou = replaceTemplateVars(config.content.serviceProvider.thankYou, templateVars);
  const reviewTime = replaceTemplateVars(config.content.serviceProvider.reviewTime, templateVars);
  
  return {
    subject: config.templates.serviceProvider.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: ${config.styling.fonts.primary}; line-height: 1.6; color: ${config.styling.textColor}; }
            .container { max-width: ${config.styling.containerMaxWidth}; margin: 0 auto; padding: ${config.styling.containerPadding}; }
            .header { background: linear-gradient(135deg, ${config.styling.primaryColor}, ${config.styling.secondaryColor}); color: white; padding: ${config.styling.containerPadding}; text-align: center; border-radius: ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius} 0 0; }
            .content { background: ${config.styling.backgroundColor}; padding: ${config.styling.containerPadding}; border-radius: 0 0 ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius}; }
            .details { background: white; padding: ${config.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ Application Received!</h1>
            </div>
            <div class="content">
              <p>${greeting}</p>
              
              <p>${thankYou}</p>
              ${config.templates.serviceProvider.customMessage ? `<p>${config.templates.serviceProvider.customMessage}</p>` : ''}
              
              <div class="details">
                <h3>Application Details:</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
                <p><strong>Service Areas:</strong> ${serviceAreas.join(', ')}</p>
                <p><strong>Contact Email:</strong> ${email}</p>
              </div>
              
              ${config.templates.serviceProvider.includeApplicationProcess ? `
              <p>${reviewTime}</p>
              <ul>
                ${config.content.serviceProvider.reviewProcess.map(step => `<li>${step}</li>`).join('')}
              </ul>
              ` : ''}
              
              <p>If you have any questions about the process, please feel free to reach out.</p>
              
              <p>${config.content.serviceProvider.signature.replace('\n', '<br>')}</p>
            </div>
            <div class="footer">
              <p>${config.content.serviceProvider.footer}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${greeting}

${thankYou}
${config.templates.serviceProvider.customMessage || ''}

Application Details:
- Name: ${firstName} ${lastName}
${companyName ? `- Company: ${companyName}` : ''}
- Service Areas: ${serviceAreas.join(', ')}
- Contact Email: ${email}

${config.templates.serviceProvider.includeApplicationProcess ? `
${reviewTime}
${config.content.serviceProvider.reviewProcess.map((step, index) => `${index + 1}. ${step}`).join('\n')}
` : ''}

${config.content.serviceProvider.signature}
    `
  };
};

const getAdminNotificationEmail = (type, data) => {
  const config = emailConfig;
  const isQuote = type === 'quote';
  
  // Check for priority flags
  const isUrgent = isQuote && config.templates.admin.customNotifications.urgentKeywords.some(keyword => 
    data.description?.toLowerCase().includes(keyword.toLowerCase())
  );
  
  const isPriorityArea = isQuote && config.templates.admin.customNotifications.priorityAreas.some(area => 
    data.postcode?.toLowerCase().includes(area.toLowerCase())
  );
  
  if (isQuote) {
    const { name, email, phone, description, contactMethod, houseFlatNumber, streetName, postcode, fileUrl } = data;
    const subjectPrefix = config.templates.admin.quoteSubjectPrefix;
    
    return {
      subject: `${subjectPrefix} from ${name}${isUrgent ? ' [URGENT]' : ''}${isPriorityArea ? ' [PRIORITY AREA]' : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: ${config.styling.fonts.primary}; line-height: 1.6; color: ${config.styling.textColor}; }
              .container { max-width: ${config.styling.containerMaxWidth}; margin: 0 auto; padding: ${config.styling.containerPadding}; }
              .header { background: ${config.styling.accentColor}; color: ${config.styling.primaryColor}; padding: ${config.styling.containerPadding}; text-align: center; border-radius: ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius} 0 0; }
              .content { background: ${config.styling.backgroundColor}; padding: ${config.styling.containerPadding}; border-radius: 0 0 ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius}; }
              .details { background: white; padding: ${config.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
              .urgent { background: #fee2e2; border-left: 4px solid #ef4444; padding: 10px; margin: 10px 0; }
              .priority { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 New Quote Request</h1>
              </div>
              <div class="content">
                ${isUrgent || isPriorityArea ? `
                  <div class="${isUrgent ? 'urgent' : 'priority'}">
                    <strong>${isUrgent ? '🚨 URGENT REQUEST:' : '⭐ PRIORITY AREA:'}</strong> 
                    ${isUrgent ? 'Customer has indicated urgent/emergency work needed' : 'Request from priority service area'}
                  </div>
                ` : ''}
                
                ${config.templates.admin.urgentFlag ? `
                <div class="urgent">
                  <strong>Action Required:</strong> New customer quote request needs response within ${config.settings.quoteResponseTime}
                </div>
                ` : ''}
                
                <div class="details">
                  <h3>Customer Information:</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                  <p><strong>Preferred Contact:</strong> ${contactMethod}</p>
                </div>
                
                <div class="details">
                  <h3>Job Location:</h3>
                  <p>${houseFlatNumber} ${streetName}<br>${postcode}</p>
                </div>
                
                <div class="details">
                  <h3>Work Description:</h3>
                  <p>${description}</p>
                </div>
                
                ${fileUrl ? `
                <div class="details">
                  <h3>Attached File:</h3>
                  <p><a href="${fileUrl}" target="_blank">View Attachment</a></p>
                </div>
                ` : ''}
                
                <div class="details">
                  <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
${isUrgent ? '🚨 URGENT ' : ''}${isPriorityArea ? '⭐ PRIORITY AREA ' : ''}New Quote Request - Action Required

Customer: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Preferred Contact: ${contactMethod}

Address: ${houseFlatNumber} ${streetName}, ${postcode}

Description: ${description}

${fileUrl ? `Attachment: ${fileUrl}` : ''}

Submitted: ${new Date().toLocaleString()}

${isUrgent ? 'NOTE: Customer has indicated urgent/emergency work needed' : ''}
${isPriorityArea ? 'NOTE: Request from priority service area' : ''}
      `
    };
  } else {
    const { firstName, lastName, email, companyName, primaryContactNumber, serviceAreas } = data;
    const subjectPrefix = config.templates.admin.serviceProviderSubjectPrefix;
    
    return {
      subject: `${subjectPrefix} from ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: ${config.styling.fonts.primary}; line-height: 1.6; color: ${config.styling.textColor}; }
              .container { max-width: ${config.styling.containerMaxWidth}; margin: 0 auto; padding: ${config.styling.containerPadding}; }
              .header { background: ${config.styling.accentColor}; color: ${config.styling.primaryColor}; padding: ${config.styling.containerPadding}; text-align: center; border-radius: ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius} 0 0; }
              .content { background: ${config.styling.backgroundColor}; padding: ${config.styling.containerPadding}; border-radius: 0 0 ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius}; }
              .details { background: white; padding: ${config.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 New Service Provider Application</h1>
              </div>
              <div class="content">
                <div class="details">
                  <h3>Applicant Information:</h3>
                  <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${primaryContactNumber}</p>
                  ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
                  <p><strong>Service Areas:</strong> ${serviceAreas.join(', ')}</p>
                </div>
                
                <div class="details">
                  <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Status:</strong> Pending Review</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Service Provider Application

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${primaryContactNumber}
${companyName ? `Company: ${companyName}` : ''}
Service Areas: ${serviceAreas.join(', ')}

Submitted: ${new Date().toLocaleString()}
Status: Pending Review
      `
    };
  }
};

const getProviderApprovalEmail = (data) => {
  const { firstName, lastName, email } = data;
  const config = emailConfig;

  const templateVars = {
    firstName,
    companyName: config.company.name,
    email: config.company.email
  };

  const greeting = replaceTemplateVars(config.content.providerApproval.greeting, templateVars);
  const signature = replaceTemplateVars(config.content.providerApproval.signature, templateVars);
  const footer = replaceTemplateVars(config.content.providerApproval.footer, templateVars);

  return {
    subject: config.templates.providerApproval.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: ${config.styling.fonts.primary}; line-height: 1.6; color: ${config.styling.textColor}; }
            .container { max-width: ${config.styling.containerMaxWidth}; margin: 0 auto; padding: ${config.styling.containerPadding}; }
            .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: ${config.styling.containerPadding}; text-align: center; border-radius: ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius} 0 0; }
            .content { background: ${config.styling.backgroundColor}; padding: ${config.styling.containerPadding}; border-radius: 0 0 ${config.styling.spacing.borderRadius} ${config.styling.spacing.borderRadius}; }
            .success-badge { background: #D1FAE5; color: #065F46; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; margin: 20px 0; }
            .next-steps { background: white; padding: ${config.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
            .cta-button { display: inline-block; background: ${config.styling.accentColor}; color: ${config.styling.primaryColor}; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .cta-button:hover { background: #E6C000; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Application Approved!</h1>
            </div>
            <div class="content">
              <p>${greeting}</p>

              <div class="success-badge">
                ✓ Your application has been approved!
              </div>

              <p>${config.content.providerApproval.congratulations}</p>
              ${config.templates.providerApproval.customMessage ? `<p>${config.templates.providerApproval.customMessage}</p>` : ''}

              <div class="next-steps">
                <h3>What's Next:</h3>
                <ul>
                  ${config.content.providerApproval.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>

              <p>${config.content.providerApproval.accountSetupInfo}</p>

              <div style="text-align: center;">
                <a href="${config.content.providerApproval.accountCreationLink}" class="cta-button">
                  Create Your Account
                </a>
              </div>

              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                Or copy this link: <a href="${config.content.providerApproval.accountCreationLink}">${config.content.providerApproval.accountCreationLink}</a>
              </p>

              <p>${signature.replace('\n', '<br>')}</p>
            </div>
            <div class="footer">
              <p>${footer}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${greeting}

✓ YOUR APPLICATION HAS BEEN APPROVED!

${config.content.providerApproval.congratulations}
${config.templates.providerApproval.customMessage || ''}

What's Next:
${config.content.providerApproval.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

${config.content.providerApproval.accountSetupInfo}

CREATE YOUR ACCOUNT HERE:
${config.content.providerApproval.accountCreationLink}

${signature}

---
${footer}
    `
  };
};

// Cloud Function for quote submissions
exports.onQuoteCreated = onDocumentCreated(
  { document: 'quotes/{quoteId}', secrets: [SMTP_PASS] }, 
  async (event) => {  try {
    const quoteData = event.data.data();
    const transporter = createTransporter();
    const config = emailConfig;
    
    // Send confirmation email to customer
    const confirmationEmail = getQuoteConfirmationEmail(quoteData);
    await transporter.sendMail({
      from: FROM_EMAIL.value(),
      to: quoteData.email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
      text: confirmationEmail.text,
    });
    
    // Send notification emails to all admins
    const adminEmail = getAdminNotificationEmail('quote', quoteData);
    const adminEmails = config.settings.adminEmails.length > 0 
      ? config.settings.adminEmails 
      : [ADMIN_EMAIL.value()];
    
    // Send to all admin emails
    for (const adminAddress of adminEmails) {
      await transporter.sendMail({
        from: FROM_EMAIL.value(),
        to: adminAddress,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      });
    }
    
    logger.info(`Quote emails sent successfully for quote ${event.params.quoteId}`, {
      customerEmail: quoteData.email,
      adminEmails: adminEmails,
      hasAttachment: !!quoteData.fileUrl
    });
  } catch (error) {
    logger.error('Error sending quote emails:', {
      quoteId: event.params.quoteId,
      error: error.message,
      stack: error.stack
    });
    // Don't throw - we don't want to prevent the quote from being saved
  }
});

// Cloud Function for service provider applications
exports.onServiceProviderCreated = onDocumentCreated(
  { document: 'serviceProviders/{providerId}', secrets: [SMTP_PASS] }, 
  async (event) => {
  try {
    const providerData = event.data.data();
    const transporter = createTransporter();
    const config = emailConfig;
    
    // Send confirmation email to applicant
    const confirmationEmail = getServiceProviderConfirmationEmail(providerData);
    await transporter.sendMail({
      from: FROM_EMAIL.value(),
      to: providerData.email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
      text: confirmationEmail.text,
    });
    
    // Send notification emails to all admins
    const adminEmail = getAdminNotificationEmail('serviceProvider', providerData);
    const adminEmails = config.settings.adminEmails.length > 0 
      ? config.settings.adminEmails 
      : [ADMIN_EMAIL.value()];
    
    // Send to all admin emails
    for (const adminAddress of adminEmails) {
      await transporter.sendMail({
        from: FROM_EMAIL.value(),
        to: adminAddress,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      });
    }
    
    logger.info(`Service provider emails sent successfully for provider ${event.params.providerId}`, {
      applicantEmail: providerData.email,
      adminEmails: adminEmails,
      serviceAreas: providerData.serviceAreas
    });
  } catch (error) {
    logger.error('Error sending service provider emails:', {
      providerId: event.params.providerId,
      error: error.message,
      stack: error.stack
    });
    // Don't throw - we don't want to prevent the application from being saved
  }
});

// Cloud Function for service provider approval
exports.onServiceProviderStatusUpdated = onDocumentUpdated(
  { document: 'serviceProviders/{providerId}', secrets: [SMTP_PASS] },
  async (event) => {
    try {
      const beforeData = event.data.before.data();
      const afterData = event.data.after.data();

      // Check if status changed to 'approved'
      if (beforeData.status !== 'approved' && afterData.status === 'approved') {
        const transporter = createTransporter();
        const approvalEmail = getProviderApprovalEmail(afterData);

        // Send approval email to the provider
        await transporter.sendMail({
          from: FROM_EMAIL.value(),
          to: afterData.email,
          subject: approvalEmail.subject,
          html: approvalEmail.html,
          text: approvalEmail.text,
        });

        logger.info(`Provider approval email sent successfully for provider ${event.params.providerId}`, {
          providerEmail: afterData.email,
          providerName: `${afterData.firstName} ${afterData.lastName}`,
          statusChange: `${beforeData.status} -> ${afterData.status}`
        });
      }
    } catch (error) {
      logger.error('Error sending provider approval email:', {
        providerId: event.params.providerId,
        error: error.message,
        stack: error.stack
      });
      // Don't throw - we don't want to prevent the status update from being saved
    }
  }
);
