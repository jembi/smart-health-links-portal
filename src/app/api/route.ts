import { NextResponse, NextRequest } from "next/server";

import { LogHandler } from "@/lib/logger";

const logger = new LogHandler(__dirname)

export async function GET(request) {
  logger.info("API connected successfully");
  return NextResponse.json({ message: "API Health Check" }, { status: 200 });
}
