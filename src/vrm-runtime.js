import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {VRMLoaderPlugin,VRMUtils} from '@pixiv/three-vrm';
import './glb-runtime.js';
globalThis.THREE=THREE;
let modelBytes;
function data(){return modelBytes??=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='assets/models/deepseek-data.js';
  script.onload=()=>{try{const str=atob(globalThis.DeepSeekVRMData);const bytes=Uint8Array.from(str,c=>c.charCodeAt(0));globalThis.DeepSeekVRMData=null;resolve(bytes.buffer);}catch(e){reject(e);}script.remove();};
  script.onerror=()=>{reject(Error('模型文件读取失败'));script.remove();};document.head.append(script);
});}
async function load(){
  const bytes=await data();
  const loader=new GLTFLoader();loader.register(parser=>{parser.textureLoader=new THREE.TextureLoader(parser.options.manager).setCrossOrigin(undefined);return new VRMLoaderPlugin(parser);});
  const result=await loader.parseAsync(bytes,'');const vrm=result.userData.vrm;
  if(!vrm)throw Error('模型缺少 VRM 骨骼');
  // Office actors change scale and teleport between zones; keep secondary physics
  // disabled until reset behavior across those transforms is stable.
  vrm.springBoneManager=undefined;
  vrm.scene.traverse(o=>{o.frustumCulled=false;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  VRMUtils.rotateVRM0(vrm);
  const bounds=new THREE.Box3().setFromObject(vrm.scene),height=bounds.max.y-bounds.min.y;
  const mount=new THREE.Group();mount.add(vrm.scene);mount.scale.setScalar(2.25/height);vrm.scene.position.y-=bounds.min.y;
  // VRM 1.0 faces +Z in the normalized humanoid convention.
  return {vrm,mount};
}
export function animate(vrm,phase,time,dt,walking){
  const bone=name=>vrm.humanoid.getNormalizedBoneNode(name);
  const set=(name,x=0,y=0,z=0)=>{const b=bone(name);if(b)b.rotation.set(x,y,z);};
  const work=phase==='tool'||phase==='replying';
  set('leftUpperArm',work?-.8:0,0,-1.2);set('rightUpperArm',work?-.8:0,0,1.2);
  set('leftLowerArm',work?-.7+Math.sin(time*9)*.35:0);set('rightLowerArm',work?-.7+Math.sin(time*9+Math.PI)*.35:0);
  set('head',Math.sin(time*2)*.035,Math.sin(time*1.4)*.08,phase==='thinking'?.12:0);
  if(phase==='thinking'){set('rightUpperArm',-.5,0,.65);set('rightLowerArm',-1.5);}
  if(phase==='approval'||phase==='ask'){set('rightUpperArm',0,0,-.5);set('rightLowerArm',0,0,-.8+Math.sin(time*5)*.3);}
  for(const [side,offset] of [['left',0],['right',Math.PI]])set(side+'UpperLeg',walking?Math.sin(time*7+offset)*.25:0);
  vrm.expressionManager?.setValue('blink',Math.pow(Math.max(0,Math.sin(time*.8)),32));
  vrm.expressionManager?.setValue('happy',phase==='done'?.35:0);
  vrm.update(dt);
}
globalThis.ModelVRM={load,animate};
