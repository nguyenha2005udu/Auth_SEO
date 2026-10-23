import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync, rmSync, existsSync, writeFileSync } from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const base='http://localhost:3000';
const passed=[];
function ok(name){passed.push(name);console.log('PASS',name)}
try{
 const guest=await browser.newContext(); const page=await guest.newPage();
 await page.goto(base+'/admin');assert.match(page.url(),/\/login/);ok('Guest blocked at admin');
 await page.goto(base+'/dashboard');assert.match(page.url(),/\/login/);ok('Guest blocked at dashboard');
 await page.getByLabel('Email',{exact:true}).fill('user@example.com');await page.getByLabel('Mật khẩu',{exact:true}).fill('wrong');await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.waitForURL('**/login?error=credentials');ok('Wrong password rejected');
 async function login(email,password){const c=await browser.newContext();c.setDefaultNavigationTimeout(20000);c.setDefaultTimeout(20000);const p=await c.newPage();console.log('Login',email);await p.goto(base+'/login',{waitUntil:'domcontentloaded'});await p.getByLabel('Email',{exact:true}).fill(email);await p.getByLabel('Mật khẩu',{exact:true}).fill(password);await p.getByRole('button',{name:'Đăng nhập',exact:true}).click();await p.waitForURL('**/dashboard',{waitUntil:'domcontentloaded',timeout:20000});await p.getByRole('button',{name:'Đăng xuất'}).waitFor();return {c,p};}
 const user=await login('user@example.com','User@123456');assert.match(await user.p.locator('main').innerText(),/Vai trò: user/);ok('Credentials user and typed role');
 const cookie=(await user.c.cookies()).find(c=>c.name.includes('session-token'));assert.equal(cookie.httpOnly,true);assert.equal(cookie.sameSite,'Lax');ok('Session cookie httpOnly / SameSite');
 await user.p.goto(base+'/admin');assert.match(user.p.url(),/\/403/);ok('User blocked at admin');
 const admin=await login('admin@example.com','Admin@123456');await admin.p.goto(base+'/admin');await admin.p.getByRole('heading',{name:'Quản lý danh mục'}).waitFor();ok('Admin allowed');
 const manifest=JSON.parse(readFileSync('.next/server/server-reference-manifest.json','utf8'));const nodeEntry=Object.entries(manifest.node).find(([,v])=>v.exportedName==='removeProduct');
 // Read action ID from the rendered form when build manifest does not include exportedName.
 const hidden=await admin.p.locator('input[type=hidden]').evaluateAll(nodes=>nodes.map(n=>({name:n.name,value:n.value})));
 const actionId=nodeEntry?.[0] ?? hidden.find(n=>n.name.startsWith('$ACTION_ID_'))?.name.replace('$ACTION_ID_','');
 assert.ok(actionId,'Action identifier available');
 async function callAction(context,id){return context.request.post(base+'/admin',{headers:{'Origin':base},multipart:{['$ACTION_ID_'+actionId]:'',id},maxRedirects:0,timeout:15000});}
 const before=existsSync('data/deleted.json')?readFileSync('data/deleted.json','utf8'):null;
 const deniedUser=await callAction(user.c,'1');assert.ok([303,307,403].includes(deniedUser.status()) || (await deniedUser.text()).includes('/403'));assert.equal(existsSync('data/deleted.json')?readFileSync('data/deleted.json','utf8'):null,before);ok('Direct action as user cannot mutate');
 const deniedGuest=await callAction(guest,'1');assert.ok([303,307,403].includes(deniedGuest.status()) || (await deniedGuest.text()).includes('/login'));ok('Direct action as guest rejected');
 // Dashboard admits the user; this action must reject the role independently.
 const bypass=await user.c.request.post(base+'/dashboard/permissions',{headers:{'Origin':base},multipart:{['$ACTION_ID_'+actionId]:'',id:'1'},maxRedirects:0,timeout:15000});
 assert.ok(bypass.headers()['location']?.includes('/403') || bypass.headers()['x-action-redirect']?.includes('/403'));ok('Server Action denies user independently of middleware');
 const invalid=await callAction(admin.c,'invalid');assert.ok(invalid.status()>=400 || (await invalid.text()).includes('digest'));assert.equal(existsSync('data/deleted.json')?readFileSync('data/deleted.json','utf8'):null,before);ok('Admin action validates input');
 await admin.p.getByRole('button',{name:'Xóa khỏi danh mục quản trị'}).first().click();await admin.p.getByRole('heading',{name:'Khóa học Next.js nâng cao'}).waitFor({state:'detached'});ok('Admin delete action persists');
 await user.p.goto(base+'/dashboard');await user.p.getByRole('button',{name:'Đăng xuất'}).click();await user.p.waitForURL(base+'/');await user.p.goto(base+'/dashboard');assert.match(user.p.url(),/\/login/);ok('Logout invalidates browser session');
 for(const path of ['/','/products/1']){const html=await (await guest.request.get(base+path)).text();assert.ok(html.includes('rel="canonical"'));assert.ok(html.includes('property="og:image"'));assert.ok(html.includes('application/ld+json'));ok('SEO in source '+path);}
 const img=await guest.request.get(base+'/products/1/opengraph-image',{timeout:15000});assert.equal(img.status(),200);assert.match(img.headers()['content-type'],/image\/png/);ok('Dynamic OG image');
 await page.goto(base+'/');await page.screenshot({path:'reports/home.png',fullPage:true});
 writeFileSync('reports/e2e.json',JSON.stringify({date:new Date().toISOString(),passed},null,2));console.log(`${passed.length} checks passed`);
}catch(e){console.error(e);throw e;}finally{await Promise.race([browser.close(),new Promise(r=>setTimeout(r,5000))]);rmSync('data',{recursive:true,force:true});}
