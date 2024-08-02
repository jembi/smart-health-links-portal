import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "API Health Check" }, { status: 200 });
}
