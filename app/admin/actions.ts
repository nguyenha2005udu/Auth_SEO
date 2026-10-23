 'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/guard';
import { deleteProduct } from '@/lib/data';
export async function removeProduct(form: FormData) {
 await requirePermission('product:delete');
 const id = z.enum(['1', '2']).parse(form.get('id'));
 await deleteProduct(id); revalidatePath('/admin');
}
