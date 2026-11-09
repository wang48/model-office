import {Worker} from 'node:worker_threads';

// No worker or scan at import/startup. One scan per overlapping request batch;
// synchronous upstream parsers run off the plugin host's event loop.
export function createAsyncActivity(options={}, {idleMs=30000,timeoutMs=15000}={}){
  let worker=null,pending=null,idle=null,deadline=null;
  function stop(){clearTimeout(idle);clearTimeout(deadline);const w=worker;worker=null;if(w)void w.terminate();}
  function fail(error){const p=pending;pending=null;stop();p?.reject(error);}
  function start(){
    const w=new Worker(new URL('./activity-worker.mjs',import.meta.url),{workerData:options});worker=w;
    w.on('message',result=>{
      if(worker!==w||!pending)return;
      const p=pending;pending=null;clearTimeout(deadline);
      if(result.error)p.reject(Error(result.error));else p.resolve(result.snapshot);
      idle=setTimeout(stop,idleMs);idle.unref?.();
    });
    w.on('error',error=>{if(worker===w)fail(error);});
    w.on('exit',()=>{if(worker===w)fail(Error('Scanner stopped'));});
  }
  return {
    snapshot(){
      if(pending)return pending.promise;
      clearTimeout(idle);
      let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});pending={promise,resolve,reject};
      try{if(!worker)start();deadline=setTimeout(()=>fail(Error('Scanner timeout')),timeoutMs);deadline.unref?.();worker.postMessage('scan');}
      catch(error){fail(error);}
      return promise;
    },
    close(){fail(Error('Scanner closed'));}
  };
}
