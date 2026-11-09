import test from 'node:test';
import assert from 'node:assert/strict';
import {createAsyncActivity} from '../lib/async-activity.mjs';

test('worker 按需扫描，合并并发请求，关闭后可重新请求',async()=>{
  const activity=createAsyncActivity({sources:[]},{idleMs:10});
  try{
    const a=activity.snapshot(),b=activity.snapshot();assert.equal(a,b);
    const result=await a;assert.deepEqual(result.sessions,[]);assert.equal(result.text,false);
    await new Promise(resolve=>setTimeout(resolve,30));
    assert.deepEqual((await activity.snapshot()).sessions,[]);
  }finally{activity.close();}
});
test('关闭正在扫描的 worker 会拒绝请求而不会挂起',async()=>{
  const activity=createAsyncActivity({sources:[]});
  const result=activity.snapshot();activity.close();await assert.rejects(result,/closed/);
});
