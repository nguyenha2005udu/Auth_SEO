import 'server-only';
import { auth } from '@/auth';
import { can, type Permission } from './permissions';
import { redirect } from 'next/navigation';
export async function requirePermission(permission: Permission) {
 const session = await auth();
 if (!session?.user) redirect('/login');
 if (!can(session.user.role, permission)) redirect('/403');
 return session.user;
}
