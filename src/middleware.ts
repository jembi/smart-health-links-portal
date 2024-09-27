import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const FRONTEND_PATHNAMES = ['/', '/patient-summary', '/shared-links'];
const REDIRECTION_PATHNAME = '/';
const IGNORE_PATHS = {
  POST: [/^\/api\/v1\/share-links\/([^/]+)/],
  GET: [/^\/api\/v1\/share-links\/([^/]+)\/endpoints\/([^/]+)/],
};

type HTTP_VERB = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

const isApiPathname = (pathname: string) => pathname.startsWith('/api/v1/');
const isFrontendPathname = (pathname: string) =>
  FRONTEND_PATHNAMES.includes(pathname);

const isIgnorePath = (method: HTTP_VERB, pathname: string) => {
  return (
    IGNORE_PATHS[method]?.some((regex: RegExp) => regex.test(pathname)) ?? false
  );
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { nextUrl, url, method } = req;
  const { pathname } = nextUrl;

  try {
    if (!token) {
      if (isIgnorePath(method as HTTP_VERB, pathname)) {
        return NextResponse.next();
      }

      if (isApiPathname(pathname)) throw new Error();

      if (pathname !== REDIRECTION_PATHNAME && isFrontendPathname(pathname)) {
        const redirectionUrl = new URL(REDIRECTION_PATHNAME, url);
        return NextResponse.redirect(redirectionUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token or token expired' },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: '/:path*',
};
