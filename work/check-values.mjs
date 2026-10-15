import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import worker from '../massaly-site/dist/server/index.js';
const require=createRequire(import.meta.url);const {chromium}=require('/Users/tessleong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await b.newContext({viewport:{width:1176,height:760}});
const env={TEAM_PASSWORD:'test-password',TEAM_SESSION_SECRET:'test-only-secret-value'};
await context.route('**/*',async route=>{const req=route.request();if(!req.url().startsWith('https://site.test/'))return route.abort();const res=await worker.fetch(new Request(req.url(),{method:req.method(),headers:req.headers(),body:req.method()==='POST'?req.postData():undefined}),env);await route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())});});
const p=await context.newPage();await p.goto('https://site.test/our-team');
assert.equal(await p.locator('h1').textContent(),'Team Members');
assert.equal(await p.locator('.header nav a').allTextContents().then(x=>x.join('|')),'Home|Our research|Publications|Team Members|Our values|Contact');
const current=await p.locator('.roster-section:not(#alumni) .portrait-slot').first().evaluate(e=>e.getBoundingClientRect().width);const alumni=await p.locator('#alumni .portrait-slot').first().evaluate(e=>e.getBoundingClientRect().width);assert(alumni<current);
await p.locator('.team-login > summary').click();await p.locator('.forgot-password summary').click();assert(await p.getByText('Please contact').isVisible());
await p.locator('#team-password').fill('test-password');const popupEvent=context.waitForEvent('page');await p.locator('#team-login-form button').click();const popup=await popupEvent;await popup.waitForURL('**/member-resources');await popup.locator('h1').waitFor();assert.equal(await popup.locator('h1').textContent(),'Lab Resources');
await p.goto('https://site.test/our-values');assert(await p.locator('h1').textContent()==='Our Values');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await p.screenshot({path:'../work/values-desktop.png'});
await p.setViewportSize({width:390,height:844});for(const path of ['/our-team','/our-values']){await p.goto('https://site.test'+path);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
await b.close();console.log('Passed desktop/mobile layout, smaller alumni portraits, navigation, password help and login opening the protected page in a new tab.');
