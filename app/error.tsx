 'use client';
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <><h1>Không thể xử lý yêu cầu</h1><p>Vui lòng kiểm tra dữ liệu và quyền truy cập.</p><button onClick={reset}>Thử lại</button></>}
