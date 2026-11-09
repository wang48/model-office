import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../page/boot.js',import.meta.url),'utf8');
async function boot({port=4174,hostname='localhost',failure=false,hang=false}={}){
  const message={textContent:''};let target=null;const timers=new Map();let next=0;
  const ctx={document:{getElementById:id=>id==='boot-status'?message:{addEventListener(){}}},
    window:{magpie:{ready:hang?new Promise(()=>{}):Promise.resolve({dark:true}),options:{get:async()=>{if(failure)throw Error('unavailable');return {port};}}}},
    location:{hostname,replace:url=>{target=url;},reload(){}},
    setTimeout:fn=>{const id=++next;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
  const result=vm.runInNewContext(source,ctx);
  if(hang)timers.values().next().value();
  await result;
  return {target,message:message.textContent,timers};
}
test('入口使用宿主端口和主题，仅导航到本机',async()=>{
  assert.equal((await boot({port:4199})).target,'http://127.0.0.1:4199/?theme=dark');
  assert.equal((await boot({hostname:'remote.example'})).target,null);
  for(const port of [0,80,65536,'bad'])assert.equal((await boot({port})).target,null);
});
test('宿主配置失败或无响应时显示可重试错误，不误连默认端口',async()=>{
  for(const options of [{failure:true},{hang:true}]){
    const result=await boot(options);assert.equal(result.target,null);assert.match(result.message,/重新打开/);assert.equal(result.timers.size,0);
  }
});
