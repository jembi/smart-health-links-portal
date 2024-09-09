import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: Request) {
  const token =  await getToken({req: req as any}) //getAuthToken(req);
  
  try{
    //const result = validateToken(token);
    console.log(token);
    if(!token) throw 'result';
    
    return NextResponse.next();
  }
  catch(error){
    console.log(error);
    return NextResponse.json({message: 'Invalid Token'}, { status: 422 });
  }
}

export const config = {
  matcher: '/api/v1/:path*',
}