import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { getUserById, getUserProgress, updateLastActive } from "@/lib/queries";
import { verifyUserToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
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

    const db = getDb();
    const user = await getUserById(db, payload.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update last active
    await updateLastActive(db, user.id);

    // Get progress
    const progressData = await getUserProgress(db, user.id);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, progress: progressData });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
