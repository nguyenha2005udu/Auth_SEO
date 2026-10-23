import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/catalog';
export default function robots():MetadataRoute.Robots {return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/dashboard','/api/','/login','/403']},sitemap:siteUrl+'/sitemap.xml'};}
