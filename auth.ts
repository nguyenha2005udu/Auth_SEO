import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import config from './auth.config';
import { users } from './lib/users';
const attempts = new Map<string, { count: number; until: number }>();
const schema = z.object({ email: z.string().email().transform(v => v.toLowerCase()), password: z.string().min(1).max(128) });
export const { handlers, auth, signIn, signOut } = NextAuth({ ...config,
 providers: [...config.providers, Credentials({
  credentials: { email: {}, password: {} },
  async authorize(input) {
   const parsed = schema.safeParse(input); if (!parsed.success) return null;
   const { email, password } = parsed.data;
   const bucket = attempts.get(email);
   if (bucket && bucket.until > Date.now() && bucket.count >= 5) return null;
   const user = users.find(u => u.email === email);
   const valid = await compare(password, user?.passwordHash ?? users[0].passwordHash);
   if (!user || !valid) { attempts.set(email, {count: bucket && bucket.until > Date.now() ? bucket.count + 1 : 1, until: bucket && bucket.until > Date.now() ? bucket.until : Date.now() + 60000}); return null; }
   attempts.delete(email);
   return {id: user.id, email: user.email, name: user.name, role: user.role};
  }
 })]
});
