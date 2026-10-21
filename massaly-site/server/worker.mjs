const assets=/* PUBLIC_ASSETS */;
const resourcePage=/* RESOURCE_PAGE */;
const loginPage=/* LOGIN_PAGE */;
const encoder=new TextEncoder();
const attempts=new Map();
const cookieName='__Host-massaly_team';
const lifetime=8*60*60;
function html(body,status=200,extra={}){return new Response(body,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow',...extra}});}
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...extra}});}
async function digest(value){return new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)));}
async function equal(a,b){const x=await digest(a),y=await digest(b);let difference=0;for(let i=0;i<x.length;i++)difference|=x[i]^y[i];return difference===0;}
async function key(env){return crypto.subtle.importKey('raw',await digest(env.TEAM_SESSION_SECRET+'\0'+env.TEAM_PASSWORD),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
function hex(bytes){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
async function session(env){const payload=String(Math.floor(Date.now()/1000)+lifetime)+'.'+crypto.randomUUID();return payload+'.'+hex(new Uint8Array(await crypto.subtle.sign('HMAC',await key(env),encoder.encode(payload))));}
async function authorized(request,env){
 if(!env.TEAM_SESSION_SECRET||!env.TEAM_PASSWORD)return false;
 const value=(request.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);
 if(!value||value.length>250)return false;
 const parts=value.split('.');if(parts.length!==3||!/^\d+$/.test(parts[0])||! /^[a-f0-9]{64}$/.test(parts[2]))return false;
 const expiry=Number(parts[0]),now=Date.now()/1000;if(expiry<=now||expiry>now+lifetime+60)return false;
 return crypto.subtle.verify('HMAC',await key(env),Uint8Array.from(parts[2].match(/../g),h=>parseInt(h,16)),encoder.encode(parts[0]+'.'+parts[1]));
}
function sameOrigin(request){const origin=request.headers.get('Origin');return origin===new URL(request.url).origin||origin==='https://massaly-lab-design.evalxnder.chatgpt.site';}
function sessionCookie(value,age=lifetime){return `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;}
export default {async fetch(request,env){
 const url=new URL(request.url);let path;try{path=decodeURIComponent(url.pathname).replace(/\/+$/,'')||'/';}catch{return new Response('Bad request',{status:400});}
 if(path==='/team-login'&&request.method==='POST'){
  const wantsJSON=request.headers.get('Accept')?.includes('application/json');
  const fail=(message,status)=>wantsJSON?json({error:message},status):html(loginPage.replace('Please sign in from the Team Members page to view lab resources.',message),status);
  if(!sameOrigin(request))return fail('Please sign in from the Team Members page.',403);
  if(!env.TEAM_PASSWORD||!env.TEAM_SESSION_SECRET)return fail('Team login is temporarily unavailable. Please contact Dr. Niko Massaly.',503);
  const ip=request.headers.get('CF-Connecting-IP')||request.headers.get('oai-authenticated-user-id')||'unknown';const now=Date.now();
  for(const [id,state] of attempts)if(state.until<now)attempts.delete(id);
  const state=attempts.get(ip)||{count:0,until:now+15*60*1000};
  if(state.count>=10)return fail('Too many attempts. Please try again in 15 minutes or contact Dr. Niko Massaly.',429);
  if(Number(request.headers.get('Content-Length'))>2048)return fail('Invalid login request.',400);
  const body=await request.text();if(body.length>2048)return fail('Invalid login request.',400);
  const password=new URLSearchParams(body).get('password')||'';
  if(!(await equal(password,env.TEAM_PASSWORD))){state.count++;attempts.set(ip,state);return fail('Incorrect password. Please try again.',401);}
  attempts.delete(ip);const headers={'Set-Cookie':sessionCookie(await session(env))};
  return wantsJSON?json({ok:true},200,headers):new Response(null,{status:303,headers:{...headers,Location:'/member-resources','Cache-Control':'no-store'}});
 }
 if(path==='/team-logout'&&request.method==='POST'){
  if(!sameOrigin(request))return new Response('Forbidden',{status:403});
  return new Response(null,{status:303,headers:{Location:'/our-team','Set-Cookie':sessionCookie('',0),'Cache-Control':'no-store'}});
 }
 if(path==='/member-resources'||path==='/member-resources.html'){
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  if(!(await authorized(request,env)))return html(request.method==='HEAD'?null:loginPage,401);
  return html(request.method==='HEAD'?null:resourcePage);
 }
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const assetPath=path==='/'?'/index.html':path.includes('.')?path:path+'.html';const asset=assets[assetPath];const found=asset||assets['/404.html'];
 return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(found.body),c=>c.charCodeAt(0)),{status:asset?200:404,headers:{'Content-Type':found.type,'Cache-Control':found.type.startsWith('text/html')?'no-cache':'public, max-age=3600','X-Content-Type-Options':'nosniff'}});
}};
