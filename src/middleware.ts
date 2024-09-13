import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) throw new Error();

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token or token expired' },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: '/api/v1/:path*',
};
