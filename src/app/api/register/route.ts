import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { hashPassword, signUserToken } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/queries";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    let processedEmail = email.trim().toLowerCase();
    const atIndex = processedEmail.indexOf("@");
    if (atIndex !== -1) {
      const localPart = processedEmail.substring(0, atIndex);
      const domainPart = processedEmail.substring(atIndex);
      const plusIndex = localPart.indexOf("+");
      if (plusIndex !== -1) {
        processedEmail = localPart.substring(0, plusIndex) + domainPart;
      }
    }

    const db = getDb();
    
    const existingEmailUser = await getUserByEmail(db, processedEmail);
    if (existingEmailUser) {
      return NextResponse.json({ error: "Email already registered. Please log in." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(db, name.trim(), processedEmail, passwordHash);
    const token = await signUserToken(user.id, user.email);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("mcu-session", token, {
      httpOnly: true, // more secure, readable by server only
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Don't send password hash to client
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
