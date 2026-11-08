import {createActivity} from '../lib/activity.mjs';
import {createLiveServer} from '../lib/server.mjs';
const activity=createActivity();
if(process.argv.includes('--json')){
  console.log(JSON.stringify(activity.snapshot()));
}else{
  const {server,prefix}=createLiveServer(activity);
  server.on('error',e=>{console.error(`无法启动本地办公室：${e.message}`);process.exitCode=1;});
  server.listen(Number(process.env.PORT)||4174,'127.0.0.1',()=>console.log(`模型在干嘛 · 实时办公室\nhttp://127.0.0.1:${server.address().port}${prefix}\n仅读取本机会话状态，不展示正文。Ctrl+C 停止。`));
}
