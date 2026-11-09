import {parentPort,workerData} from 'node:worker_threads';
import {createActivity} from './activity.mjs';
const activity=createActivity(workerData||{});
parentPort.on('message',()=>{
  try{parentPort.postMessage({snapshot:activity.snapshot()});}
  catch{parentPort.postMessage({error:'State unavailable'});}
});
