import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=p=>readFileSync(new URL('../page/'+p,import.meta.url),'utf8');
function setup(){
  let frame;const listeners=new Map();
  const element=()=>({className:'',style:{},dataset:{},hidden:false,textContent:'',classList:{toggle(){}},append(){},remove(){},setAttribute(){},addEventListener(n,f){listeners.set(n,f)},getBoundingClientRect(){return {left:0,top:0,width:900,height:600}},setPointerCapture(){}});
  class Renderer{constructor(){this.domElement=element();this.shadowMap={};this.renders=0;}setPixelRatio(){}setClearColor(){}setSize(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);this.renders++;}}
  const ctx=vm.createContext({console,performance:{now:()=>0},devicePixelRatio:1,document:{createElement:element,hidden:false},ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){this.fn();}},requestAnimationFrame:f=>{frame=f},CustomEvent:class{}});
  vm.runInContext(source('three.min.js'),ctx);ctx.THREE={...ctx.THREE,WebGLRenderer:Renderer,TextureLoader:class{setCrossOrigin(){return this;}load(url){const t=new ctx.THREE.Texture();t.userData.url=url;return t;}}};
  vm.runInContext(source('scene3d.js'),ctx);
  const stage={...element(),clientWidth:900,clientHeight:600};
  const scene=ctx.ModelOffice3D.create(stage,()=>{});
  return {scene,ctx,stage,step:ms=>frame(ms)};
}
const row=(key,phase,zone)=>({key,phase,zone,symbol:'!',label:phase,character:{id:'gpt',name:'GPT'},agent:'codex'});
test('3D 场景投影原图，立绘动画可推进',()=>{
  const {scene,step}=setup();scene.update([row('a','tool','work')]);step(100);const a=scene.workers.get('a');
  assert.ok(a.portrait.isSprite);assert.ok(a.art.src.endsWith('/gpt.jpg'));assert.ok(a.art.style.height.endsWith('px'));assert.ok(scene.scene.children.some(x=>x.isLight));
  const before=a.body.position.y;step(200);assert.notEqual(a.body.position.y,before);assert.ok(scene.renderer.renders>=2);
});
test('状态变化驱动走向新区域；暂停保持关节和位置；恢复后继续移动',()=>{
  const {scene,step}=setup();scene.update([row('a','tool','work')]);step(50);
  const a=scene.workers.get('a'),start=a.g.position.clone();scene.update([row('a','approval','attention')]);step(100);assert.ok(a.g.position.distanceTo(start)>0);
  scene.pause(true);const p=a.g.position.clone(),arm=a.body.position.y;step(150);assert.ok(a.g.position.equals(p));assert.equal(a.body.position.y,arm);
  scene.pause(false);step(200);assert.ok(a.g.position.distanceTo(p)>0);
});
test('两个相同模型会话有两个 3D 角色，删除会话移除角色',()=>{
  const {scene}=setup();scene.update([row('a','done','rest'),row('b','done','rest')]);assert.equal(scene.workers.size,2);assert.notEqual(scene.workers.get('a').g,scene.workers.get('b').g);
  scene.update([row('b','done','rest')]);assert.equal(scene.workers.size,1);assert.ok(!scene.workers.has('a'));
});

test('子代理缩小并随父角色移动；过滤父角色不保留错误连线',()=>{
  const {scene,step}=setup();const child={...row('child','tool','work'),subagent:true,parentKey:'parent'};
  scene.update([child,row('parent','tool','work')]);const c=scene.workers.get('child'),p=scene.workers.get('parent');
  assert.equal(c.g.scale.x,.62);assert.equal(c.parent,p);assert.ok(c.goal.distanceTo(p.goal)<1.5);
  scene.update([child,row('parent','approval','attention')]);assert.ok(c.goal.distanceTo(p.goal)<1.5);
  step(50);assert.ok(c.link.visible);scene.update([child]);assert.equal(c.parent,null);assert.equal(c.link.visible,false);
});
test('原图工作动画有可见位移，暂停冻结动态效果，近看及重置可用',()=>{
  const {scene,step}=setup();scene.update([row('a','tool','work')]);const a=scene.workers.get('a');const samples=[];
  for(let n=1;n<=30;n++){step(n*50);samples.push(a.body.position.y);}
  assert.ok(Math.max(...samples)-Math.min(...samples)>.12);assert.equal(a.activity.visible,true);
  scene.pause(true);const rotation=a.ring.rotation.z;step(1600);assert.equal(a.ring.rotation.z,rotation);
  scene.focus('a');assert.ok(scene.camera.position.distanceTo(a.g.position)<7);scene.reset();assert.ok(scene.camera.position.distanceTo(a.g.position)>10);
});
test('六个角色都引用各自原图，不使用替代人偶',()=>{
  const {scene,step}=setup();scene.update(['deepseek','claude','gpt','gemini','qwen','kimi'].map(id=>({...row(id,'tool','work'),character:{id,name:id}})));step(50);
  assert.equal(scene.workers.size,6);for(const w of scene.workers.values()){assert.equal(w.original,true);assert.ok(w.portrait.isSprite);assert.ok(Number.isFinite(w.g.position.x));}
});

