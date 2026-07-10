import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { deleteUser } from "@/lib/queries";
import { cookies } from "next/headers";

async function checkAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  return !!session;
}

export async function DELETE(
  _request: Request,
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
    await deleteUser(db, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
