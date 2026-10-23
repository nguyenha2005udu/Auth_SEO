import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '@/lib/catalog';
import './globals.css';
export const metadata: Metadata = {metadataBase: new URL(siteUrl), title:{default:'LearnSpace — Học lập trình',template:'%s | LearnSpace'},description:process.env.SEO_BASELINE ? undefined : 'Khóa học lập trình thực hành với React và Next.js.'};
export default function Layout({children}: {children:React.ReactNode}) { return <html lang="vi"><body><header><Link className="brand" href="/">LearnSpace<span> / academy</span></Link><nav aria-label="Điều hướng chính"><Link href="/products/1">Khóa học</Link><Link href="/dashboard">Tài khoản</Link><Link href="/admin">Quản trị</Link></nav></header><main>{children}</main><footer>LearnSpace · Học qua thực hành · Next.js & TypeScript</footer></body></html>; }
