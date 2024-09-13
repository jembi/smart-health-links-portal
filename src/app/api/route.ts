import { NextResponse, NextRequest } from "next/server";

import {Logger} from '@/app/utils/logger';

const logger = new Logger("/api/v1")

export async function GET(request) {
  logger.log("API connected successfully");
  return NextResponse.json({ message: "API Health Check" }, { status: 200 });
}
