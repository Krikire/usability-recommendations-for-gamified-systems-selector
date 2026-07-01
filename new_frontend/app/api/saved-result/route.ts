import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const savedResults = await prisma.savedResult.findMany();

    return NextResponse.json(savedResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved results:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved results" },
      { status: 500 }
    );
  }
}
