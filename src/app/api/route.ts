import { NextResponse, NextRequest } from "next/server";
import logger from '@/app/utils/logger';


export async function GET(request) {
  logger.info('API connected successfully');
  return NextResponse.json({ message: "API Health Check" }, { status: 200 });
}
