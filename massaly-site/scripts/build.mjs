import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',svg:'image/svg+xml',png:'image/png',webp:'image/webp'};
const assets={};
for(const name of await readdir('public')){const data=await readFile('public/'+name);assets['/'+name]={body:data.toString('base64'),type:mime[name.split('.').pop()]||'application/octet-stream'};}
let source=await readFile('server/worker.mjs','utf8');
source=source.replace('/* PUBLIC_ASSETS */',JSON.stringify(assets)).replace('/* RESOURCE_PAGE */',JSON.stringify(await readFile('private/member-resources.html','utf8'))).replace('/* LOGIN_PAGE */',JSON.stringify(await readFile('private/login-required.html','utf8')));
await mkdir('dist/server',{recursive:true});await writeFile('dist/server/index.js',source);
console.log('Built the site with server-protected lab resources.');
