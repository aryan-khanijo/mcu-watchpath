import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { getAllTitles } from "@/lib/queries";

export async function GET() {
  try {
    const db = getDb();
    const allTitles = await getAllTitles(db);
    return NextResponse.json(allTitles);
  } catch (error) {
    console.error("Titles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
