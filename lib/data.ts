import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { requirePermission } from './guard';
import { products } from './catalog';
const file = join(process.cwd(), 'data', 'deleted.json');
export async function deletedIds(): Promise<string[]> {
 try { return JSON.parse(await readFile(file, 'utf8')) as string[]; }
 catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return []; throw e; }
}
export async function adminProducts() {
 await requirePermission('product:delete'); const ids = await deletedIds();
 return products.filter(p => !ids.includes(p.id));
}
export async function deleteProduct(id: string) {
 await requirePermission('product:delete');
 if (!products.some(p => p.id === id)) throw new Error('Sản phẩm không tồn tại');
 const ids = await deletedIds(); await mkdir(join(process.cwd(), 'data'), { recursive: true });
 await writeFile(file, JSON.stringify([...new Set([...ids, id])]));
}
