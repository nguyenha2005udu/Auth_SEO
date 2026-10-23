import { ImageResponse } from 'next/og';
import { products } from '@/lib/catalog';
export const alt = 'LearnSpace course'; export const size = {width:1200,height:630}; export const contentType = 'image/png';
export default async function Image({params}: {params:Promise<{id:string}>}) { const {id}=await params; const p=products.find(p=>p.id===id); return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',height:'100%',background:'#102e29',color:'#f4f5e9',padding:80}}><div style={{fontSize:30}}>LEARNSPACE / ACADEMY</div><div style={{fontSize:64,marginTop:40}}>{p?.name ?? 'Course not found'}</div><div style={{fontSize:38,marginTop:30}}>{`${p?.price ?? 0} VND`}</div></div>,size); }
