(async()=>{
  const message=document.getElementById('boot-status');
  document.getElementById('retry').addEventListener('click',()=>location.reload());
  let port=4174,dark=false;
  try{
    const theme=await window.magpie?.ready;dark=theme?.dark===true;
    const options=await window.magpie?.options.get();
    if(options?.port!==undefined)port=Number(options.port);
  }catch{ /* Show a useful local-service error rather than an empty frame. */ }
  if(!Number.isInteger(port)||port<1024||port>65535){message.textContent='端口配置无效，请在插件选项中设置 1024–65535 的端口。';return;}
  if(!['localhost','127.0.0.1',''].includes(location.hostname)){message.textContent='此独立安装版仅支持本机 Magpie；远程浏览器不会连接远端机器的会话。';return;}
  setTimeout(()=>{message.textContent=`本机办公室未连接。请确认插件已启用，端口 ${port} 未被占用，然后重试。`;},5000);
  location.replace(`http://127.0.0.1:${port}/?theme=${dark?'dark':'light'}`);
})();
