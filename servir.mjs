import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);let file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}if((await stat(file)).isDirectory())file=resolve(file,'index.html');const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(bytes);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Arquivo não encontrado. Gere o build antes de iniciar.');}}).listen(4173,'127.0.0.1',()=>console.log('MKT Planner: http://127.0.0.1:4173 — mantenha esta janela aberta.'));
