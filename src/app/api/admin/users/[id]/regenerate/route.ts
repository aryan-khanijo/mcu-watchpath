import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { updateUserPassword, getUserById } from "@/lib/queries";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  if (!session) return false;
  return true;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const db = getDb();
    
    const user = await getUserById(db, userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate random 8-character password
    const newPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hashPassword(newPassword);

    await updateUserPassword(db, userId, passwordHash);

    return NextResponse.json({ success: true, code: newPassword });
  } catch (error) {
    console.error("Admin regenerate password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
