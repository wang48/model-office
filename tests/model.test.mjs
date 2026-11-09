import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import '../page/model.js';
const M=globalThis.ModelHouse;
test('真实统计按模型家族聚合，未知模型仍保留在总量内',()=>{
  const s=M.summarize({calls:10,input:80,output:20,models:[{model:'anthropic/claude-opus',calls:2,input:10,output:2},{model:'claude-sonnet',calls:3,input:20,output:3},{model:'openai/gpt-5',calls:1},{model:'other-llm',calls:4}]});
  assert.equal(s.calls,10);assert.equal(s.tokens,100);assert.equal(s.residents.find(c=>c.id==='claude').calls,5);assert.equal(s.residents.find(c=>c.id==='claude').tokens,35);assert.equal(s.otherCalls,4);
});
test('拒绝不兼容返回，空用量与未识别模型可正常显示',()=>{
  assert.throws(()=>M.summarize(null));assert.throws(()=>M.summarize({calls:0}));
  const s=M.summarize({calls:0,models:[]});assert.equal(s.residents.length,6);assert.equal(s.calls,0);
});
test('无效数值不会污染统计，且外部模型名不执行为 HTML',()=>{
  const s=M.summarize({calls:2,models:[null,{model:'<img onerror=alert(1)>claude',calls:2,input:'NaN',output:-1}]});
  assert.equal(s.residents[1].tokens,0);assert.equal(s.residents[1].models[0],'<img onerror=alert(1)>claude');
  const app=readFileSync(new URL('../page/app.js',import.meta.url),'utf8');assert.doesNotMatch(app,/innerHTML|outerHTML|insertAdjacentHTML/);
});
test('演示不同时间范围总量与明细一致',()=>{
  for(const period of ['today','7d','30d']){const s=M.summarize(M.fixture(period));assert.equal(s.calls,s.residents.reduce((n,c)=>n+c.calls,0));assert.equal(s.tokens,s.residents.reduce((n,c)=>n+c.tokens,0));}
});
test('插件权限、页面入口、离线资源与 CSP 限制一致',()=>{
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url)));
  assert.deepEqual(pkg.magpie.permissions,[]);
  assert.equal(pkg.magpie.hooks,undefined);
  assert.equal(pkg.main,'./index.mjs');
  assert.ok(existsSync(new URL('../'+pkg.magpie.page.file,import.meta.url)));
  for(const c of M.characters)assert.ok(existsSync(new URL(`../page/${c.image}`,import.meta.url)));
  const app=readFileSync(new URL('../page/app.js',import.meta.url),'utf8');
  assert.doesNotMatch(app,/\bfetch\s*\(|WebSocket|sendBeacon|localStorage/);
  assert.deepEqual([...app.matchAll(/host\.read\('([^']+)'/g)].map(x=>x[1]),pkg.magpie.permissions);
  const html=readFileSync(new URL('../page/index.html',import.meta.url),'utf8');assert.doesNotMatch(html,/<script(?![^>]*\bsrc=)[^>]*>/);
});

test('场景原图逐字节匹配已核实的来源，不以重绘替代',async()=>{
  const {createHash}=await import('node:crypto');
  const {readFile}=await import('node:fs/promises');
  for(const id of ['deepseek','claude','gpt','gemini','qwen','kimi']){
    const metadata=JSON.parse(await readFile(new URL(`../docs/artwork/${id}-source.json`,import.meta.url),'utf8'));
    const bytes=await readFile(new URL(`../page/assets/originals/${id}.${id==='deepseek'?'png':'jpg'}`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),metadata.originals[0].sha256,id);
  }
});
