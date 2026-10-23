import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdirSync, writeFileSync } from 'node:fs';
const label = process.argv[2] ?? 'after';
const chrome = await launch({chromePath:process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromeFlags:['--headless','--no-sandbox']});
mkdirSync('reports',{recursive:true});
try {
 const rows=[];
 for(const [name,path] of [['home','/'],['product','/products/1']]) {
  const result=await lighthouse('http://localhost:3000'+path,{port:chrome.port,output:['html','json'],onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});
  writeFileSync(`reports/${label}-${name}.html`,result.report[0]);writeFileSync(`reports/${label}-${name}.json`,result.report[1]);
  const r=result.lhr;rows.push({page:path,performance:r.categories.performance.score*100,accessibility:r.categories.accessibility.score*100,bestPractices:r.categories['best-practices'].score*100,seo:r.categories.seo.score*100,LCP:r.audits['largest-contentful-paint'].numericValue,CLS:r.audits['cumulative-layout-shift'].numericValue,date:r.fetchTime});
 }
 writeFileSync(`reports/${label}-summary.json`,JSON.stringify(rows,null,2));console.log(rows);
} finally {await chrome.kill();}
