import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { upsertProgress, updateLastActive } from "@/lib/queries";
import { verifyUserToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mcu-session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyUserToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { titleId, titleIds, watched } = await request.json();

    if (typeof watched !== "boolean") {
      return NextResponse.json(
        { error: "watched boolean is required" },
        { status: 400 }
      );
    }

    const ids = Array.isArray(titleIds) ? titleIds : (typeof titleId === "number" ? [titleId] : null);

    if (!ids) {
      return NextResponse.json(
        { error: "titleId or titleIds required" },
        { status: 400 }
      );
    }

    const db = getDb();
    
    await updateLastActive(db, payload.userId);
    
    await Promise.all(ids.map((id: number) => upsertProgress(db, payload.userId, id, watched)));

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
