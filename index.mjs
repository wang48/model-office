import {createAsyncActivity} from './lib/async-activity.mjs';
import {createLiveServer} from './lib/server.mjs';
let running;
async function startOffice(options={}){
  if(running)return running;
  const port=Number(options.port??4174);
  if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Office port must be 1024–65535');
  const activity=createAsyncActivity();
  const {server}=createLiveServer(activity,{hostPage:true});
  running=new Promise((resolve,reject)=>{
    server.once('error',error=>{running=null;activity.close();reject(error);});
    server.listen(port,'127.0.0.1',()=>resolve(server));
  });
  server.once('close',()=>{running=null;});
  return running;
}
export default {id:'model-office',server:async(_input,options)=>{await startOffice(options);return {};}};
