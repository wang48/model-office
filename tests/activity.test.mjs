import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,appendFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createActivity,publicSession,encodeSnapshot} from '../lib/activity.mjs';
import {readClaude,readCodex,readDsh} from '../vendor/agent-office/lib/readers.mjs';
import {claudeRunning,claudeDone,codexRunning,codexDone,dshApproval} from '../vendor/agent-office/test/fixtures.mjs';
import '../page/model.js';
import '../page/office-model.js';

test('复用上游 reader：工具、完成、批准来自真实事件格式',()=>{
  assert.equal(readClaude(claudeRunning,'c1').phase,'tool');
  assert.equal(readClaude(claudeDone,'c1').phase,'done');
  assert.equal(readCodex(codexRunning,'c1').phase,'tool');
  assert.equal(readCodex(codexDone,'c1').phase,'done');
  assert.equal(readDsh(dshApproval,'d1').phase,'approval');
});
test('只输出白名单字段，不泄漏正文、参数、目录或原始会话 ID',()=>{
  const result=publicSession({key:'secret-id',agent:'codex',phase:'tool',stepName:'exec',query:'SECRET',reply:'SECRET',step:'exec SECRET',cwd:'/secret',messages:['SECRET'],title:'SECRET',target:{secret:true}});
  assert.ok(!JSON.stringify(result).includes('SECRET'));assert.ok(!JSON.stringify(result).includes('/secret'));
  assert.equal(result.step,'exec');assert.notEqual(result.key,'secret-id');
  assert.ok(!encodeSnapshot({sessions:[{model:'</script>'}]}).includes('</script>'));
});
test('角色优先按实际模型识别，同模型不同会话不会合并，未知模型不冒充',()=>{
  const a=ModelOffice.resident({key:'a',agent:'codex',model:'claude-sonnet',phase:'tool'});
  assert.equal(a.character.id,'claude');assert.equal(a.zone,'work');
  assert.equal(ModelOffice.resident({agent:'codex',model:'unlisted-model'}).character,undefined);
  assert.equal(ModelOffice.resident({agent:'codex',model:''}).identity,'按 Agent 暂配');
  assert.notEqual(a.key,ModelOffice.resident({...a,key:'b'}).key);
});
test('超时无进展不会伪装成完成或批准，结束和错误有不同区域',()=>{
  const now=2000000;
  const s=ModelOffice.resident({phase:'tool',updated:now-700000},now);
  assert.equal(s.stale,true);assert.equal(s.zone,'work');
  assert.equal(ModelOffice.resident({phase:'done'}).zone,'rest');
  assert.equal(ModelOffice.resident({phase:'error'}).zone,'attention');
});
test('文件扫描可读追加事件：执行工具转为已完成',()=>{
  const root=mkdtempSync(join(tmpdir(),'model-office-'));
  try{
    const file=join(root,'rollout-test.jsonl');writeFileSync(file,codexRunning+'\n');
    const a=createActivity({sources:[{agent:'codex',kind:'codex',root,depth:0,match:()=>true}]});
    const first=a.snapshot();assert.equal(first.sessions.length,1);assert.equal(first.sessions[0].phase,'tool');
    appendFileSync(file,codexDone.slice(codexRunning.length)+'\n');
    const second=a.snapshot();assert.equal(second.sessions[0].phase,'done');assert.equal(first.sessions[0].key,second.sessions[0].key);
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('Codex 子代理元数据连接到匿名父会话，不公开原始 ID',()=>{
  const child=readCodex(JSON.stringify({type:'session_meta',payload:{id:'child-private',source:{subagent:{thread_spawn:{parent_thread_id:'parent-private'}}}}}), 'child-private');
  assert.equal(child.subagent,true);assert.equal(child.parent,'parent-private');
  const exposed=publicSession({...child,key:'codex|child-private',agent:'codex'});
  const parent=publicSession({key:'codex|parent-private',agent:'codex'});
  assert.equal(exposed.parentKey,parent.key);assert.ok(!JSON.stringify(exposed).includes('private'));
  assert.equal(publicSession({agent:'codex',subagent:false,parent:'parent-private'}).parentKey,'');
});

test('同一会话的旧副本不能覆盖较新事件，即使旧文件刚被复制',async()=>{
  const {latestSessions}=await import('../lib/activity.mjs');
  const active={key:'codex|same',agent:'codex',phase:'tool',updated:2000,touched:2000};
  const old={...active,phase:'aborted',updated:1000,touched:9000};
  for(const input of [[active,old],[old,active]]){
    const result=latestSessions(input);assert.equal(result.length,1);assert.equal(result[0].phase,'tool');
    const publicRows=result.map(publicSession);assert.equal(publicRows[0].updated,2000);
  }
  assert.equal(publicSession(old).updated,1000);
  assert.equal(latestSessions([active,{...active,key:'codex|other'}]).length,2);
});
test('前端兼容旧快照去重；历史过滤保留当前工作和需要处理的状态',()=>{
  const now=1000000;
  const newer={key:'a',phase:'tool',updated:now};
  const older={key:'a',phase:'aborted',updated:now-400000};
  assert.deepEqual(ModelOffice.sessions([newer,older]),[newer]);
  for(const phase of ['done','aborted','unknown'])assert.equal(ModelOffice.historical({phase,updated:now-400000},now),true);
  for(const phase of ['tool','thinking','replying','approval','ask','error'])assert.equal(ModelOffice.historical({phase,updated:now-400000},now),false);
  assert.equal(ModelOffice.historical({phase:'done',updated:now-1000},now),false);
  assert.equal(publicSession({phase:'done',stepName:'old-tool'}).step,'');
});
