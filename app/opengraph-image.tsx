import { ImageResponse } from 'next/og';
export const alt = 'LearnSpace — Learn. Build. Grow.';
export const size = {width:1200,height:630}; export const contentType = 'image/png';
export default function Image() { return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',height:'100%',background:'#102e29',color:'#f4f5e9',padding:80}}><div style={{fontSize:30}}>LEARNSPACE / ACADEMY</div><div style={{fontSize:84,marginTop:40}}>Learn. Build. Grow.</div></div>,size); }
