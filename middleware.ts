import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';
import { can } from './lib/permissions';
const { auth } = NextAuth(authConfig);
export default auth(req => {
 if (!req.auth?.user) return NextResponse.redirect(new URL('/login', req.url));
 if (req.nextUrl.pathname.startsWith('/admin') && !can(req.auth.user.role, 'product:delete')) return NextResponse.redirect(new URL('/403', req.url));
 return NextResponse.next();
});
export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
