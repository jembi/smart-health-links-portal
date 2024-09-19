import { unstable_noStore } from 'next/cache';
import { NextResponse, NextRequest } from 'next/server';

import { LogHandler } from '@/lib/logger';

const logger = new LogHandler(__dirname);

export async function GET(request) {
  unstable_noStore();
  logger.info('API connected successfully');
  return NextResponse.json(
    { message: 'API Health Check', env: process.env.POSTGRES_PRISMA_URL },
    { status: 200 },
  );
}
