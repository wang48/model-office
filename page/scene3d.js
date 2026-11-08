/* Model Office: original artwork billboards in a 3D office. Three.js r169, MIT. */
(() => {
  const T=globalThis.THREE;
  const palette={deepseek:{hair:0x31548d,dress:0x23477b,accent:0x7bc6e6},claude:{hair:0xc87c42,dress:0xffefdb,accent:0xd38749},gpt:{hair:0xf0ebff,dress:0xf8f5ff,accent:0xb4a6d3},gemini:{hair:0x7765b7,dress:0x6a50a0,accent:0x91c9f1},qwen:{hair:0x6553a1,dress:0x6984be,accent:0xa8cce8},kimi:{hair:0xd6cdec,dress:0x394574,accent:0xb5b7ed},unknown:{hair:0x737d80,dress:0x97a39e,accent:0xc9d4c9}};
  function create(stage,onSelect){
    if(!T)throw Error('Three.js 未加载');
    const renderer=new T.WebGLRenderer({antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.setClearColor(0xe9eee2);renderer.outputColorSpace=T.SRGBColorSpace;
    stage.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','可拖拽旋转、滚轮缩放的 3D 模型办公室');
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(40,1,.1,100);
    scene.fog=new T.Fog(0xe9eee2,30,65);
    scene.add(new T.HemisphereLight(0xfff9ed,0x879b91,2.7));
    const sun=new T.DirectionalLight(0xffefdb,3.4);sun.position.set(-6,14,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,far:45});sun.shadow.bias=-.0005;scene.add(sun);
    const mats=new Map();
    function material(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.8}));return mats.get(color);}
    function mesh(g,color,parent,x=0,y=0,z=0){const m=new T.Mesh(g,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
    function box(parent,w,h,d,color,x,y,z){return mesh(new T.BoxGeometry(w,h,d),color,parent,x,y,z);}
    function ball(parent,r,color,x,y,z,sx=1,sy=1,sz=1){const m=mesh(new T.SphereGeometry(r,24,16),color,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
    function cone(parent,r,h,color,x,y,z,n=24){return mesh(new T.ConeGeometry(r,h,n),color,parent,x,y,z);}
    const root=new T.Group();scene.add(root);
    box(root,19,.32,13,0xd5c5ac,0,-.24,0);box(root,18.8,.08,12.8,0xf0e4cf,0,-.04,0);
    for(let x=-9;x<10;x+=1.5)box(root,.018,.012,12.6,0xdfd2ba,x,.012,0);
    for(let z=-6;z<7;z+=1.5)box(root,18.7,.012,.018,0xdfd2ba,0,.012,z);
    box(root,19,3.8,.2,0xdce7d0,0,1.75,-6.5);box(root,.2,3.8,13,0xe6ecdc,-9.5,1.75,0);
    box(root,19,.16,.3,0xaebe9d,0,.15,-6.32);box(root,.3,.16,13,0xaebe9d,-9.32,.15,0);
    for(const x of [-6,-1,4]){box(root,3.5,2.1,.13,0xfcfaf0,x,2.1,-6.34);box(root,3.15,1.78,.15,0xb3d5dc,x,2.1,-6.24);box(root,.08,1.85,.2,0xfffcf2,x,2.1,-6.13);box(root,3.2,.08,.2,0xfffcf2,x,2.1,-6.13);}
    function plant(x,z){cone(root,.35,.6,0xbe9b73,x,.3,z);for(let i=0;i<5;i++){const a=i*1.25;ball(root,.36,0x799a67,x+Math.sin(a)*.23,.8+i*.11,z+Math.cos(a)*.2,.7,1.5,.7);}}
    plant(-8.5,-5.2);plant(8.2,-5.4);plant(8.3,5.2);
    // Rugs give each state a stable place in the office.
    box(root,11.7,.025,6.3,0xe3ead8,-2.7,.03,-2.3);box(root,5.3,.03,6.3,0xe6dbec,6,.035,-2.3);box(root,17.2,.03,4.3,0xdce7ca,0,.035,4);
    // Sofa, bookcase, tea table, wall clock.
    box(root,4,.45,1.3,0x9ab185,-5.8,.5,4.7);box(root,4,1.1,.3,0xa9c195,-5.8,.85,5.3);
    box(root,.3,.8,1.4,0x869f73,-7.8,.65,4.7);box(root,.3,.8,1.4,0x869f73,-3.8,.65,4.7);
    const table=mesh(new T.CylinderGeometry(.8,.8,.12,32),0xc6ab84,root,-1.9,.65,4.4);box(root,.15,.65,.15,0x9f8563,-1.9,.32,4.4);
    mesh(new T.CylinderGeometry(.12,.1,.18,20),0xfffbef,root,-1.8,.8,4.4);
    box(root,2.5,2.4,.5,0xc2a784,7,1.2,-6);
    for(let y=.3;y<2.4;y+=.65){box(root,2.3,.08,.6,0xa18766,7,y,-5.9);for(let i=0;i<7;i++)box(root,.18,.42,.28,[0x809c8a,0xc19d89,0x9b8caf][i%3],6.15+i*.27,y+.25,-5.9);}
    const clock=mesh(new T.CylinderGeometry(.4,.4,.08,32),0xfffaf0,root,-8,2.8,-6.15);clock.rotation.x=Math.PI/2;box(root,.025,.25,.07,0x668062,-8,2.88,-6.08);box(root,.18,.025,.07,0x668062,-7.93,2.8,-6.08);
    function desk(x,z){
      const g=new T.Group();g.position.set(x,0,z);g.rotation.y=Math.PI;root.add(g);
      box(g,1.65,.13,.9,0xc5a783,0,.93,-.52);for(const dx of [-.68,.68])for(const dz of [-.85,-.2])box(g,.07,.88,.07,0x879780,dx,.44,dz);
      box(g,.6,.42,.08,0x596b61,0,1.23,-.8);const screen=box(g,.5,.31,.015,0xa1cebd,0,1.24,-.75);box(g,.08,.16,.08,0x596b61,0,1,-.8);box(g,.55,.035,.19,0x7b9184,0,1.02,-.35);
      box(g,.62,.13,.62,0xa6b792,0,.5,.28);box(g,.62,.65,.12,0xb9cba4,0,.82,.62);for(const dx of [-.25,.25])for(const dz of [.05,.5])box(g,.05,.45,.05,0x829675,dx,.23,dz);
      g.scale.y=.73;return {g,screen};
    }
    const desks=[];for(let i=0;i<6;i++)desks.push(desk(-7+(i%3)*3.5,-4.25+Math.floor(i/3)*3.2));
    const portraitRatios={"deepseek": 1.0, "claude": 0.55814, "gpt": 0.55814, "gemini": 0.55814, "qwen": 0.55814, "kimi": 0.5625};
    function character(id){
      const p=palette[id]||palette.unknown,g=new T.Group(),body=new T.Group();g.add(body);
      // The actual creator-published image is preserved byte-for-byte. Sprite faces
      // the camera; this is deliberately a portrait in 3D space, not a rigged model.
      const known=Object.hasOwn(portraitRatios,id);
      let portrait;
      if(known){
        // Native Wails images cannot reliably be uploaded as WebGL textures.
        // The untouched image is a DOM billboard projected by the same camera.
        portrait=new T.Sprite(new T.SpriteMaterial({transparent:true,opacity:0}));
        portrait.scale.set(2.35*portraitRatios[id],2.35,1);portrait.position.y=1.24;body.add(portrait);
      }else{
        portrait=ball(body,.4,p.hair,0,1,0);box(body,.5,.7,.35,p.dress,0,.4,0);
      }
      // Ground plinth and status motes move independently of the untouched art.
      mesh(new T.CylinderGeometry(.43,.5,.07,32),p.accent,g,0,.04,0);
      const activity=new T.Group();activity.position.set(.8,1.6,.15);g.add(activity);
      const ring=mesh(new T.TorusGeometry(.16,.025,8,24),p.accent,activity),motes=[];
      for(let i=0;i<3;i++)motes.push(ball(activity,.045,p.accent,0,0,0));
      return {g,body,portrait,activity,ring,motes,original:known,arms:[],legs:[],head:new T.Group()};
    }
    let azimuth=.18,elevation=.57,distance=22,paused=false,time=0,last=performance.now(),drag=null,moved=false,selectedKey=null,focusKey=null;
    const target=new T.Vector3(0,.4,0),ray=new T.Raycaster(),pointer=new T.Vector2();
    const workers=new Map(),labels=document.createElement('div');labels.className='world-labels';stage.append(labels);
    function cameraUpdate(){camera.position.set(target.x+distance*Math.sin(azimuth)*Math.cos(elevation),target.y+distance*Math.sin(elevation),target.z+distance*Math.cos(azimuth)*Math.cos(elevation));camera.lookAt(target);}
    function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();cameraUpdate();}
    const observer=new ResizeObserver(resize);observer.observe(stage);resize();
    const canvas=renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};moved=false;canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;azimuth-=dx*.006;elevation=Math.max(.22,Math.min(1.35,elevation+dy*.005));drag={x:e.clientX,y:e.clientY};cameraUpdate();});
    canvas.addEventListener('pointerup',e=>{if(drag&&!moved){const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects([...workers.values()].map(w=>w.g),true);if(hits.length){let o=hits[0].object;while(o&&!o.userData.key)o=o.parent;if(o){selectedKey=o.userData.key;onSelect(selectedKey);}}}drag=null;});
    canvas.addEventListener('pointercancel',()=>{drag=null;});
    canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(4,Math.min(36,distance+e.deltaY*.015));cameraUpdate();},{passive:false});
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stage.dispatchEvent(new CustomEvent('scene-error',{detail:'WebGL 上下文中断，请刷新或切换 2D'}));});
    function disposeGroup(g){g.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m&&![...mats.values()].includes(m)){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}});g.removeFromParent();}
    function update(rows){
      const keys=new Set(rows.map(r=>r.key));for(const [key,w] of workers)if(!keys.has(key)){disposeGroup(w.g);if(w.link){w.link.geometry.dispose();w.link.material.dispose();w.link.removeFromParent();}w.art?.remove();w.label.remove();workers.delete(key);}
      const counts={work:0,attention:0,rest:0};
      for(const row of rows){let w=workers.get(row.key);const id=row.character?.id||'unknown';if(w&&w.id!==id){disposeGroup(w.g);if(w.link){w.link.geometry.dispose();w.link.material.dispose();w.link.removeFromParent();}w.art?.remove();w.label.remove();workers.delete(row.key);w=null;}
        if(!w){w=character(id);w.id=id;w.g.userData.key=row.key;w.g.position.set(0,0,5.8);root.add(w.g);w.label=document.createElement('button');w.label.className='world-label';w.label.addEventListener('click',()=>onSelect(row.key));if(w.original){w.art=document.createElement('img');w.art.className='world-original';w.art.src=`assets/originals/${id}.${id==='deepseek'?'png':'jpg'}`;w.art.alt=`${row.character?.name||id} 作者原图`;w.art.addEventListener('click',()=>onSelect(row.key));w.art.addEventListener('error',()=>stage.dispatchEvent(new CustomEvent('scene-error',{detail:`原图加载失败：${id}`})));labels.append(w.art);}labels.append(w.label);workers.set(row.key,w);if(id==='deepseek'&&globalThis.ModelVRM){
          w.loading=true;ModelVRM.load().then(({vrm,mount})=>{if(workers.get(row.key)!==w){disposeGroup(mount);return;}w.vrm=vrm;w.body.add(mount);ModelVRM.animate(vrm,w.row.phase,time,0,false);w.portrait.visible=false;w.art?.remove();w.art=null;w.original=false;w.loading=false;w.label.title='DeepSeek-chan · 骨骼 3D · ニケ';}).catch(error=>{w.loading=false;w.modelError=error.message;w.label.title='3D 加载失败：'+error.message;console.error(error);});
        }else if(globalThis.ModelGLB?.available.includes(id)){
          w.loading=true;ModelGLB.load(id).then(({model,mount})=>{if(workers.get(row.key)!==w){disposeGroup(mount);return;}w.glb=model;w.body.add(mount);ModelGLB.animate(model,w.row.phase,time);w.portrait.visible=false;w.art?.remove();w.art=null;w.original=false;w.loading=false;w.label.title='AI Girls 3D · 形态键动画 · Manny / ningfangtianwai-pixel';}).catch(error=>{w.loading=false;w.modelError=error.message;w.label.title='3D 加载失败：'+error.message;console.error(error);});
        }}
        const i=counts[row.zone]++;let x,z;
        if(row.zone==='work'){x=-7+(i%3)*3.5;z=-4.25+Math.floor(i/3)*3.2;}
        else if(row.zone==='attention'){x=4.2+(i%3)*1.6;z=-3.7+Math.floor(i/3)*1.8;}
        else{x=-6+(i%8)*1.65;z=3+Math.floor(i/8)*1.5;}
        w.g.scale.setScalar(row.subagent?.62:1);w.goal=new T.Vector3(x,0,z);w.row=row;w.label.textContent=`${row.subagent?'↳ 子代理 · ':''}${row.symbol} ${row.character?.name||row.agent} · ${row.label}`;w.label.dataset.zone=row.zone;
        // Initial placement happens after parent offsets are resolved.
      }
      // Only explicit, currently visible parent links form a family. No inferred ownership.
      const siblings=new Map();
      for(const w of workers.values()){
        const parent=workers.get(w.row.parentKey);w.parent=parent&&parent!==w&&!parent.row.subagent?parent:null;
        if(w.parent){const n=siblings.get(w.row.parentKey)||0;siblings.set(w.row.parentKey,n+1);w.goal.copy(parent.goal).add(new T.Vector3((n%2?1:-1)*1.05,0,.15+Math.floor(n/2)*.8));}
        if(!w.link){w.link=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color:0xa392c4}));root.add(w.link);}
        w.link.visible=!!w.parent;
        if(!w.initialized){w.g.position.copy(w.goal);w.initialized=true;}
      }
    }
    function frame(now){
      if(focusKey&&!workers.has(focusKey))reset();
      for(const child of root.children)child.visible=!focusKey||child.userData.key===focusKey;
      for(const w of workers.values())w.link.visible=!focusKey&&!!w.parent;
      if(focusKey&&workers.has(focusKey)){target.copy(workers.get(focusKey).g.position).add(new T.Vector3(0,.9,0));cameraUpdate();}
      const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused)time+=dt;
      if(!document.hidden&&stage.clientWidth>0&&stage.clientHeight>0){
        for(const [key,w] of workers){const walking=w.g.position.distanceTo(w.goal)>.06;
          if(!paused)w.g.position.lerp(w.goal,Math.min(1,dt*2.2));
          if(w.vrm&&!paused)ModelVRM.animate(w.vrm,w.row.phase,time,dt,walking);
          if(w.glb&&!paused)ModelGLB.animate(w.glb,w.row.phase,time);
          const phase=w.row.phase,work=w.row.zone==='work';
          w.activity.visible=work&&!w.row.stale;w.ring.visible=phase==='tool';w.ring.rotation.z=time*3;
          w.motes.forEach((m,i)=>{m.position.set(Math.sin(time*3+i*2)*.18,Math.cos(time*3+i*2)*.18,0);});
          if(w.parent){const a=w.link.geometry.attributes.position;a.setXYZ(0,w.g.position.x,.08,w.g.position.z);a.setXYZ(1,w.parent.g.position.x,.08,w.parent.g.position.z);a.needsUpdate=true;w.link.geometry.computeBoundingSphere();}
          w.g.rotation.y=focusKey===key?0:walking?Math.atan2(w.goal.x-w.g.position.x,w.goal.z-w.g.position.z):work?-.12:0;
          w.body.position.y=walking?Math.abs(Math.sin(time*9))*.1:work?Math.sin(time*(phase==='thinking'?2:7))*.075:Math.sin(time*2)*.018;
          if(w.original){w.portrait.material.rotation=phase==='thinking'?Math.sin(time*2)*.045:phase==='approval'||phase==='ask'?Math.sin(time*4)*.07:Math.sin(time*7)*.018;w.body.position.x=phase==='error'?Math.sin(time*13)*.045:0;}
          // The original file is shared; each session has an independent display transform.
          if(w.original)w.body.rotation.z=phase==='thinking'?Math.sin(time*2)*.045:phase==='approval'||phase==='ask'?Math.sin(time*4)*.07:0;
          w.head.rotation.z=phase==='thinking'?Math.sin(time*2)*.22:work?Math.sin(time*6)*.07:0;
          w.arms.forEach((arm,i)=>{const side=i?1:-1;arm.rotation.z=0;arm.rotation.x=0;
            if(walking){arm.rotation.x=Math.sin(time*9+i*Math.PI)*.55;}
            else if(phase==='tool'||phase==='replying'){arm.rotation.x=-1.1+Math.sin(time*(phase==='tool'?12:8)+i*Math.PI)*.48;arm.rotation.z=side*.18;}
            else if(phase==='approval'||phase==='ask'){if(i===1){arm.rotation.z=-2.25+Math.sin(time*5)*.3;}}
            else if(phase==='error'){arm.rotation.z=side*(.9+Math.sin(time*4)*.12);}
            else if(phase==='thinking'){if(i===0){arm.rotation.x=-1.8+Math.sin(time*3)*.2;arm.rotation.z=.5;}}
          });
          w.legs.forEach((leg,i)=>{leg.rotation.x=walking?Math.sin(time*9+i*Math.PI)*.65:0;});
          const screen=desks.find(d=>d.g.position.distanceTo(w.goal)<.1)?.screen;if(screen&&work)screen.material=material(phase==='tool'?(Math.sin(time*5)>0?0x9ecab6:0xb3d9ce):0xa9c5de);
          if(w.art){
            const scale=w.g.scale.x,center=w.g.position.clone().add(new T.Vector3(w.body.position.x*scale,(1.24+w.body.position.y)*scale,0));
            const projected=center.clone().project(camera),depth=center.clone().applyMatrix4(camera.matrixWorldInverse).z;
            const h=2.35*scale*stage.clientHeight/(2*Math.tan(camera.fov*Math.PI/360)*Math.max(.1,-depth));
            w.art.style.width=`${h*portraitRatios[w.id]}px`;w.art.style.height=`${h}px`;
            w.art.style.transform=`translate(-50%,-50%) translate(${(projected.x*.5+.5)*stage.clientWidth}px,${(-projected.y*.5+.5)*stage.clientHeight}px) rotate(${-w.portrait.material.rotation}rad)`;
            w.art.hidden=(!!focusKey&&focusKey!==key)||projected.z>1||projected.z< -1;w.art.style.zIndex=String(Math.round(1000+depth));
          }
          const p=w.g.position.clone().add(new T.Vector3(0,w.row.subagent?1.65:2.65,0)).project(camera);w.label.style.transform=`translate(-50%,-100%) translate(${(p.x*.5+.5)*stage.clientWidth}px,${(-p.y*.5+.5)*stage.clientHeight}px)`;w.label.hidden=(!!focusKey&&focusKey!==key)||p.z>1||p.z< -1;w.label.style.zIndex='1100';w.label.classList.toggle('selected',key===selectedKey);
        }
        renderer.render(scene,camera);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    function reset(){focusKey=null;azimuth=.18;elevation=.57;distance=22;target.set(0,.4,0);cameraUpdate();}
    return {update,focus:key=>{const w=workers.get(key);if(w){focusKey=key;target.copy(w.g.position).add(new T.Vector3(0,.9,0));distance=5.5;elevation=.22;azimuth=.12;cameraUpdate();}},pause:value=>{paused=value;},reset,renderer,scene,camera,workers};
  }
  globalThis.ModelOffice3D={create};
})();