test('近看隔离角色；重置或删除目标恢复办公室',()=>{
  const {scene,step}=setup();scene.update([row('a','done','rest'),row('b','tool','work')]);scene.focus('a');step(50);
  const a=scene.workers.get('a'),b=scene.workers.get('b');assert.equal(a.g.visible,true);assert.equal(b.g.visible,false);assert.equal(b.art.hidden,true);assert.equal(b.label.hidden,true);
  scene.reset();step(100);assert.equal(b.g.visible,true);assert.equal(b.art.hidden,false);
  scene.focus('a');scene.update([row('b','tool','work')]);step(150);assert.equal(b.g.visible,true);assert.ok(scene.camera.position.length()>20);
});


test('异步 3D 加载后替换原图，暂停冻结模型动作，移除释放资源',async()=>{
  const {scene,ctx,step,stage}=setup();let resolve,animations=0,disposed=0;
  ctx.ModelGLB={available:['gpt'],load:()=>new Promise(r=>resolve=r),animate:()=>animations++};
  scene.update([row('a','tool','work')]);const actor=scene.workers.get('a');assert.equal(actor.loading,true);
  const mount=new ctx.THREE.Group(),geometry=new ctx.THREE.BoxGeometry(),material=new ctx.THREE.MeshStandardMaterial();
  geometry.addEventListener('dispose',()=>disposed++);mount.add(new ctx.THREE.Mesh(geometry,material));
  resolve({model:{morphs:[]},mount});await Promise.resolve();
  assert.equal(actor.original,false);assert.equal(actor.art,null);assert.ok(actor.glb);
  step(50);const before=animations;scene.pause(true);step(100);assert.equal(animations,before);
  scene.pause(false);step(150);assert.ok(animations>before);
  const frames=scene.renderer.renders;stage.clientWidth=0;step(200);assert.equal(scene.renderer.renders,frames);
  scene.update([]);assert.equal(disposed,1);
});

test('会话在 3D 加载完成前移除，不复活角色且释放迟到资源',async()=>{
  const {scene,ctx}=setup();let resolve,disposed=0;
  ctx.ModelGLB={available:['gpt'],load:()=>new Promise(r=>resolve=r),animate:()=>{throw Error('removed actor animated');}};
  scene.update([row('a','tool','work')]);scene.update([]);
  const mount=new ctx.THREE.Group(),geometry=new ctx.THREE.BoxGeometry();geometry.addEventListener('dispose',()=>disposed++);
  mount.add(new ctx.THREE.Mesh(geometry,new ctx.THREE.MeshStandardMaterial()));resolve({model:{},mount});await Promise.resolve();
  assert.equal(scene.workers.size,0);assert.equal(disposed,1);assert.equal(mount.parent,null);
});

test('3D 文件加载失败保留原图与可读错误状态',async()=>{
  const {scene,ctx}=setup();ctx.console={error(){}};
  ctx.ModelGLB={available:['gpt'],load:()=>Promise.reject(Error('fixture unavailable'))};
  scene.update([row('a','tool','work')]);await Promise.resolve();await Promise.resolve();
  const actor=scene.workers.get('a');assert.equal(actor.original,true);assert.ok(actor.art);assert.equal(actor.loading,false);assert.equal(actor.modelError,'fixture unavailable');
});
