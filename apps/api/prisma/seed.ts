import { prisma } from "../src/config/database";
import { logger } from "../src/common/utils/logger";

/**
 * Seed script — intentionally empty in Phase 1.
 *
 * Will seed a test conference, tracks, and sample users once those
 * modules exist (Phase 2+), useful for local dev and demo environments.
 */
async function main(): Promise<void> {
  logger.info("No seed data defined yet (Phase 1). Skipping.");
}

main()
  .catch((err) => {
    logger.error({ err }, "Seed script failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });