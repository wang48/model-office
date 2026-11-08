import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Object3D} from 'three';
import {animate} from '../src/vrm-runtime.js';
const file=()=>readFileSync(new URL('../page/assets/models/deepseek.vrm',import.meta.url));
const model=b=>JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
test('下载的 VRM 是完整三维蒙皮模型，含骨骼、表情和原作者许可',()=>{
 const b=file(),j=model(b);assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(8),b.length);
 assert.ok(j.skins.length>0);assert.ok(j.meshes.length>10);assert.ok(j.meshes.some(m=>m.primitives.some(p=>p.attributes.JOINTS_0!==undefined&&p.attributes.WEIGHTS_0!==undefined)));
 const vrm=j.extensions.VRMC_vrm;assert.ok(vrm.humanoid.humanBones.head);assert.ok(vrm.expressions);assert.equal(vrm.meta.allowRedistribution,true);assert.match(vrm.meta.otherLicenseUrl,/by-nc-sa/);
});
test('工作动画控制模型中的实际人形骨骼，工具动作与思考姿势不同',()=>{
 const j=model(file()),bones=new Map(Object.keys(j.extensions.VRMC_vrm.humanoid.humanBones).map(n=>[n,new Object3D()]));let updates=0;
 const vrm={humanoid:{getNormalizedBoneNode:n=>bones.get(n)},update:()=>updates++};
 animate(vrm,'tool',0,.016,false);const before=bones.get('leftLowerArm').rotation.x;
 animate(vrm,'tool',.2,.016,false);assert.ok(Math.abs(bones.get('leftLowerArm').rotation.x-before)>.2);
 animate(vrm,'thinking',.2,.016,false);assert.equal(bones.get('rightLowerArm').rotation.x,-1.5);assert.equal(updates,3);
});
