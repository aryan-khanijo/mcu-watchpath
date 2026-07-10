import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { titles } from "@/db/schema";
import { cookies } from "next/headers";
import { desc, eq, and, sql } from "drizzle-orm";

async function checkAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  return !!session;
}

export async function GET() {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    // Return all titles sorted by global sort_order
    const allTitles = await db.select().from(titles).orderBy(titles.sortOrder);
    return NextResponse.json(allTitles);
  } catch (error) {
    console.error("Admin GET titles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      type,
      year,
      saga,
      phase,
      subgroup,
      blurb,
      sortOrder,
      essentialDoomsday,
      essentialBrandNewDay,
      essentialDeadpoolWolverine,
      badgeReason,
      episodeNote,
    } = body;

    // Validate type
    if (type !== "movie" && type !== "series") {
      return NextResponse.json({ error: "Type must be movie or series" }, { status: 400 });
    }

    // Validate saga
    const validSagas = [
      "The Infinity Saga",
      "The Multiverse Saga",
      "Legacy Studios (Non-MCU)",
      "X-Men Legacy",
      "Deep Cuts / Pre-MCU Legacy",
    ];
    if (!validSagas.includes(saga)) {
      return NextResponse.json({ error: "Invalid saga" }, { status: 400 });
    }

    // Validate phase based on saga
    const isMcu = saga === "The Infinity Saga" || saga === "The Multiverse Saga";
    let validPhase = null;
    if (isMcu) {
      if (!phase || !phase.match(/^Phase [1-6]$/)) {
        return NextResponse.json({ error: "Phase 1-6 is required for MCU sagas" }, { status: 400 });
      }
      validPhase = phase;
    }

    // Validate subgroup based on saga
    let validSubgroup = null;
    if (!isMcu && saga !== "X-Men Legacy") {
      validSubgroup = subgroup && subgroup.trim() !== "" ? subgroup.trim() : null;
    }

    const db = getDb();

    // Determine sort_order
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined || finalSortOrder === null || finalSortOrder === "") {
      // Find max sortOrder in the same bucket
      let maxOrderRecord;
      if (isMcu) {
        maxOrderRecord = await db.select({ maxOrder: sql`MAX(sort_order)` })
          .from(titles)
          .where(and(eq(titles.saga, saga), eq(titles.phase, validPhase)));
      } else {
        const conditions = [eq(titles.saga, saga)];
        if (validSubgroup) conditions.push(eq(titles.subgroup, validSubgroup));
        else conditions.push(sql`${titles.subgroup} IS NULL`);
        maxOrderRecord = await db.select({ maxOrder: sql`MAX(sort_order)` })
          .from(titles)
          .where(and(...conditions));
      }

      const maxVal = maxOrderRecord[0]?.maxOrder as number | null;
      if (maxVal !== null) {
        finalSortOrder = maxVal + 1;
      } else {
        // Empty bucket. Just append to the very end.
        const globalMax = await db.select({ maxOrder: sql`MAX(sort_order)` }).from(titles);
        finalSortOrder = (globalMax[0]?.maxOrder as number | null) ?? 0;
        finalSortOrder++;
      }
    }

    finalSortOrder = Number(finalSortOrder);

    // Shift existing records down to make room
    await db.run(sql`UPDATE titles SET sort_order = sort_order + 1 WHERE sort_order >= ${finalSortOrder}`);

    // Insert new record
    const [newTitle] = await db
      .insert(titles)
      .values({
        title: title.trim(),
        type,
        year: Number(year),
        saga,
        phase: validPhase,
        subgroup: validSubgroup,
        blurb: blurb?.trim() || "",
        sortOrder: finalSortOrder,
        essentialDoomsday: !!essentialDoomsday,
        essentialBrandNewDay: !!essentialBrandNewDay,
        essentialDeadpoolWolverine: !!essentialDeadpoolWolverine,
        badgeReason: (essentialDoomsday || essentialBrandNewDay || essentialDeadpoolWolverine) && badgeReason?.trim() ? badgeReason.trim() : null,
        episodeNote: episodeNote?.trim() || null,
        isReleased: true, // defaults
        isOptional: false, // defaults
      })
      .returning();

    return NextResponse.json(newTitle);
  } catch (error) {
    console.error("Admin POST title error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
