import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
export const metadata = {title: 'Đăng nhập', robots: {index:false,follow:false}};
export default async function Login({ searchParams }: {searchParams: Promise<{error?:string}>}) {
 const {error} = await searchParams;
 return <><p className="eyebrow">TÀI KHOẢN</p><h1>Chào mừng trở lại</h1><p>Đăng nhập để truy cập không gian học tập.</p>{error && <p role="alert">Đăng nhập không thành công. Kiểm tra thông tin hoặc thử lại sau một phút.</p>}
 <form action={async form => { 'use server'; try { await signIn('credentials', {email:form.get('email'),password:form.get('password'),redirectTo:'/dashboard'}); } catch(e) { if(e instanceof AuthError) redirect('/login?error=credentials'); throw e; } }}>
 <label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Mật khẩu<input name="password" type="password" required maxLength={128} autoComplete="current-password"/></label><button>Đăng nhập</button></form>
 <form action={async () => { 'use server'; await signIn('github', {redirectTo:'/dashboard'}); }}><button disabled={!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET}>Tiếp tục với GitHub</button></form><p>GitHub cần được cấu hình trong .env.local. Tài khoản demo xem README.</p></>;
}
