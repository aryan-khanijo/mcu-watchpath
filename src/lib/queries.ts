import { eq, sql, and, count } from "drizzle-orm";
import { users, titles, progress } from "@/db/schema";
import type { DbType } from "@/db";

// ── User queries ──────────────────────────────────────────────

export async function getUserById(db: DbType, id: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return result ?? null;
}

export async function getUserByEmail(db: DbType, email: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return result ?? null;
}

export async function createUser(db: DbType, name: string, email: string, passwordHash: string) {
  const result = await db
    .insert(users)
    .values({ name, email, password: passwordHash })
    .returning();
  return result[0];
}

export async function updateLastActive(db: DbType, userId: number) {
  await db
    .update(users)
    .set({ lastActiveAt: new Date().toISOString() })
    .where(eq(users.id, userId));
}

export async function deleteUser(db: DbType, userId: number) {
  // Progress rows cascade-delete via FK
  await db.delete(progress).where(eq(progress.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
}

export async function updateUserPassword(db: DbType, userId: number, newPasswordHash: string) {
  const result = await db
    .update(users)
    .set({ password: newPasswordHash })
    .where(eq(users.id, userId))
    .returning();
  return result[0];
}

// ── Title queries ─────────────────────────────────────────────

export async function getAllTitles(db: DbType) {
  return db.query.titles.findMany({
    orderBy: (titles, { asc }) => [asc(titles.sortOrder)],
  });
}

// ── Progress queries ──────────────────────────────────────────

export async function getUserProgress(db: DbType, userId: number) {
  return db.query.progress.findMany({
    where: eq(progress.userId, userId),
  });
}

export async function upsertProgress(
  db: DbType,
  userId: number,
  titleId: number,
  watched: boolean
) {
  const existing = await db.query.progress.findFirst({
    where: and(eq(progress.userId, userId), eq(progress.titleId, titleId)),
  });

  if (existing) {
    await db
      .update(progress)
      .set({ watched, updatedAt: new Date().toISOString() })
      .where(and(eq(progress.userId, userId), eq(progress.titleId, titleId)));
  } else {
    await db.insert(progress).values({
      userId,
      titleId,
      watched,
      updatedAt: new Date().toISOString(),
    });
  }

  return { userId, titleId, watched };
}

// ── Admin queries ─────────────────────────────────────────────

export async function getAdminUsers(db: DbType) {
  const allUsers = await db.query.users.findMany();
  const allTitlesCount = await db.select({ count: count() }).from(titles);
  const totalTitles = allTitlesCount[0]?.count ?? 0;

  const usersWithProgress = await Promise.all(
    allUsers.map(async (user) => {
      const watchedCount = await db
        .select({ count: count() })
        .from(progress)
        .where(and(eq(progress.userId, user.id), eq(progress.watched, true)));

      const watched = watchedCount[0]?.count ?? 0;
      const percentWatched = totalTitles > 0 ? Math.round((watched / totalTitles) * 100) : 0;

      return {
        ...user,
        watched,
        totalTitles,
        percentWatched,
      };
    })
  );

  return usersWithProgress;
}

export async function getAdminStats(db: DbType) {
  // Total users
  const totalUsersResult = await db.select({ count: count() }).from(users);
  const totalUsers = totalUsersResult[0]?.count ?? 0;

  // Total titles
  const totalTitlesResult = await db.select({ count: count() }).from(titles);
  const totalTitles = totalTitlesResult[0]?.count ?? 0;

  // Most watched title
  const mostWatched = await db
    .select({
      titleId: progress.titleId,
      title: titles.title,
      count: count(),
    })
    .from(progress)
    .innerJoin(titles, eq(progress.titleId, titles.id))
    .where(eq(progress.watched, true))
    .groupBy(progress.titleId)
    .orderBy(sql`count(*) DESC`)
    .limit(1);

  // Least watched title (among those with at least one watch)
  const leastWatched = await db
    .select({
      titleId: progress.titleId,
      title: titles.title,
      count: count(),
    })
    .from(progress)
    .innerJoin(titles, eq(progress.titleId, titles.id))
    .where(eq(progress.watched, true))
    .groupBy(progress.titleId)
    .orderBy(sql`count(*) ASC`)
    .limit(1);

  // Average completion %
  let avgCompletion = 0;
  if (totalUsers > 0 && totalTitles > 0) {
    const allWatched = await db
      .select({ count: count() })
      .from(progress)
      .where(eq(progress.watched, true));
    const totalWatched = allWatched[0]?.count ?? 0;
    avgCompletion = Math.round((totalWatched / (totalUsers * totalTitles)) * 100);
  }

  return {
    totalUsers,
    totalTitles,
    mostWatched: mostWatched[0] ?? null,
    leastWatched: leastWatched[0] ?? null,
    avgCompletion,
  };
}
