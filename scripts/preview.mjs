import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
const root=fileURLToPath(new URL('../page/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
const server=createServer(async(req,res)=>{
  try {
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(path==='/_magpie/bridge.js'){res.writeHead(200,{'Content-Type':mime['.js']});res.end('// Standalone preview intentionally has no Magpie bridge.');return;}
    if(path==='/live.js'){res.writeHead(200,{'Content-Type':mime['.js']});res.end('globalThis.ModelOfficeLive = null;');return;}
    const target=resolve(root,'.'+(path==='/'?'/index.html':path));
    if(!target.startsWith(resolve(root)+sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(target);
    res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'"});res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`模型在干嘛预览：http://127.0.0.1:${server.address().port}`));
