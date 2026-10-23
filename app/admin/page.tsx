import { requirePermission } from '@/lib/guard';
import { adminProducts } from '@/lib/data';
import { removeProduct } from './actions';
export default async function Admin() {
 await requirePermission('product:delete'); const products = await adminProducts();
 return <><p className="eyebrow">QUẢN TRỊ</p><h1>Quản lý danh mục</h1><p>Thao tác xóa được kiểm tra quyền tại page, action và tầng dữ liệu.</p>{products.map(p => <article key={p.id}><h2>{p.name}</h2><form action={removeProduct}><input type="hidden" name="id" value={p.id}/><button>Xóa khỏi danh mục quản trị</button></form></article>)}{!products.length && <p>Danh mục quản trị đã trống.</p>}</>;
}
