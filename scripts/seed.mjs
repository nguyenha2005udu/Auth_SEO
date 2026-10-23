import { hash } from 'bcryptjs';
import { writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const users = await Promise.all([
 {id:'admin-1',email:'admin@example.com',name:'Quản trị viên',role:'admin',password:'Admin@123456'},
 {id:'user-1',email:'user@example.com',name:'Học viên',role:'user',password:'User@123456'}
].map(async ({password,...u})=>({...u,passwordHash:await hash(password,12)})));
writeFileSync('lib/users.ts', `import 'server-only';\nimport type { Role } from './permissions';\nexport const users: {id:string;email:string;name:string;role:Role;passwordHash:string}[] = ${JSON.stringify(users,null,2)};\n`);
if (!existsSync('.env.local')) writeFileSync('.env.local',`AUTH_SECRET=${randomBytes(32).toString('base64')}\nAUTH_URL=http://localhost:3000\nSITE_URL=http://localhost:3000\nAUTH_GITHUB_ID=\nAUTH_GITHUB_SECRET=\n`);
console.log('Đã tạo hash tài khoản demo và .env.local (nếu chưa tồn tại).');
