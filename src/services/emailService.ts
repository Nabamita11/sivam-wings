import { JobApplication } from '../types';
import { FOUNDER_INFO } from '../data/mockData';

export interface EmailNotification {
  id: string;
  recipient: string;
  recipientName: string;
  sender: string;
  subject: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  timestamp: string;
  status: 'Delivered' | 'Queued' | 'Failed';
  previewText: string;
  htmlBody: string;
}

export const emailService = {
  /**
   * Dispatches a mock email notification to the owner's email address
   * whenever a new job application is submitted.
   */
  sendApplicationNotification: async (
    application: JobApplication
  ): Promise<EmailNotification> => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const emailId = `EML-${Date.now().toString().slice(-6)}`;
    const recipient = FOUNDER_INFO.email; // vinay@sivamwings.com
    const subject = `[New Application Received] ${application.jobTitle} — ${application.candidateName} (Ref: ${application.id})`;

    const previewText = `Candidate ${application.candidateName} (${application.experienceYears}y exp, Notice: ${application.noticePeriod}) has applied for ${application.jobTitle}.`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #4338ca, #701a75); padding: 24px; color: white;">
          <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Sivam Wings</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Skilled People | Stronger Businesses</p>
        </div>
        
        <div style="padding: 24px; background: #ffffff;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #166534; font-weight: bold;">
              🔔 New Job Application Notification for Vinay Jalan
            </p>
          </div>

          <h3 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">
            Application for: <span style="color: #2563eb;">${application.jobTitle}</span>
          </h3>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; width: 35%;">Application Ref:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Candidate Name:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.candidateName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Contact Phone:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2563eb;">${application.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Email Address:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Location:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.currentLocation}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Total Experience:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.experienceYears} Years</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Qualification:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.highestQualification}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Notice Period:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.noticePeriod}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Expected CTC:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #166534;">${application.expectedSalary}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Resume Attached:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${application.resumeFileName}</td>
            </tr>
          </table>

          ${
            application.coverNote
              ? `<div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; margin-bottom: 20px; font-size: 13px; font-style: italic; color: #334155;">
                  "${application.coverNote}"
                </div>`
              : ''
          }

          <div style="text-align: center; margin-top: 24px;">
            <a href="tel:${application.phone}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; margin-right: 8px;">
              Call Candidate
            </a>
            <a href="https://wa.me/${application.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px;">
              WhatsApp Invite
            </a>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 16px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">Sivam Wings Automated Dispatch System · To Vinay Jalan</p>
          <p style="margin: 4px 0 0;">Recipient: ${recipient} · Timestamp: ${timestamp}</p>
        </div>
      </div>
    `;

    const notification: EmailNotification = {
      id: emailId,
      recipient,
      recipientName: 'Vinay Jalan (Owner)',
      sender: 'applications@sivamwings.com',
      subject,
      applicationId: application.id,
      candidateName: application.candidateName,
      jobTitle: application.jobTitle,
      timestamp,
      status: 'Delivered',
      previewText,
      htmlBody,
    };

    // Save to persistent local storage outbox
    try {
      const existingStr = localStorage.getItem('seven_star_email_outbox');
      const outbox: EmailNotification[] = existingStr ? JSON.parse(existingStr) : [];
      outbox.unshift(notification);
      localStorage.setItem('seven_star_email_outbox', JSON.stringify(outbox));
    } catch (e) {
      console.warn('Could not persist mock email notification:', e);
    }

    // Attempt backend endpoint trigger if backend is running
    try {
      await fetch('/api/notify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application,
          notification,
          targetEmail: recipient,
        }),
      }).catch(() => {
        // Fallback gracefully in pure client environment
      });
    } catch {
      // Backend request silent fallback
    }

    console.log(
      `%c[Sivam Wings Email Service] Dispatched notification to ${recipient}`,
      'color: #10b981; font-weight: bold; font-size: 12px;',
      notification
    );

    return notification;
  },

  /**
   * Retrieves all logged email notifications sent to Vinay Jalan
   */
  getOutbox: (): EmailNotification[] => {
    try {
      const existingStr = localStorage.getItem('seven_star_email_outbox');
      return existingStr ? JSON.parse(existingStr) : [];
    } catch {
      return [];
    }
  },

  deleteFromOutbox: (id: string): EmailNotification[] => {
    const updated = emailService.getOutbox().filter((item) => item.id !== id);
    try { localStorage.setItem('seven_star_email_outbox', JSON.stringify(updated)); } catch (error) { console.warn('Could not save email outbox changes:', error); }
    return updated;
  },

  clearOutbox: (): void => {
    try { localStorage.setItem('seven_star_email_outbox', JSON.stringify([])); } catch (error) { console.warn('Could not clear email outbox:', error); }
  },
};
