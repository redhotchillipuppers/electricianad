// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');
const nodemailer = require('nodemailer');
const { defineString } = require('firebase-functions/params');
const functions = require('firebase-functions');
const emailConfig = require('./emailConfig');

// Environment variables (hybrid approach: config + secrets)
const config = functions.config();

// Keep password as secret, others as config
const SMTP_PASS = defineString('SMTP_PASS');

// Create transporter for Namecheap SMTP
const createTransporter = () => {
  console.log('SMTP_HOST:', config.smtp.host);
  console.log('SMTP_PORT:', config.smtp.port);
  console.log('SMTP_USER:', config.smtp.user);
  console.log('SMTP_PASS exists:', SMTP_PASS.value() ? 'YES' : 'NO');
  
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: parseInt(config.smtp.port),
    secure: config.smtp.port === '465', // true for 465, false for other ports
    auth: {
      user: config.smtp.user,
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
  const emailConf = emailConfig;
  
  const templateVars = {
    name,
    responseTime: emailConf.settings.quoteResponseTime,
    phone: emailConf.company.phone,
    companyName: emailConf.company.name
  };
  
  const greeting = replaceTemplateVars(emailConf.content.quote.greeting, templateVars);
  const thankYou = replaceTemplateVars(emailConf.content.quote.thankYou, templateVars);
  const contactInfo = replaceTemplateVars(emailConf.content.quote.contactInfo, templateVars);
  const signature = replaceTemplateVars(emailConf.content.quote.signature, templateVars);
  
  return {
    subject: emailConf.templates.quote.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: ${emailConf.styling.fonts.primary}; line-height: 1.6; color: ${emailConf.styling.textColor}; }
            .container { max-width: ${emailConf.styling.containerMaxWidth}; margin: 0 auto; padding: ${emailConf.styling.containerPadding}; }
            .header { background: linear-gradient(135deg, ${emailConf.styling.primaryColor}, ${emailConf.styling.secondaryColor}); color: white; padding: ${emailConf.styling.containerPadding}; text-align: center; border-radius: ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius} 0 0; }
            .content { background: ${emailConf.styling.backgroundColor}; padding: ${emailConf.styling.containerPadding}; border-radius: 0 0 ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius}; }
            .details { background: white; padding: ${emailConf.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .next-steps { background: white; padding: ${emailConf.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
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
              ${emailConf.templates.quote.customMessage ? `<p>${emailConf.templates.quote.customMessage}</p>` : ''}
              
              <div class="details">
                <h3>Your Request Details:</h3>
                <p><strong>Address:</strong> ${houseFlatNumber} ${streetName}, ${postcode}</p>
                <p><strong>Work Description:</strong> ${description}</p>
                <p><strong>Contact Email:</strong> ${email}</p>
              </div>
              
              ${emailConf.templates.quote.includeNextSteps ? `
              <div class="next-steps">
                <p>In the meantime, here's what happens next:</p>
                <ul>
                  ${emailConf.content.quote.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
              
              <p>${contactInfo}</p>
              
              <p>${signature.replace('\n', '<br>')}</p>
            </div>
            <div class="footer">
              <p>${emailConf.content.quote.footer}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${greeting}

${thankYou}
${emailConf.templates.quote.customMessage || ''}

Your Request Details:
- Address: ${houseFlatNumber} ${streetName}, ${postcode}
- Work Description: ${description}
- Contact Email: ${email}

${emailConf.templates.quote.includeNextSteps ? `
What happens next:
${emailConf.content.quote.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
` : ''}

${contactInfo}

${signature}
    `
  };
};

const getServiceProviderConfirmationEmail = (data) => {
  const { firstName, lastName, email, companyName, serviceAreas } = data;
  const emailConf = emailConfig;
  
  const templateVars = {
    firstName,
    reviewTime: emailConf.settings.applicationReviewTime
  };
  
  const greeting = replaceTemplateVars(emailConf.content.serviceProvider.greeting, templateVars);
  const thankYou = replaceTemplateVars(emailConf.content.serviceProvider.thankYou, templateVars);
  const reviewTime = replaceTemplateVars(emailConf.content.serviceProvider.reviewTime, templateVars);
  
  return {
    subject: emailConf.templates.serviceProvider.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: ${emailConf.styling.fonts.primary}; line-height: 1.6; color: ${emailConf.styling.textColor}; }
            .container { max-width: ${emailConf.styling.containerMaxWidth}; margin: 0 auto; padding: ${emailConf.styling.containerPadding}; }
            .header { background: linear-gradient(135deg, ${emailConf.styling.primaryColor}, ${emailConf.styling.secondaryColor}); color: white; padding: ${emailConf.styling.containerPadding}; text-align: center; border-radius: ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius} 0 0; }
            .content { background: ${emailConf.styling.backgroundColor}; padding: ${emailConf.styling.containerPadding}; border-radius: 0 0 ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius}; }
            .details { background: white; padding: ${emailConf.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
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
              ${emailConf.templates.serviceProvider.customMessage ? `<p>${emailConf.templates.serviceProvider.customMessage}</p>` : ''}
              
              <div class="details">
                <h3>Application Details:</h3>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
                <p><strong>Service Areas:</strong> ${serviceAreas.join(', ')}</p>
                <p><strong>Contact Email:</strong> ${email}</p>
              </div>
              
              ${emailConf.templates.serviceProvider.includeApplicationProcess ? `
              <p>${reviewTime}</p>
              <ul>
                ${emailConf.content.serviceProvider.reviewProcess.map(step => `<li>${step}</li>`).join('')}
              </ul>
              ` : ''}
              
              <p>If you have any questions about the process, please feel free to reach out.</p>
              
              <p>${emailConf.content.serviceProvider.signature.replace('\n', '<br>')}</p>
            </div>
            <div class="footer">
              <p>${emailConf.content.serviceProvider.footer}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${greeting}

${thankYou}
${emailConf.templates.serviceProvider.customMessage || ''}

Application Details:
- Name: ${firstName} ${lastName}
${companyName ? `- Company: ${companyName}` : ''}
- Service Areas: ${serviceAreas.join(', ')}
- Contact Email: ${email}

${emailConf.templates.serviceProvider.includeApplicationProcess ? `
${reviewTime}
${emailConf.content.serviceProvider.reviewProcess.map((step, index) => `${index + 1}. ${step}`).join('\n')}
` : ''}

${emailConf.content.serviceProvider.signature}
    `
  };
};

const getAdminNotificationEmail = (type, data) => {
  const emailConf = emailConfig;
  const isQuote = type === 'quote';
  
  // Check for priority flags
  const isUrgent = isQuote && emailConf.templates.admin.customNotifications.urgentKeywords.some(keyword => 
    data.description?.toLowerCase().includes(keyword.toLowerCase())
  );
  
  const isPriorityArea = isQuote && emailConf.templates.admin.customNotifications.priorityAreas.some(area => 
    data.postcode?.toLowerCase().includes(area.toLowerCase())
  );
  
  if (isQuote) {
    const { name, email, phone, description, contactMethod, houseFlatNumber, streetName, postcode, fileUrl } = data;
    const subjectPrefix = emailConf.templates.admin.quoteSubjectPrefix;
    
    return {
      subject: `${subjectPrefix} from ${name}${isUrgent ? ' [URGENT]' : ''}${isPriorityArea ? ' [PRIORITY AREA]' : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: ${emailConf.styling.fonts.primary}; line-height: 1.6; color: ${emailConf.styling.textColor}; }
              .container { max-width: ${emailConf.styling.containerMaxWidth}; margin: 0 auto; padding: ${emailConf.styling.containerPadding}; }
              .header { background: ${emailConf.styling.accentColor}; color: ${emailConf.styling.primaryColor}; padding: ${emailConf.styling.containerPadding}; text-align: center; border-radius: ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius} 0 0; }
              .content { background: ${emailConf.styling.backgroundColor}; padding: ${emailConf.styling.containerPadding}; border-radius: 0 0 ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius}; }
              .details { background: white; padding: ${emailConf.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
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
                
                ${emailConf.templates.admin.urgentFlag ? `
                <div class="urgent">
                  <strong>Action Required:</strong> New customer quote request needs response within ${emailConf.settings.quoteResponseTime}
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
    const subjectPrefix = emailConf.templates.admin.serviceProviderSubjectPrefix;
    
    return {
      subject: `${subjectPrefix} from ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: ${emailConf.styling.fonts.primary}; line-height: 1.6; color: ${emailConf.styling.textColor}; }
              .container { max-width: ${emailConf.styling.containerMaxWidth}; margin: 0 auto; padding: ${emailConf.styling.containerPadding}; }
              .header { background: ${emailConf.styling.accentColor}; color: ${emailConf.styling.primaryColor}; padding: ${emailConf.styling.containerPadding}; text-align: center; border-radius: ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius} 0 0; }
              .content { background: ${emailConf.styling.backgroundColor}; padding: ${emailConf.styling.containerPadding}; border-radius: 0 0 ${emailConf.styling.spacing.borderRadius} ${emailConf.styling.spacing.borderRadius}; }
              .details { background: white; padding: ${emailConf.styling.spacing.sectionPadding}; border-radius: 4px; margin: 15px 0; }
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

// Cloud Function for quote submissions
exports.onQuoteCreated = onDocumentCreated('quotes/{quoteId}', async (event) => {
  try {
    const quoteData = event.data.data();
    const transporter = createTransporter();
    const emailConf = emailConfig;
    
    // Send confirmation email to customer
    const confirmationEmail = getQuoteConfirmationEmail(quoteData);
    await transporter.sendMail({
      from: config.email.from,
      to: quoteData.email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
      text: confirmationEmail.text,
    });
    
    // Send notification emails to all admins
    const adminEmail = getAdminNotificationEmail('quote', quoteData);
    const adminEmails = emailConf.settings.adminEmails.length > 0 
      ? emailConf.settings.adminEmails 
      : [config.email.admin];
    
    // Send to all admin emails
    for (const adminAddress of adminEmails) {
      await transporter.sendMail({
        from: config.email.from,
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
exports.onServiceProviderCreated = onDocumentCreated('serviceProviders/{providerId}', async (event) => {
  try {
    const providerData = event.data.data();
    const transporter = createTransporter();
    const emailConf = emailConfig;
    
    // Send confirmation email to applicant
    const confirmationEmail = getServiceProviderConfirmationEmail(providerData);
    await transporter.sendMail({
      from: config.email.from,
      to: providerData.email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
      text: confirmationEmail.text,
    });
    
    // Send notification emails to all admins
    const adminEmail = getAdminNotificationEmail('serviceProvider', providerData);
    const adminEmails = emailConf.settings.adminEmails.length > 0 
      ? emailConf.settings.adminEmails 
      : [config.email.admin];
    
    // Send to all admin emails
    for (const adminAddress of adminEmails) {
      await transporter.sendMail({
        from: config.email.from,
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