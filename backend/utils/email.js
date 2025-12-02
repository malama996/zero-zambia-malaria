const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});

// Send verification email
exports.sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Zero Malaria Zambia <noreply@zeromalaria.zm>',
    to: email,
    subject: 'Verify Your Email - Zero Malaria Zambia',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0093D5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Zero Malaria Zambia</h1>
        </div>
        <div style="padding: 30px; background: #f5f5f5;">
          <h2 style="color: #333;">Welcome, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining the fight against malaria. Please verify your email address to activate your account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #0093D5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">
            If you didn't create this account, please ignore this email.
          </p>
          <p style="color: #999; font-size: 12px;">
            This link will expire in 24 hours.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Zero Malaria Zambia <noreply@zeromalaria.zm>',
    to: email,
    subject: 'Password Reset Request - Zero Malaria Zambia',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0093D5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Zero Malaria Zambia</h1>
        </div>
        <div style="padding: 30px; background: #f5f5f5;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${name}, we received a request to reset your password. Click the button below to create a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #0093D5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </p>
          <p style="color: #999; font-size: 12px;">
            This link will expire in 1 hour.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send new case notification to health professionals
exports.sendNewCaseNotification = async (email, name, caseDetails) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Zero Malaria Zambia <noreply@zeromalaria.zm>',
    to: email,
    subject: 'New Malaria Case Reported - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #DE2010; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚨 New Case Alert</h1>
        </div>
        <div style="padding: 30px; background: #f5f5f5;">
          <h2 style="color: #333;">Hello, ${name}</h2>
          <p style="color: #666; line-height: 1.6;">
            A new malaria case has been reported in your area and requires attention.
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0093D5; margin-top: 0;">Case Details:</h3>
            <p><strong>District:</strong> ${caseDetails.district || 'Unknown'}</p>
            <p><strong>Patient Age:</strong> ${caseDetails.patientAge} years</p>
            <p><strong>Gender:</strong> ${caseDetails.patientGender}</p>
            <p><strong>RDT Result:</strong> <span style="color: ${caseDetails.rdtResult === 'Positive' ? '#DE2010' : '#198A00'}; font-weight: bold;">${caseDetails.rdtResult}</span></p>
            <p><strong>Reported:</strong> ${new Date(caseDetails.createdAt).toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="background: #0093D5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
