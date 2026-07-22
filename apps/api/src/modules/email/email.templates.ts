export const emailTemplates = {
  reviewerAssigned(
    reviewerName: string,
    paperTitle: string
  ) {
    return `
      <h2>Hello ${reviewerName},</h2>

      <p>You have been assigned a new paper for review.</p>

      <p><b>Paper:</b> ${paperTitle}</p>

      <p>Please login to Manthan and submit your review.</p>
    `;
  },
};