(() => {
  const phases={thinking:['思考中','work','…'],tool:['执行工具','work','⌘'],replying:['回复中','work','✎'],approval:['等待批准','attention','!'],ask:['等你回答','attention','?'],done:['已完成','rest','✓'],aborted:['已中断','rest','Ⅱ'],error:['出错了','attention','×'],unknown:['状态未知','rest','○']};
  function resident(s,now=Date.now()){
    const known=!!s.model;
    const character=known?ModelHouse.characters.find(c=>c.match.test(s.model)):ModelHouse.characters.find(c=>({codex:'gpt',claude:'claude',dsh:'deepseek',gemini:'gemini',qwen:'qwen',kimi:'kimi'})[s.agent]===c.id);
    const phase=phases[s.phase]?s.phase:'unknown';
    const [label,zone,symbol]=phases[phase];
    const age=Math.max(0,now-(s.updated||now));
    const stale=zone==='work'&&age>(phase==='tool'?600000:480000);
    return {...s,phase,label:stale?'长时间无进展':label,zone,symbol,stale,character,age,identity:character?known?'按模型匹配':'按 Agent 暂配':'未收录模型'};
  }
  function demo(tick=0,now=Date.now()){
    const modes=['thinking','tool','approval','done','replying','error'];
    return {written:now,text:false,sessions:ModelHouse.characters.map((c,i)=>({key:`demo-${c.id}`,agent:['dsh','claude','codex','gemini','qwen','kimi'][i],model:c.id+'-demo',phase:modes[(i+tick)%modes.length],step:'Read',updated:now-4000,started:now-90000,tokensToday:2000*(i+1),turnsToday:i+1,source:'demo'})).concat([
      {key:'demo-child-1',parentKey:'demo-claude',subagent:true,agent:'codex',model:'gpt-demo',phase:'tool',step:'Read',updated:now,source:'demo'},
      {key:'demo-child-2',parentKey:'demo-claude',subagent:true,agent:'gemini',model:'gemini-demo',phase:'thinking',updated:now,source:'demo'}])};
  }
  globalThis.ModelOffice={phases,resident,demo};
})();
