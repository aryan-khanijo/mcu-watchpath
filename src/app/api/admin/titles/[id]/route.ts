import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { titles } from "@/db/schema";
import { cookies } from "next/headers";
import { eq, and, sql } from "drizzle-orm";

async function checkAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  return !!session;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

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
      isReleased,
      isOptional,
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

    // Check if the title exists
    const existingTitle = await db.query.titles.findFirst({
      where: eq(titles.id, numericId),
    });
    if (!existingTitle) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    let finalSortOrder = sortOrder !== undefined && sortOrder !== null && sortOrder !== "" ? Number(sortOrder) : existingTitle.sortOrder;

    // Optional: Could shift things around if sortOrder changed, but for simplicity we just update.
    // Admin is responsible for correct manual sort if changed explicitly.

    const [updatedTitle] = await db
      .update(titles)
      .set({
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
        isReleased: isReleased ?? true,
        isOptional: isOptional ?? false,
      })
      .where(eq(titles.id, numericId))
      .returning();

    return NextResponse.json(updatedTitle);
  } catch (error) {
    console.error("Admin PUT title error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const db = getDb();
    
    // progress is cascade-deleted because of onDelete: "cascade" in schema
    await db.delete(titles).where(eq(titles.id, numericId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE title error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
