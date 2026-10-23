import { requirePermission } from '@/lib/guard';
import { removeProduct } from '@/app/admin/actions';
export default async function PermissionCheck(){await requirePermission('dashboard:read');return <><h1>Kiểm chứng quyền Server Action</h1><p>Form minh họa: user gửi yêu cầu sẽ bị từ chối ngay trong action. Admin có thể xóa sản phẩm mẫu.</p><form action={removeProduct}><input type="hidden" name="id" value="1"/><button>Kiểm tra thao tác xóa</button></form></>}
