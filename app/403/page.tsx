export const metadata = {title: 'Không có quyền', robots:{index:false,follow:false}};
export default function Forbidden() { return <><h1>Bạn không có quyền truy cập</h1><p>Chức năng này chỉ dành cho quản trị viên.</p><a href="/dashboard">Về tài khoản</a></>; }
