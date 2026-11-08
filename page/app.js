(() => {
  const M=globalThis.ModelHouse, $=id=>document.getElementById(id);
  const host=globalThis.magpie;
  let demo=!host, period='today', view='house', summary=null, error='', busy=false, revision=0, options={}, saveTimer, selected=null;
  const node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  function showDetail(c) {
    selected=c.id;
    const box=$('detail-content');box.replaceChildren();
    const img=node('img','portrait');img.src=c.image;img.alt=c.alias;
    box.append(img,node('div','eyebrow',c.room),node('h2','',c.alias),node('p','',c.bio),node('p','motif',c.motif));
    const data=summary?.residents.find(r=>r.id===c.id);
    box.append(node('p','',data?`${demo?'演示数据':'所选时段统计'} · ${M.count(data.calls)} 次调用 · ${M.count(data.tokens)} Token`:'尚未读取到用量'));
    box.append(node('p','small',data?.models.length?`统计中匹配到：${data.models.join('、')}`:'未在返回的 Top 20 模型统计中出现，不代表未安装或从未调用。'));
    box.append(node('p','small',`作品署名：${c.credit}`),node('p','small',c.terms));
    const source=node('a','source-link','查看作品来源 ↗');source.href=c.source;source.target='_blank';source.rel='noopener noreferrer';box.append(source);
    box.append(node('p','small','使用现有网络图片，完整保留画面，仅按比例显示。图像由 AI Moe Atlas 收录整理，逐件出处与许可记录见 docs/artwork。非官方形象。'));
    if(!$('detail').open)$('detail').showModal();
  }
  function paint() {
    $('connection').textContent=demo?'◌ 演示模式':error?'连接异常':'● Magpie 用量';
    $('demo').textContent=demo?(host?'返回真实用量':'重播演示'):'体验演示';
    $('notice').textContent=error || (demo?'正在参观演示小屋 · 数字和动作都是示例，不代表真实工作状态。':'真实用量模式 · 每 60 秒刷新，角色动作仅用于装饰。模型明细来自 Top 20 汇总。');
    $('notice').classList.toggle('error',!!error);
    $('stats').replaceChildren();
    for(const [label,value] of [['总调用',summary?M.count(summary.calls):'—'],['消耗 Token',summary?M.count(summary.tokens):'—'],['错误请求',summary?M.count(summary.errors):'—'],['估算费用',summary?`$${summary.cost.toFixed(2)}`:'—']]){
      const tile=node('div','stat');tile.append(node('span','',label),node('strong','',value),node('small','',demo?'示例数据':'所选时段'));$('stats').append(tile);
    }
    const query=$('search').value.trim().toLowerCase();
    const list=(summary?.residents??M.characters).filter(c=>`${c.name} ${c.alias} ${c.tags.join(' ')}`.toLowerCase().includes(query));
    $('residents').replaceChildren();$('empty').hidden=!!list.length;
    $('section-title').textContent=view==='house'?'小屋里的伙伴':'每一位，都有自己的故事';
    for(const [i,c] of list.entries()) {
      const card=node('button',`resident ${c.id} ${view==='album'?'album':''}`);card.type='button';card.style.setProperty('--accent',c.color);card.style.setProperty('--delay',`${i*-.6}s`);card.setAttribute('aria-label',`查看${c.alias}详情`);
      const top=node('div','card-top');top.append(node('span','room',c.room),node('span','room-number',`0${M.characters.findIndex(x=>x.id===c.id)+1}`));
      const scene=node('div','scene');const bubble=node('span','bubble',view==='album'?c.tags.join(' · '):c.prop);
      const img=node('img','character');img.src=c.image;img.alt=c.alias;img.width=260;img.height=220;
      scene.append(bubble,node('div','floor'),img);
      const info=node('div','card-info');const title=node('div','card-name');title.append(node('h3','',c.name),node('span','',c.alias.split(' · ')[1]));
      info.append(title,node('p','',view==='album'?c.motif:summary?`${M.count(c.calls)} 次调用  ·  ${M.count(c.tokens)} Token`:'等待用量连接'));
      const status=node('div','card-status');status.append(node('span','',view==='album'?`✧ ${c.edition}`:demo?'◌ 小屋日常 · 演示':c.calls>0?'● 本时段有调用':'○ 未出现在统计中'),node('span','','查看角色 ↗'));
      info.append(node('p','art-credit',`${c.edition} · ${c.credit}`));card.append(top,scene,info,status);card.addEventListener('click',()=>showDetail(c));$('residents').append(card);
    }
    if($('detail').open&&selected)showDetail(M.characters.find(c=>c.id===selected));
  }
  async function load() {
    const own=++revision;busy=true;$('refresh').disabled=true;
    try {
      const raw=demo?M.fixture(period):await host.read('usage:summary',{period});
      if(own!==revision)return;
      summary=M.summarize(raw);error='';$('updated').textContent=`${demo?'演示更新':'最近同步'} ${new Date().toLocaleTimeString('zh-CN')}`;
    } catch(e) {if(own!==revision)return;summary=null;error=`读取失败：${e.message||e}。可以点击刷新重试，或体验演示。`;$('updated').textContent='同步失败';}
    finally {if(own===revision){busy=false;$('refresh').disabled=false;paint();}}
  }
  $('search').addEventListener('input',paint);
  $('refresh').addEventListener('click',load);
  $('period').addEventListener('change',()=>{period=$('period').value;load();if(host){clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{try{options=await host.options.set({...options,period});}catch{$('updated').textContent='范围已切换，但偏好保存失败';}},1200);}});
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.view;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));paint();}));
  $('demo').addEventListener('click',()=>{demo=host?!demo:true;summary=null;load();});
  $('motion').addEventListener('click',()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'恢复动画':'暂停动画';});
  $('close-detail').addEventListener('click',()=>$('detail').close());
  $('detail').addEventListener('click',e=>{if(e.target===$('detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  async function start(){
    paint();
    if(host){try{await Promise.race([host.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Magpie 桥接连接超时')),10000))]);options=await host.options.get()||{};if(['today','7d','30d'].includes(options.period))period=options.period;$('period').value=period;}catch(e){error=e.message;paint();return;}}
    await load();setInterval(()=>{if(!document.hidden&&!busy&&!demo)load();},60000);
  }
  start();
})();
