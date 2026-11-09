(() => {
  const $=id=>document.getElementById(id), O=ModelOffice;
  let world=null,dimension='3d',sceneError='',listSignature='',returnKey=null;
  const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  let snapshot=null,demo=false,cycle=0,selected=null,detailSignature='',filter='all',lastSuccess=0,loading=false,showHistory=false;
  const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  function currentSessions(){return O.sessions(snapshot?.sessions).filter(s=>demo||showHistory||!O.historical(s));}
  function rows(){return currentSessions().map(s=>O.resident(s)).filter(s=>filter==='all'||s.zone===filter).filter(s=>`${s.agent} ${s.model} ${s.label} ${s.character?.name||''}`.toLowerCase().includes($('office-search').value.toLowerCase()));}
  function modelState(s){const w=world?.workers.get(s.key);return w?.vrm?'骨骼 3D 动画':w?.glb?'3D 形态键动画':w?.loading?'3D 模型加载中':w?.modelError?'3D 加载失败，当前显示原画':'作者原图';}
  function closeDetails(){selected=null;$('inspector').close();}
  function toggleDemo(){demo=!demo;closeDetails();snapshot=demo?O.demo():null;paint();if(!demo)load();}
  function setPaused(paused){document.body.classList.toggle('paused',paused);$('pause').textContent=paused?'恢复动画':'暂停动画';$('pause').setAttribute('aria-pressed',String(paused));world?.pause(paused);paint();}
  function details(s){
    if(!$('inspector').open)returnKey=s.key;
    selected=s.key;detailSignature=JSON.stringify({...s,age:0,updated:0,modelState:modelState(s)});const b=$('session-detail');b.replaceChildren();
    if(s.character){const img=make('img','detail-art');img.src=s.character.originalImage||s.character.image;img.alt=s.character.alias;b.append(img);}
    b.append(make('div','eyebrow',s.agent.toUpperCase()),make('h2','',s.character?.alias||s.model||'未识别模型'),make('p','phase-label',`${s.symbol} ${s.label}`));
    b.querySelector('h2').id='detail-title';
    for(const [name,value] of [['模型',s.model||'日志未记录'],['会话',s.key.slice(0,10)],['身份',s.subagent?'子代理':'主会话'],['形象资源',modelState(s)],...(s.subagent?[['父会话',s.parentKey?s.parentKey.slice(0,10):'日志未记录']]:[]),['当前工具',['tool','approval','ask'].includes(s.phase)?s.step||'—':'—'],['最后事件',s.updated?new Date(s.updated).toLocaleString('zh-CN'):'未知'],['今日轮次',s.turnsToday||0],['今日 Token',ModelHouse.count(s.tokensToday)],['来源',demo?'演示数据':'本机会话文件'],['角色映射',s.identity]]){
      const p=make('p','detail-row');p.append(make('span','',name),make('strong','',value));b.append(p);
    }
    b.append(make('p','detail-note','只显示状态与工具名；请回到原 Agent 处理批准、回答或错误。'));
    if(s.character?.id==='deepseek'){b.append(make('p','credit','3D 模型：ニケ · 角色：上善无形 / ZipZipPipe · CC BY-NC-SA 4.0'));const source=make('a','','3D 模型来源 ↗');source.href='https://github.com/tegnike/deepseek-chan-vrm';source.target='_blank';source.rel='noopener noreferrer';b.append(source);}
    if(globalThis.ModelGLB?.available.includes(s.character?.id)){b.append(make('p','credit','3D 模型：Manny / ningfangtianwai-pixel · AI Girls 3D · CC BY 4.0；本插件添加状态驱动动画。'));const source=make('a','','3D 模型来源 ↗');source.href='https://github.com/ningfangtianwai-pixel/ai-girls-3d';source.target='_blank';source.rel='noopener noreferrer';b.append(source);}
    if(s.character){b.append(make('p','credit',s.character.credit));const link=make('a','','原画来源 ↗');link.href=s.character.source;link.target='_blank';link.rel='noopener noreferrer';b.append(link);}
    if(world&&dimension==='3d'&&!document.body.classList.contains('list-view')){const focus=make('button','primary','近看角色');focus.addEventListener('click',()=>{world.focus(s.key);closeDetails();});b.append(focus);}
    if(!$('inspector').open){$('inspector').showModal();$('close-inspector').focus();}
  }
  function paint(){
    const all=currentSessions().map(s=>O.resident(s));
    const historyCount=O.sessions(snapshot?.sessions).filter(s=>O.historical(s)).length;
    $('history').textContent=showHistory?'隐藏历史':`显示历史${historyCount?' ('+historyCount+')':''}`;
    const stale=!demo&&(!lastSuccess||Date.now()-lastSuccess>12000||Date.now()-(snapshot?.written||0)>12000);
    $('connection').textContent=demo?'◌ 演示模式':stale?'○ 等待宿主':'● 本机实时';
    $('office-notice').textContent=demo?'演示场景 · 每 8 秒轮换状态，数字与会话均为示例。':stale?(snapshot?'连接暂时中断，当前显示上次快照。':'等待连接 Magpie。也可以先查看示例办公室。'):'按本机日志更新状态 · 已结束超过 5 分钟的会话默认隐藏';
    if(document.body.classList.contains('paused'))$('office-notice').textContent+=' · 动画已暂停，可点击「恢复动画」';
    if(sceneError)$('office-notice').textContent+=' · 3D 暂不可用，已切换 2D。';
    $('connection').dataset.state=demo?'demo':stale?'waiting':'live';
    $('toggle-demo').textContent=demo?'返回真实会话':'查看示例';
    $('total').textContent=all.length;$('working').textContent=all.filter(s=>s.zone==='work').length;$('attention').textContent=all.filter(s=>s.zone==='attention').length;$('resting').textContent=all.filter(s=>s.zone==='rest').length;
    const visible=rows();if(world)world.update(visible);
    const signature=JSON.stringify(visible.map(s=>({...s,age:0,updated:0})));
    if(signature!==listSignature){listSignature=signature;for(const zone of ['work','attention','rest'])$(zone+'-people').replaceChildren();
    $('sessions').replaceChildren();
    for(const s of visible){
      const person=make('button',`worker phase-${s.phase}${s.stale?' stalled':''}`);person.type='button';person.setAttribute('aria-label',`${s.character?.name||s.model||s.agent} ${s.label} ${s.key.slice(0,6)}`);
      const bubble=make('span','activity-bubble',`${s.symbol} ${s.label}`);
      if(s.character){const art=make('img','worker-art');art.src=s.character.image;art.alt=s.character.alias;person.append(art);}else person.append(make('div','unknown-art','?'));
      person.append(bubble,make('span','worker-name',s.character?.name||s.model||s.agent),make('span','worker-agent',s.agent+' · '+s.key.slice(0,5)));
      if(s.zone==='work'){const desk=make('span','desk');desk.append(make('span','monitor',s.phase==='tool'?'>_':'···'));person.append(desk);}
      person.addEventListener('click',()=>details(s));$(s.zone+'-people').append(person);
      const row=make('button',`session-row ${s.zone}`);row.dataset.sessionKey=s.key;row.append(make('span','status-dot',s.symbol),make('span','session-name',s.character?.name||s.model||s.agent),make('span','session-phase',(s.subagent?'↳ 子代理 · ':'')+s.label));row.addEventListener('click',()=>details(s));$('sessions').append(row);
    }
    }
    $('workspace-empty').hidden=visible.length>0;
    $('empty-title').textContent=all.length?'没有找到匹配的伙伴':demo?'示例办公室':'办公室准备好了';
    $('empty-description').textContent=all.length?'试试其他关键词，或清除筛选查看所有会话。':stale?'在 Magpie 中打开插件，启动一个 Agent，伙伴就会入座。':'已连接，正在等待本机 Agent 会话。';
    $('empty-action').textContent=all.length?'清除筛选':'先逛逛示例办公室';
    $('empty-action').hidden=demo&&!all.length;
    $('empty-office').hidden=visible.length>0;
    $('empty-office').textContent=all.length?'没有符合筛选条件的会话。':'办公室还很安静。启动一个 Agent，或点击「查看示例」逛逛。';
    $('last-sync').textContent=snapshot?`${demo?'演示时间':'快照时间'} ${new Date(snapshot.written).toLocaleTimeString('zh-CN')}`:'等待第一份快照';
    if(selected){const s=all.find(s=>s.key===selected);if(s){if(JSON.stringify({...s,age:0,updated:0,modelState:modelState(s)})!==detailSignature)details(s);}else{closeDetails();}}
  }
  function load(){
    if(demo||loading||document.hidden)return;loading=true;
    const script=document.createElement('script');script.src=`live.js?t=${Date.now()}`;
    const timeout=setTimeout(()=>done(false),5000);let finished=false;
    function done(ok){if(finished)return;finished=true;clearTimeout(timeout);script.remove();loading=false;
      const data=globalThis.ModelOfficeLive;
      if(ok&&!demo&&data&&Array.isArray(data.sessions)&&Number.isFinite(data.written)){snapshot=data;lastSuccess=Date.now();}
      paint();
    }
    script.onload=()=>done(true);script.onerror=()=>done(false);document.head.append(script);
  }
  $('toggle-demo').addEventListener('click',toggleDemo);
  $('empty-action').addEventListener('click',()=>{if(snapshot?.sessions?.length){filter='all';$('office-search').value='';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));paint();}else toggleDemo();});
  $('office-search').addEventListener('input',paint);
  $('close-inspector').addEventListener('click',closeDetails);
  $('inspector').addEventListener('close',()=>{selected=null;const opener=[...document.querySelectorAll('[data-session-key]')].find(b=>b.dataset.sessionKey===returnKey);(opener||$('office-search')).focus();returnKey=null;});
  $('history').addEventListener('click',()=>{showHistory=!showHistory;$('history').setAttribute('aria-pressed',String(showHistory));paint();});
  $('pause').addEventListener('click',()=>setPaused(!document.body.classList.contains('paused')));
  motionPreference.addEventListener('change',e=>setPaused(e.matches));
  $('view-list').addEventListener('click',()=>{const list=document.body.classList.toggle('list-view');$('view-list').textContent=list?'切回办公室':'列表视图';$('view-list').setAttribute('aria-pressed',String(list));});
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));paint();}));
  function dimensionView(){
    document.body.classList.toggle('mode-3d',dimension==='3d');
    $('toggle-dimension').disabled=!!sceneError;
    $('toggle-dimension').textContent=dimension==='3d'?'切换 2D':'切换 3D 场景';
    $('toggle-dimension').setAttribute('aria-pressed',String(dimension==='3d'));
    $('reset-camera').hidden=dimension!=='3d';
  }
  $('toggle-dimension').addEventListener('click',()=>{dimension=dimension==='3d'?'2d':'3d';dimensionView();});
  $('reset-camera').addEventListener('click',()=>world?.reset());
  dimensionView();
  try{world=ModelOffice3D.create($('world-stage'),key=>{const s=rows().find(x=>x.key===key);if(s)details(s);});}
  catch(e){sceneError=e.message;dimension='2d';dimensionView();$('office-notice').textContent='3D 初始化失败，已切换 2D';$('world-error').hidden=false;$('world-error').textContent=String(e.message);console.error('3D 初始化失败',e);}
  $('world-stage').addEventListener('scene-error',e=>{sceneError=e.detail;dimension='2d';dimensionView();paint();$('world-error').hidden=false;$('world-error').textContent=e.detail;});
  // Explicit demo only. A standalone preview starts empty, just like Agent Office.
  if(globalThis.magpie)Promise.resolve(magpie.ready).catch(()=>{});
  setPaused(motionPreference.matches);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
  paint();load();setInterval(()=>{if(!document.hidden)load();},1500);
  setInterval(()=>{if(demo&&!document.body.classList.contains('paused')){snapshot=O.demo(++cycle);paint();}},8000);
})();
