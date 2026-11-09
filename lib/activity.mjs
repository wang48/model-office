import {createScanner} from '../vendor/agent-office/lib/scan.mjs';
import {createHash} from 'node:crypto';

const sessionKey=value=>createHash('sha256').update(String(value)).digest('hex').slice(0,20);

// Allowlist, never spread a reader's session: prompts and tool arguments stay local.
export function publicSession(s) {
  return {
    key:sessionKey(s.key||s.id||'unknown'),
    parentKey:s.subagent && s.parent ? sessionKey(`${s.agent}|${s.parent}`) : '',
    agent:String(s.agent||'unknown'), model:String(s.model||''),
    phase:String(s.phase||'unknown'), step:['tool','approval','ask'].includes(s.phase)?String(s.stepName||''):'',
    updated:Number(s.updated)||Number(s.touched)||0,
    started:Number(s.started)||0, subagent:s.subagent===true,
    tokensToday:Number(s.tokensToday)||0, turnsToday:Number(s.turnsToday)||0,
    context:Number(s.context)||0, contextWindow:Number(s.contextWindow)||0,
    source:'files'
  };
}
// A resumed/imported session can exist in several files. Event time wins over
// file mtime: copying an old rollout must not replace a live session's state.
export function latestSessions(sessions) {
  const latest=new Map();
  const stamp=s=>Number(s.updated)||Number(s.touched)||0;
  for(const s of sessions){
    const key=s.key||`${s.agent}|${s.id}`;
    const previous=latest.get(key);
    if(!previous||stamp(s)>stamp(previous)||stamp(s)===stamp(previous)&&(Number(s.touched)||0)>(Number(previous.touched)||0))latest.set(key,s);
  }
  return [...latest.values()].sort((a,b)=>stamp(b)-stamp(a));
}
export function createActivity(options={}) {
  const scanner=createScanner({days:2,max:40,...options});
  return {snapshot(now=Date.now()) {
    return {version:1,written:now,text:false,sessions:latestSessions(scanner.scan(now)).map(publicSession)};
  }};
}
export function encodeSnapshot(snapshot) {
  return 'globalThis.ModelOfficeLive = '+JSON.stringify(snapshot).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n';
}
