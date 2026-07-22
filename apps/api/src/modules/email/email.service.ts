import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const emailService = {
  async send(
    to: string,
    subject: string,
    html: string
  ) {
    return transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
  },

  // =========================
  // AUTH EMAILS
  // =========================

  async sendWelcomeEmail(
    email: string,
    name: string
  ) {
    return this.send(
      email,
      "Welcome to Manthan Conference Management System",
      `
      <h2>Welcome to Manthan 🎉</h2>

      <p>Dear <b>${name}</b>,</p>

      <p>Your account has been created successfully.</p>

      <p>You can now:</p>

      <ul>
        <li>Create conferences</li>
        <li>Join conferences</li>
        <li>Submit research papers</li>
        <li>Review papers</li>
        <li>Track paper status</li>
      </ul>

      <br>

      <p>
        Thank you for choosing
        <b>Manthan Conference Management System</b>.
      </p>

      <br>

      <p>
        Regards,<br>
        Manthan Team
      </p>
      `
    );
  },

  // =========================
  // REVIEWER EMAILS
  // =========================

  async sendReviewerAssignmentEmail(
    reviewerEmail: string,
    reviewerName: string,
    paperTitle: string
  ) {
    return this.send(
      reviewerEmail,
      "New Paper Assigned for Review",
      `
      <h2>New Paper Assigned for Review</h2>

      <p>Dear ${reviewerName},</p>

      <p>
        You have been assigned a new paper for review in the
        <b>Manthan Conference Management System</b>.
      </p>

      <p>
        <strong>Paper Title:</strong><br>
        ${paperTitle}
      </p>

      <p>
        Please login and submit your review before the deadline.
      </p>

      <br>

      <p>
        Regards,<br>
        Manthan Team
      </p>
      `
    );
  },

  // =========================
  // PAPER EMAILS
  // =========================

  async sendPaperAcceptedEmail(
    authorEmail: string,
    authorName: string,
    paperTitle: string
  ) {
    return this.send(
      authorEmail,
      "Paper Accepted 🎉",
      `
      <h2>Congratulations!</h2>

      <p>Dear ${authorName},</p>

      <p>
        We are pleased to inform you that your paper has been
        <b>ACCEPTED</b>.
      </p>

      <p>
        <strong>Paper Title:</strong><br>
        ${paperTitle}
      </p>

      <p>
        Congratulations and thank you for your valuable contribution.
      </p>

      <br>

      <p>
        Regards,<br>
        Manthan Team
      </p>
      `
    );
  },

  async sendPaperRejectedEmail(
    authorEmail: string,
    authorName: string,
    paperTitle: string
  ) {
    return this.send(
      authorEmail,
      "Paper Decision Notification",
      `
      <h2>Paper Decision</h2>

      <p>Dear ${authorName},</p>

      <p>
        Thank you for submitting your paper.
        After the review process, we regret to inform you that your paper
        was not accepted.
      </p>

      <p>
        <strong>Paper Title:</strong><br>
        ${paperTitle}
      </p>

      <p>
        We appreciate your effort and encourage you to submit your future
        work to upcoming conferences.
      </p>

      <br>

      <p>
        Regards,<br>
        Manthan Team
      </p>
      `
    );
  },
  async sendConferenceCreatedEmail(
  email: string,
  name: string,
  conferenceTitle: string
) {
  return this.send(
    email,
    "Conference Created Successfully",
    `
    <h2>Conference Created Successfully 🎉</h2>

    <p>Dear <b>${name}</b>,</p>

    <p>Your conference has been created successfully.</p>

    <p>
      <strong>Conference:</strong><br>
      ${conferenceTitle}
    </p>

    <p>You are now the Conference Chair.</p>

    <p>You can now:</p>

    <ul>
      <li>Create Tracks</li>
      <li>Assign Reviewers</li>
      <li>Manage Papers</li>
      <li>Publish Decisions</li>
    </ul>

    <br>

    <p>
      Regards,<br>
      Manthan Conference Management System
    </p>
    `
  );
},
async sendPaperSubmittedEmail(
  authorEmail: string,
  authorName: string,
  paperTitle: string
) {
  return this.send(
    authorEmail,
    "Paper Submitted Successfully",
    `
    <h2>Paper Submitted Successfully 📄</h2>

    <p>Dear <b>${authorName}</b>,</p>

    <p>Your paper has been submitted successfully.</p>

    <p><strong>Paper Title:</strong><br>${paperTitle}</p>

    <p>
      Your paper is now under review.
      You will receive updates regarding reviewer assignments
      and the final decision.
    </p>

    <br>

    <p>
      Regards,<br>
      Manthan Conference Management System
    </p>
    `
  );
},
async sendPaperUploadedEmail(
  authorEmail: string,
  authorName: string,
  paperTitle: string,
  version: number
) {
  return this.send(
    authorEmail,
    "Paper Version Uploaded",
    `
    <h2>Paper Version Uploaded</h2>

    <p>Dear <b>${authorName}</b>,</p>

    <p>
      A new version of your paper has been uploaded successfully.
    </p>

    <p><strong>Paper:</strong> ${paperTitle}</p>

    <p><strong>Version:</strong> ${version}</p>

    <br>

    <p>
      Regards,<br>
      Manthan Conference Management System
    </p>
    `
  );
},
async sendReviewSubmittedEmail(
  chairEmail: string,
  chairName: string,
  paperTitle: string,
  reviewerName: string
) {
  return this.send(
    chairEmail,
    "Review Submitted",
    `
    <h2>Review Submitted</h2>

    <p>Dear <b>${chairName}</b>,</p>

    <p>
      Reviewer <b>${reviewerName}</b> has submitted a review.
    </p>

    <p><strong>Paper:</strong> ${paperTitle}</p>

    <p>You can now view the submitted review.</p>

    <br>

    <p>Regards,<br>Manthan Conference Management System</p>
    `
  );
},
async sendAllReviewsCompletedEmail(
  chairEmail: string,
  chairName: string,
  paperTitle: string
) {
  return this.send(
    chairEmail,
    "All Reviews Completed",
    `
    <h2>All Reviews Completed</h2>

    <p>Dear <b>${chairName}</b>,</p>

    <p>All assigned reviews have been submitted.</p>

    <p><strong>Paper:</strong> ${paperTitle}</p>

    <p>You can now make the final ACCEPT/REJECT decision.</p>

    <br>

    <p>Regards,<br>Manthan Conference Management System</p>
    `
  );
}
};