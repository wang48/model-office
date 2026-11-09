import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {encodeSnapshot} from './activity.mjs';

export function createLiveServer(activity,{hostPage=false}={}){
  const token=randomBytes(24).toString('hex'),root=fileURLToPath(new URL('../page/',import.meta.url));
  const prefix=`/${token}/`;
  const server=createServer(async(req,res)=>{
    const host=`127.0.0.1:${server.address().port}`;
    const deny=()=>{res.writeHead(403);res.end('Forbidden');};
    const origin=req.headers.origin;
    if(req.headers.host!==host||origin&&origin!==`http://${host}`&&!(hostPage&&origin==='null'))return deny();
    if(!hostPage&&['cross-site','same-site'].includes(req.headers['sec-fetch-site']))return deny();
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    let path;try{path=decodeURIComponent(new URL(req.url,`http://${host}`).pathname);}catch{return deny();}
    // Navigation-only bootstrap reveals no state and is unreadable cross-origin.
    // The opaque Magpie frame navigates here once to obtain its private URL.
    if(hostPage&&path==='/'&&req.method==='GET'&&req.headers['sec-fetch-mode']==='navigate'&&['document','iframe'].includes(req.headers['sec-fetch-dest'])){
      res.writeHead(302,{'Location':prefix+'index.html?theme='+(new URL(req.url,`http://${host}`).searchParams.get('theme')==='dark'?'dark':'light'),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end();return;
    }
    if(!path.startsWith(prefix))return deny();
    const resource=path.slice(prefix.length)||'index.html';
    const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
    const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','Content-Security-Policy':`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; frame-ancestors ${hostPage?"'self' wails://localhost http://127.0.0.1:* http://localhost:*":"'none'"}; object-src 'none'; base-uri 'none'`};
    try{
      let body;
      if(resource==='live.js'){
        if(req.method==='HEAD'){res.writeHead(200,{...headers,'Content-Type':mime['.js']});res.end();return;}
        body=encodeSnapshot(await activity.snapshot());
      }
      else if(resource==='_magpie/bridge.js')body='// Standalone: no host bridge';
      else{
        const target=resolve(root,resource);if(!target.startsWith(resolve(root)+sep)||!mime[extname(target)])return deny();
        body=await readFile(target);
      }
      res.writeHead(200,{...headers,'Content-Type':mime[extname(resource)]||'text/plain'});res.end(req.method==='HEAD'?undefined:body);
    }catch{res.writeHead(503,headers);res.end('State unavailable');}
  });
  server.on('close',()=>activity.close?.());
  return {server,prefix};
}
