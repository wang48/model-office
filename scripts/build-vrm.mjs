import {readFile,writeFile,access} from 'node:fs/promises';
import {build} from 'esbuild';
// Store embedded images as data URIs; no network or blob permission needed in Magpie.
async function embed(filename,output,globalName){
const original=await readFile(new URL('../page/assets/models/'+filename,import.meta.url));
if(original.readUInt32LE(0)!==0x46546c67||original.readUInt32LE(8)!==original.length)throw Error('Incomplete VRM');
const size=original.readUInt32LE(12),json=JSON.parse(original.subarray(20,20+size).toString());
let bin=original.subarray(28+size);
const imageViews=new Set((json.images||[]).map(i=>i.bufferView).filter(i=>i!==undefined));
for(const image of json.images||[]){if(image.uri){if(!image.uri.startsWith('data:'))throw Error('External model texture');continue;}const view=json.bufferViews[image.bufferView];image.uri=`data:${image.mimeType};base64,${bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength).toString('base64')}`;delete image.bufferView;}
// Keep buffer-view indices stable while removing duplicate embedded image payloads.
// Images now live in data URIs; any view referenced elsewhere retains its bytes.
const referenced=new Set();
function visit(value){if(!value||typeof value!=='object')return;for(const [key,child] of Object.entries(value)){if(key==='bufferView'&&Number.isInteger(child))referenced.add(child);else visit(child);}}
visit(json);
const chunks=[];let offset=0;
for(let index=0;index<(json.bufferViews||[]).length;index++){
  const view=json.bufferViews[index];if(view.buffer!==0)throw Error('External model buffer');
  const bytes=imageViews.has(index)&&!referenced.has(index)?Buffer.alloc(4):bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  const chunk=Buffer.alloc(Math.ceil(bytes.length/4)*4);bytes.copy(chunk);
  view.byteOffset=offset;view.byteLength=bytes.length;chunks.push(chunk);offset+=chunk.length;
}
bin=Buffer.concat(chunks);json.buffers[0].byteLength=bin.length;
const text=Buffer.from(JSON.stringify(json));const padded=Buffer.alloc(Math.ceil(text.length/4)*4,32);text.copy(padded);
const out=Buffer.alloc(28+padded.length+bin.length);out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(padded.length,12);out.writeUInt32LE(0x4e4f534a,16);padded.copy(out,20);out.writeUInt32LE(bin.length,20+padded.length);out.writeUInt32LE(0x004e4942,24+padded.length);bin.copy(out,28+padded.length);
await writeFile(new URL('../page/assets/models/'+output,import.meta.url),'globalThis.'+globalName+'='+JSON.stringify(out.toString('base64'))+';');
}
await embed('deepseek.vrm','deepseek-data.js','DeepSeekVRMData');
const available=[];
for(const id of ['claude','gpt','gemini']){
  try{await access(new URL('../page/assets/models/'+id+'.glb',import.meta.url));}catch(error){if(error.code==='ENOENT')continue;throw error;}
  await embed(id+'.glb',id+'-data.js','ModelGLBData_'+id);available.push(id);
}
await build({entryPoints:['src/vrm-runtime.js'],bundle:true,format:'iife',minify:true,outfile:'page/vrm-runtime.js',legalComments:'eof',define:{__GLB_MODEL_IDS__:JSON.stringify(available)}});
console.log('Built VRM runtime and offline model data');
