import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products, siteUrl } from '@/lib/catalog';
import { JsonLd } from '@/components/json-ld';
type Props = {params: Promise<{id:string}>};
export const revalidate = 60;
export function generateStaticParams() { return products.map(p=>({id:p.id})); }
export async function generateMetadata({params}:Props):Promise<Metadata> { const {id}=await params; const p=products.find(p=>p.id===id); if(!p || process.env.SEO_BASELINE) return {}; return {title:p.name,description:p.description,alternates:{canonical:'/products/'+id},openGraph:{title:p.name,description:p.description,url:'/products/'+id,type:'website'}}; }
export default async function Product({params}:Props) { const {id}=await params; const p=products.find(p=>p.id===id); if(!p) notFound(); const url=siteUrl+'/products/'+id;
 return <><JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'Product',name:p.name,description:p.description,image:url+'/opengraph-image',offers:{'@type':'Offer',price:p.price,priceCurrency:'VND',availability:'https://schema.org/InStock',url}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Trang chủ',item:siteUrl},{'@type':'ListItem',position:2,name:p.name,item:url}]}]}}/><p className="eyebrow">KHÓA HỌC · ISR 60 GIÂY</p><h1>{p.name}</h1><p className="lead">{p.description}</p><p className="price">{p.price.toLocaleString('vi-VN')} ₫</p><Link className="button" href="/login">Đăng nhập để bắt đầu →</Link><section><h2>Bạn sẽ học được gì?</h2><p>Thiết kế component có kiểu dữ liệu rõ ràng, lựa chọn chiến lược render và xây dựng tính năng có thể kiểm chứng.</p></section></>; }
