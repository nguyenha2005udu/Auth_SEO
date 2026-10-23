export type Role = 'admin' | 'user';
export type Permission = 'dashboard:read' | 'product:delete';
export function can(role: Role | undefined, action: Permission): boolean {
 return role === 'admin' || (role === 'user' && action === 'dashboard:read');
}