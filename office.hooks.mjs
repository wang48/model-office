import {writeFileSync,renameSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createActivity,encodeSnapshot} from './lib/activity.mjs';

const live=fileURLToPath(new URL('./page/live.js',import.meta.url));
const activity=createActivity();
function tick(){
  try {writeFileSync(live+'.tmp',encodeSnapshot(activity.snapshot()),{mode:0o600});renameSync(live+'.tmp',live);}
  catch { /* A failing scanner must not break the user's model request. UI detects stale snapshots. */ }
}
tick();
const timer=setInterval(tick,1500);timer.unref?.();
// Magpie loads this module as a gateway hook. Local files are the only source
// in this version; requests themselves and their bodies are never inspected.
export async function onRequest(){return undefined;}
