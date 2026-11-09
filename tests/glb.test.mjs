import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import '../src/glb-runtime.js';
const parse=b=>({json:JSON.parse(b.subarray(20,20+b.readUInt32LE(12))),bin:b.subarray(28+b.readUInt32LE(12))});
const view=(file,index)=>{const v=file.json.bufferViews[index];return file.bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);};
for(const id of ['deepseek','claude','gpt','gemini']){
  test(`${id} 离线重打包保留网格、骨骼、形态键和贴图字节`,()=>{
    const original=parse(readFileSync(new URL(`../page/assets/models/${id}.${id==='deepseek'?'vrm':'glb'}`,import.meta.url)));
    const script=readFileSync(new URL(`../page/assets/models/${id}-data.js`,import.meta.url),'utf8');
    const bytes=Buffer.from(JSON.parse(script.slice(script.indexOf('=')+1,-1)),'base64');
    assert.equal(bytes.readUInt32LE(8),bytes.length);
    const packed=parse(bytes), used=new Set();
    function refs(v){if(!v||typeof v!=='object')return;for(const [k,c] of Object.entries(v)){if(k==='bufferView'&&Number.isInteger(c))used.add(c);else refs(c);}}
    refs(packed.json);
    for(const index of used)assert.deepEqual(view(packed,index),view(original,index),`view ${index}`);
    original.json.images.forEach((img,index)=>{assert.deepEqual(Buffer.from(packed.json.images[index].uri.split(',')[1],'base64'),view(original,img.bufferView));});
    assert.deepEqual(packed.json.accessors,original.json.accessors);
    assert.deepEqual(packed.json.meshes,original.json.meshes);
    assert.deepEqual(packed.json.skins,original.json.skins);
  });
}
for(const id of ['claude','gpt','gemini']){
  test(`${id} 文件来源匹配，动画权重驱动非零真实顶点形变`,()=>{
    const bytes=readFileSync(new URL(`../page/assets/models/${id}.glb`,import.meta.url));
    const evidence=JSON.parse(readFileSync(new URL(`../docs/models/ai-girls-3d/${id}-verified.json`,import.meta.url)));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),evidence.glb_sha256);
    const file=parse(bytes), mesh=file.json.meshes[0], names=mesh.extras.targetNames;
    const model={morphs:[{morphTargetDictionary:Object.fromEntries(names.map((n,i)=>[n,i])),morphTargetInfluences:names.map(()=>0)}]};
    ModelGLB.animate(model,'thinking',0);const before=[...model.morphs[0].morphTargetInfluences];
    ModelGLB.animate(model,'thinking',1);const after=model.morphs[0].morphTargetInfluences;
    const index=names.indexOf('Head_Turn'),accessor=file.json.accessors[mesh.primitives[0].targets[index].POSITION];
    const raw=accessor.sparse?view(file,accessor.sparse.values.bufferView):view(file,accessor.bufferView);
    let largest=0;for(let i=0;i+4<=raw.length;i+=4)largest=Math.max(largest,Math.abs(raw.readFloatLE(i)));
    assert.ok(largest*Math.abs(after[index]-before[index])>1e-5,'real vertex displacement');
    assert.ok(after.every(v=>Number.isFinite(v)&&v>=0&&v<=1));
  });
}

test('工作形态键的可见动作幅度大于待机，切换状态不会残留手臂动作',()=>{
  const names=['Head_Nod','Head_Turn','Breath','Arm_L','Arm_R'];
  const mesh={morphTargetDictionary:Object.fromEntries(names.map((n,i)=>[n,i])),morphTargetInfluences:names.map(()=>0)};
  const model={morphs:[mesh]};let work=[],rest=[];
  for(let i=0;i<40;i++){ModelGLB.animate(model,'tool',i/10);work.push(mesh.morphTargetInfluences[0]);ModelGLB.animate(model,'done',i/10);rest.push(mesh.morphTargetInfluences[0]);}
  assert.ok(Math.max(...work)-Math.min(...work)>.5);
  assert.ok(Math.max(...work)-Math.min(...work)>Math.max(...rest)-Math.min(...rest));
  assert.equal(mesh.morphTargetInfluences[3],0);assert.equal(mesh.morphTargetInfluences[4],0);
});
