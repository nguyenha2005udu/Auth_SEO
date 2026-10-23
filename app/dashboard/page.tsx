import { requirePermission } from '@/lib/guard';
import { signOut } from '@/auth';
export default async function Dashboard() {
 const user = await requirePermission('dashboard:read');
 return <><p className="eyebrow">KHÔNG GIAN CÁ NHÂN · SSR</p><h1>Xin chào, {user.name}</h1><p>Email: {user.email}</p><p>Vai trò: <strong>{user.role}</strong></p><form action={async () => { 'use server'; await signOut({redirectTo: '/'}); }}><button>Đăng xuất</button></form></>;
}
