import assert from 'node:assert/strict';
import {request} from 'node:http';
import {createLiveServer} from '../lib/server.mjs';
let scans=0;
const {server,prefix}=createLiveServer({snapshot:async()=>{scans++;return {written:Date.now(),sessions:[],text:false};}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try{
  assert.equal((await fetch(base+prefix)).status,200);
  assert.equal(scans,0);
  assert.equal((await fetch(base+prefix+'live.js',{method:'HEAD'})).status,200);assert.equal(scans,0);
  assert.equal((await fetch(base+prefix+'live.js')).status,200);assert.equal(scans,1);
  assert.equal((await fetch(base+'/live.js')).status,403);
  assert.equal((await fetch(base+prefix+'live.js',{headers:{Origin:'https://example.com'}})).status,403);
  const wrongHost=await new Promise((resolve,reject)=>{const req=request(base+prefix+'live.js',{headers:{host:'example.com'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});
  assert.equal(wrongHost,403);
  assert.equal((await fetch(base+prefix+'live.js',{method:'POST'})).status,405);
  assert.equal((await fetch(base+prefix+'%2e%2e%2flib%2factivity.mjs')).status,403);
  await new Promise(resolve=>setTimeout(resolve,1600));assert.equal(scans,1,'no timer scans while page is idle');
  console.log('访问控制及按需扫描检查通过');
}finally{await new Promise(resolve=>server.close(resolve));}

const hosted=createLiveServer({snapshot:async()=>({written:Date.now(),sessions:[],text:false})},{hostPage:true});
await new Promise(resolve=>hosted.server.listen(0,'127.0.0.1',resolve));
const hostedBase=`http://127.0.0.1:${hosted.server.address().port}`;
try{
  assert.equal((await fetch(hostedBase+'/')).status,403);
  // Node fetch overrides Sec-Fetch-Mode, so send the navigation contract with http.request.
  const nav=await new Promise((resolve,reject)=>{const req=request(hostedBase+'/?theme=dark',{headers:{'Sec-Fetch-Mode':'navigate','Sec-Fetch-Dest':'iframe'}},res=>{res.resume();resolve({status:res.statusCode,location:res.headers.location});});req.on('error',reject);req.end();});
  assert.equal(nav.status,302);assert.equal(nav.location,hosted.prefix+'index.html?theme=dark');
  assert.equal((await fetch(hostedBase+hosted.prefix+'live.js',{headers:{Origin:'https://evil.example'}})).status,403);
  assert.equal((await fetch(hostedBase+hosted.prefix+'live.js',{headers:{Origin:'null'}})).status,200);
  console.log('宿主导航、随机地址和来源检查通过');
}finally{await new Promise(resolve=>hosted.server.close(resolve));}
