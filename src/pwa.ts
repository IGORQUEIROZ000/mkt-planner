import {useEffect,useState,useSyncExternalStore} from 'react';
import {registerSW} from 'virtual:pwa-register';
const listeners=new Set<()=>void>();
let state={ready:false,error:'',blocked:false};
let registration:ServiceWorkerRegistration|undefined;
let updater:((reloadPage?:boolean)=>Promise<void>)|undefined;
let guardedDirty=false,guardedPeer=false,pendingReload=false;
function publish(patch:Partial<typeof state>){state={...state,...patch};listeners.forEach(fn=>fn());}
if(typeof window!=='undefined'){
 updater=registerSW({immediate:true,onNeedRefresh:()=>publish({ready:true}),onNeedReload:()=>{if(guardedDirty||guardedPeer){pendingReload=true;publish({ready:true});return;}window.location.reload();},onRegisteredSW:(_url,r)=>{registration=r;},onRegisterError:e=>publish({error:String(e)})});
 window.addEventListener('online',()=>{registration?.update().catch(()=>publish({error:'Não foi possível consultar atualizações. Tente novamente.'}));});
 window.addEventListener('mkt-db-versionchange',()=>publish({blocked:true}));
}
export function canActivateUpdate(online:boolean,dirty:boolean,otherEditor:boolean){return online&&!dirty&&!otherEditor;}
export async function activateUpdate(dirty:boolean,otherEditor=false){if(!canActivateUpdate(navigator.onLine,dirty,otherEditor))throw Error('Salve as alterações em todas as abas e conecte-se à internet antes de atualizar.');guardedDirty=false;guardedPeer=false;if(pendingReload){window.location.reload();return;}await updater?.(true);}
export async function checkUpdate(){if(!navigator.onLine)throw Error('Reconecte-se para buscar uma nova versão. A versão instalada continua disponível offline.');await registration?.update();}
export function usePwaUpdate(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>state);}
export function useUpdateGuard(dirty:boolean,peer:boolean){useEffect(()=>{guardedDirty=dirty;guardedPeer=peer;},[dirty,peer]);}
export function useEditingPeers(dirty:boolean){
 const [others,setOthers]=useState(false);
 useEffect(()=>{
  if(typeof BroadcastChannel==='undefined')return;
  const channel=new BroadcastChannel('mkt-editing');const id=crypto.randomUUID();const peers=new Map<string,{dirty:boolean;at:number}>();
  const send=()=>channel.postMessage({id,dirty,at:Date.now()});
  channel.onmessage=e=>{const value=e.data;if(typeof value?.id==='string'&&value.id!==id){const first=!peers.has(value.id);peers.set(value.id,{dirty:!!value.dirty,at:Date.now()});setOthers([...peers.values()].some(x=>x.dirty&&Date.now()-x.at<7000));if(first)send();}};
  send();const timer=setInterval(()=>{send();setOthers([...peers.values()].some(x=>x.dirty&&Date.now()-x.at<7000));},2000);
  return()=>{channel.postMessage({id,dirty:false});clearInterval(timer);channel.close();};
 },[dirty]);return others;
}
