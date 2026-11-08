import assert from 'node:assert/strict';
import {request} from 'node:http';
import {createLiveServer} from '../lib/server.mjs';
const {server,prefix}=createLiveServer({snapshot:()=>({written:Date.now(),sessions:[],text:false})});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try{
  assert.equal((await fetch(base+prefix)).status,200);
  assert.equal((await fetch(base+prefix+'live.js')).status,200);
  assert.equal((await fetch(base+'/live.js')).status,403);
  assert.equal((await fetch(base+prefix+'live.js',{headers:{Origin:'https://example.com'}})).status,403);
  const wrongHost=await new Promise((resolve,reject)=>{const req=request(base+prefix+'live.js',{headers:{host:'example.com'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});
  assert.equal(wrongHost,403);
  assert.equal((await fetch(base+prefix+'live.js',{method:'POST'})).status,405);
  assert.equal((await fetch(base+prefix+'%2e%2e%2flib%2factivity.mjs')).status,403);
  console.log('7 项实时服务访问检查通过');
}finally{await new Promise(resolve=>server.close(resolve));}
