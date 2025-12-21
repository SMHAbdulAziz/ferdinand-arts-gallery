// Email notification service for raffle events
const nodemailer = require('nodemailer');

/**
 * Initialize email transporter based on environment
 * Supports: SendGrid, Gmail, Mailgun, or generic SMTP
 */
function getEmailTransporter() {
  // Option 1: SendGrid (recommended for production)
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }

  // Option 2: Gmail
  if (process.env.GMAIL_EMAIL && process.env.GMAIL_PASSWORD) {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  }

  // Option 3: Generic SMTP (Mailgun, etc.)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Default: Development (console logging)
  console.warn('No email provider configured. Emails will be logged to console.');
  return null;
}

const transporter = getEmailTransporter();

/**
 * Send free entry confirmation email
 */
export async function sendFreeEntryConfirmation(email, raffleTitle, raffleId) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@thefundgallery.org',
    to: email,
    subject: `Free Entry Confirmed - ${raffleTitle} Raffle`,
    html: `
      <h2>You're Entered! 🎉</h2>
      <p>Your free entry has been confirmed for the <strong>${raffleTitle}</strong> raffle.</p>
      
      <h3>Your Entry Details:</h3>
      <ul>
        <li><strong>Raffle:</strong> ${raffleTitle}</li>
        <li><strong>Entry Type:</strong> Free Email Entry</li>
        <li><strong>Odds:</strong> Equal to all paid ticket holders</li>
      </ul>

      <h3>What Happens Next:</h3>
      <p>
        When the raffle period ends, a winner will be randomly selected from all entries 
        (both paid and free). If you're chosen:
      </p>
      <ul>
        <li><strong>If threshold met:</strong> You'll receive the original artwork + Certificate of Authenticity</li>
        <li><strong>If threshold not met:</strong> You'll receive a cash prize</li>
      </ul>

      <p>
        <a href="https://thefundgallery.org/raffle?id=${raffleId}" style="
          background-color: #4F46E5;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
        ">
          View Raffle Details
        </a>
      </p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #666;">
        Questions? Contact us at info@thefundgallery.org<br />
        <a href="https://thefundgallery.org/raffle-protocols" style="color: #4F46E5;">
          Read our Raffle Protocols
        </a>
      </p>
    `
  };

  return sendEmail(mailOptions);
}

/**
 * Send winner announcement email
 */
export async function sendWinnerNotification(winnerEmail, raffleTitle, outcome, prize, raffleId) {
  const isArtworkAwarded = outcome === 'ARTWORK_AWARDED';

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@thefundgallery.org',
    to: winnerEmail,
    subject: `🏆 You Won! ${raffleTitle} Raffle Winner Announcement`,
    html: `
      <h1>🏆 Congratulations! You've Won!</h1>
      
      <p>You have been randomly selected as the winner of the <strong>${raffleTitle}</strong> raffle!</p>

      <div style="background-color: ${isArtworkAwarded ? '#10B981' : '#3B82F6'}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Your Prize:</h2>
        <p style="font-size: 18px; font-weight: bold;">
          ${isArtworkAwarded 
            ? '🎨 Original Artwork + Certificate of Authenticity' 
            : '💰 ' + prize}
        </p>
      </div>

      <h3>Next Steps:</h3>
      <ol>
        <li>We will contact you within 2 business days with prize details</li>
        <li>${isArtworkAwarded 
          ? 'Arrange shipping and delivery of your artwork' 
          : 'Receive your cash prize via the method you provided'}
        </li>
        <li>Enjoy your prize!</li>
      </ol>

      <h3>Raffle Details:</h3>
      <ul>
        <li><strong>Raffle:</strong> ${raffleTitle}</li>
        <li><strong>Outcome:</strong> ${isArtworkAwarded ? 'Threshold Met - Artwork Awarded' : 'Threshold Not Met - Cash Prize'}</li>
        <li><strong>Announcement Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <p>
        <a href="https://thefundgallery.org/raffle-results?id=${raffleId}" style="
          background-color: #4F46E5;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
        ">
          View Full Results
        </a>
      </p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #666;">
        Thank you for supporting emerging artists!<br />
        Questions? Contact us at info@thefundgallery.org
      </p>
    `
  };

  return sendEmail(mailOptions);
}

/**
 * Send raffle ending soon reminder
 */
export async function sendRaffleEndingReminder(email, raffleTitle, hoursRemaining, raffleId) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@thefundgallery.org',
    to: email,
    subject: `⏰ Last Chance: ${raffleTitle} Raffle Ends Soon!`,
    html: `
      <h2>⏰ Don't Miss Out!</h2>
      
      <p>The <strong>${raffleTitle}</strong> raffle ends in <strong>${hoursRemaining} hours</strong>.</p>

      <p>You have one last chance to enter and support an emerging artist while having a chance to win!</p>

      <p>
        <a href="https://thefundgallery.org/raffle?id=${raffleId}" style="
          background-color: #EF4444;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          font-weight: bold;
        ">
          Enter Now
        </a>
      </p>

      <p>No purchase necessary - you can enter for free with equal odds of winning!</p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #666;">
        <a href="https://thefundgallery.org/raffle-protocols" style="color: #4F46E5;">
          Learn about our raffle protocols
        </a>
      </p>
    `
  };

  return sendEmail(mailOptions);
}

/**
 * Send raffle results announcement (public)
 */
export async function sendRaffleResultsAnnouncement(emails, raffleTitle, outcome, raffleId) {
  const isArtworkAwarded = outcome === 'ARTWORK_AWARDED';

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@thefundgallery.org',
    bcc: emails,
    subject: `${raffleTitle} Raffle Results Announced`,
    html: `
      <h2>🎉 Raffle Results Announced!</h2>
      
      <p>The <strong>${raffleTitle}</strong> raffle has been drawn and results are in!</p>

      <div style="background-color: ${isArtworkAwarded ? '#10B981' : '#3B82F6'}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Outcome:</h3>
        <p style="font-size: 16px;">
          ${isArtworkAwarded 
            ? '✓ Threshold Met - Artwork Will Be Awarded' 
            : '💰 Threshold Not Met - Winner Receives Cash Prize'}
        </p>
      </div>

      <p>
        <a href="https://thefundgallery.org/raffle-results?id=${raffleId}" style="
          background-color: #4F46E5;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
        ">
          View Full Results
        </a>
      </p>

      <p>Thank you for supporting emerging artists! Check back soon for more raffles.</p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #666;">
        <a href="https://thefundgallery.org/raffle-protocols" style="color: #4F46E5;">
          Read our Raffle Protocols
        </a> | 
        <a href="https://thefundgallery.org/raffles" style="color: #4F46E5;">
          View All Raffles
        </a>
      </p>
    `
  };

  return sendEmail(mailOptions);
}

/**
 * Generic email sender
 */
async function sendEmail(mailOptions) {
  // If no transporter configured, log to console
  if (!transporter) {
    console.log('📧 EMAIL (Console Mode):', {
      to: mailOptions.to || mailOptions.bcc,
      subject: mailOptions.subject,
      timestamp: new Date().toISOString()
    });
    return { success: true, mode: 'console' };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    // Don't throw - email failures shouldn't block raffle operations
    return { success: false, error: error.message };
  }
}

export default {
  sendFreeEntryConfirmation,
  sendWinnerNotification,
  sendRaffleEndingReminder,
  sendRaffleResultsAnnouncement
};
