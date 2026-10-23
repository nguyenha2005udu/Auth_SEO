import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
export default {
 providers: [GitHub], pages: { signIn: '/login' },
 session: { strategy: 'jwt', maxAge: 3600 },
 callbacks: {
  jwt({ token, user }) { if (user) { token.id = user.id ?? token.sub ?? ''; token.role = user.role ?? 'user'; } return token; },
  session({ session, token }) { session.user.id = token.id; session.user.role = token.role; return session; }
 }
} satisfies NextAuthConfig;
