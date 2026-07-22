import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  async getChairDashboard(userId: string) {
    const [
      totalConferences,
      totalTracks,
      totalPapers,
      acceptedPapers,
      rejectedPapers,
      underReviewPapers,
      draftPapers,
      totalReviewers,
      pendingReviews,
      completedReviews,
    ] = await dashboardRepository.getChairStats(userId);

    const acceptanceRate =
      totalPapers > 0
        ? Number(((acceptedPapers / totalPapers) * 100).toFixed(2))
        : 0;

    const rejectionRate =
      totalPapers > 0
        ? Number(((rejectedPapers / totalPapers) * 100).toFixed(2))
        : 0;

    const reviewCompletionRate =
      pendingReviews + completedReviews > 0
        ? Number(
            (
              (completedReviews /
                (pendingReviews + completedReviews)) *
              100
            ).toFixed(2)
          )
        : 0;

    return {
      totalConferences,
      totalTracks,
      totalPapers,
      acceptedPapers,
      rejectedPapers,
      underReviewPapers,
      draftPapers,
      totalReviewers,
      pendingReviews,
      completedReviews,
      acceptanceRate,
      rejectionRate,
      reviewCompletionRate,
    };
  },

  async getAuthorDashboard(userId: string) {
    const [
      totalPapers,
      draftPapers,
      submittedPapers,
      underReviewPapers,
      acceptedPapers,
      rejectedPapers,
    ] = await dashboardRepository.getAuthorStats(userId);

    return {
      totalPapers,
      draftPapers,
      submittedPapers,
      underReviewPapers,
      acceptedPapers,
      rejectedPapers,
    };
  },

  async getReviewerDashboard(userId: string) {
    const [
      assignedPapers,
      submittedReviews,
      pendingReviews,
      acceptedRecommendations,
      rejectedRecommendations,
    ] = await dashboardRepository.getReviewerStats(userId);

    const completionRate =
      assignedPapers > 0
        ? Number(
            ((submittedReviews / assignedPapers) * 100).toFixed(2)
          )
        : 0;

    return {
      assignedPapers,
      submittedReviews,
      pendingReviews,
      acceptedRecommendations,
      rejectedRecommendations,
      completionRate,
    };
  },
};