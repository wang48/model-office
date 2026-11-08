/* Shared pure model: no network, no host access. */
(() => {
  const characters = [
    {id:'deepseek',name:'DeepSeek',alias:'深深 · 鲸鱼娘',color:'#368ac9',room:'深蓝思考池',prop:'今天的灵感，像海一样多。',motif:'深蓝长发 / 女仆发箍 / 鲸鱼元素',bio:'采用「深海女仆工坊」现有 Q 版素材：蓝发、白色女仆头饰和灵动的鲸鱼元素。角色创作链为上善无形 → ZipZipPipe → Small-tailqwq。',tags:['鲸鱼娘','Q版','女仆'],match:/deepseek|\bdsh\b/i},
    {id:'claude',name:'Claude',alias:'小克 · Claude 娘',color:'#c67a55',room:'暖橙书房',prop:'再读一遍，就能写得更好了。',motif:'橙色长发 / 花饰 / 黑白橙长裙与书本',bio:'采用 ZipZipPipe 发布的 Claude 完整立绘。橙发、花饰、书本与精细的长裙构成辨识度，不再使用先前的通用 Q 版替身。',tags:['橙发','书本','长裙'],match:/claude/i},
    {id:'gpt',name:'GPT',alias:'小 G · 白发龙娘',color:'#9287ba',room:'白龙创作室',prop:'这个点子，我们一起试试看？',motif:'银白长发 / 龙角龙翼 / 白裙与龙尾',bio:'采用 ZipZipPipe 发布的 GPT 完整立绘。保留银白头发、龙角、双翼和长尾，以及白色服装的原始配色。',tags:['龙娘','银白长发','龙翼'],match:/gpt|chatgpt|\bo[134](?:-|\b)|codex/i},
    {id:'gemini',name:'Gemini',alias:'双子 · 猫耳娘',color:'#8a75cf',room:'双子观星台',prop:'换一个角度，会看见什么呢？',motif:'蓝紫渐变长发 / 猫耳 / 异色瞳与星饰',bio:'采用 ZipZipPipe 发布的 Gemini 完整立绘。蓝紫渐变发色、异色瞳与猫耳共同呈现社区熟悉的形象。',tags:['猫耳','异色瞳','星星'],match:/gemini|gemma/i},
    {id:'qwen',name:'Qwen',alias:'千千 · 千问娘',color:'#8f6abe',room:'千问工坊',prop:'千种问题，也能一点点解开。',motif:'蓝紫长发 / 中式头饰 / 蓝白衣裙与折扇',bio:'采用 ZipZipPipe 发布的千问完整立绘，保留中式衣饰、发型与折扇。这里展示的是该作者版本，社区还存在其他创作。',tags:['千问','中式','折扇'],match:/qwen|qwq|千问/i},
    {id:'kimi',name:'Kimi',alias:'月月 · Kimi 娘',color:'#627ea9',room:'月光档案馆',prop:'长长的故事，也会读到最后。',motif:'银紫长发 / 蓝紫衣裙 / 月亮与星空',bio:'采用 ZipZipPipe 发布的 Kimi 完整立绘，呈现银紫头发与星空服饰的社区设计。角色台词只是小屋氛围文案。',tags:['银紫长发','月光','星空'],match:/kimi|moonshot/i}
  ].map(c => ({...c, image:`assets/community/${c.id}.webp`, originalImage:`assets/originals/${c.id}.${c.id==='deepseek'?'png':'jpg'}`,
    credit:c.id==='deepseek'?'上善无形 → ZipZipPipe → Small-tailqwq':'ZipZipPipe',
    source:c.id==='deepseek'?'https://github.com/Small-tailqwq/dsh-deep-whale/tree/825d02b0e569c370ae15ceed12d9393559b3e4f4/maid-atelier':'https://www.pixiv.net/artworks/148186519',
    terms:c.id==='deepseek'?'CC BY-NC-SA 4.0 · 署名 / 非商用 / 相同方式共享':'作者条件：署名 ZipZipPipe，不可商用',
    edition:c.id==='deepseek'?'社区 Q 版':'作者立绘'
  }));
  const num = value => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0;
  function summarize(raw) {
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.models) || !Number.isFinite(Number(raw.calls))) throw new Error('用量接口返回格式不兼容，请检查 Magpie 版本');
    const residents = characters.map(c => ({...c,calls:0,tokens:0,errors:0,models:[]}));
    let otherCalls = 0;
    for (const row of raw.models) {
      if (!row || typeof row !== 'object') continue;
      const name = String(row.model ?? '');
      const target = residents.find(c => c.match.test(name));
      if (!target) {otherCalls += num(row.calls); continue;}
      target.calls += num(row.calls); target.tokens += num(row.input) + num(row.output); target.errors += num(row.errors); target.models.push(name);
    }
    return {residents,calls:num(raw.calls),tokens:num(raw.input)+num(raw.output),errors:num(raw.errors),cost:num(raw.cost),otherCalls};
  }
  function fixture(period='today') {
    const factor = period==='7d'?5:period==='30d'?18:1;
    const models=characters.map((c,i)=>({model:c.id==='gpt'?'gpt-demo':c.id+'-demo',calls:[32,48,26,18,12,8][i]*factor,input:(i+1)*4100*factor,output:(i+1)*1200*factor,errors:0}));
    return {models,calls:models.reduce((s,m)=>s+m.calls,0),input:models.reduce((s,m)=>s+m.input,0),output:models.reduce((s,m)=>s+m.output,0),errors:0,cost:0.86*factor};
  }
  globalThis.ModelHouse = {characters,summarize,fixture,count:n=>new Intl.NumberFormat('zh-CN',{notation:'compact',maximumFractionDigits:1}).format(num(n))};
})();
