import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { getAdminUsers, createUser, getUserByEmail } from "@/lib/queries";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  if (!session) return false;
  return true;
}

export async function GET() {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const usersData = await getAdminUsers(db);
    return NextResponse.json(usersData);
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let finalEmail = email.trim();
    if (finalEmail.includes("@")) {
      const [localPart, domain] = finalEmail.split("@");
      if (localPart.includes("+")) {
        finalEmail = `${localPart.split("+")[0]}@${domain}`;
      }
    }

    const db = getDb();

    const existingUser = await getUserByEmail(db, finalEmail);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Generate random 8-character password for admin-created users
    const randomPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hashPassword(randomPassword);

    const user = await createUser(db, name.trim(), finalEmail, passwordHash);
    
    // We send back the password so the admin can give it to the user
    return NextResponse.json({ user, code: randomPassword });
  } catch (error) {
    console.error("Admin create user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
