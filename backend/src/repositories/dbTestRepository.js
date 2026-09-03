const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Repository layer for the Azure SQL connectivity smoke test (MIKK-53).
 *
 * Unlike the other repositories in this directory, this one talks to a real
 * Prisma-backed database (`DatabaseSmokeTest`) rather than local mock data —
 * its entire purpose is to be the thin, single-purpose data-access layer that
 * `dbTestService` uses to prove Azure SQL connectivity end to end. Isolated
 * from every product repository; safe to delete in one pass (see the
 * rollback checklist in MIKK-53's final comment) without touching
 * certifications/career-levels/profile/learning-plan.
 */

/**
 * Explicitly opens the Prisma connection so connection failures can be
 * distinguished from query failures by the service layer.
 */
async function connect() {
  await prisma.$connect();
}

async function create(message) {
  return prisma.databaseSmokeTest.create({ data: { message } });
}

async function findById(id) {
  return prisma.databaseSmokeTest.findUnique({ where: { id } });
}

module.exports = { connect, create, findById };
