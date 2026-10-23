import type {MetadataRoute} from 'next';
import {siteUrl,products} from '@/lib/catalog';
export default function sitemap():MetadataRoute.Sitemap {return ['/',...products.map(p=>'/products/'+p.id)].map(path=>({url:siteUrl+path}));}
