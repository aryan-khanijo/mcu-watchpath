import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { verifyPassword, signUserToken } from "@/lib/auth";
import { getUserByEmail } from "@/lib/queries";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
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
    
    const user = await getUserByEmail(db, processedEmail);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signUserToken(user.id, user.email);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("mcu-session", token, {
      httpOnly: true, // more secure
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
