import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { getAdminStats } from "@/lib/queries";
import { cookies } from "next/headers";

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
    const stats = await getAdminStats(db);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
