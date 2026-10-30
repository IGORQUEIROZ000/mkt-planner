import Dexie from 'dexie';
import {db,PlannerDB,canonical,sha256,snapshot,verifyBackup,decodeMaterials,editorialSchema,contentSchema,type Content} from './core';
export type Decision='keep'|'replace'|'duplicate';
export type Conflict={incomingId:string;existingId:string;title:string;reason:string};
type Source=Awaited<ReturnType<typeof snapshot>>;
export type ImportPlan={baseline:string;target:Source;summary:string;legacy:boolean};
const fingerprint=(c:Content)=>canonical({...contentSchema.parse(c),id:'',history:[]});
const baseline=(s:Source)=>canonical({contents:[...s.contents].sort((a,b)=>a.id.localeCompare(b.id)),materials:s.materials.map(m=>({id:m.id,name:m.name,type:m.type,size:m.size,revision:m.revision??''})).sort((a,b)=>a.id.localeCompare(b.id)),settings:[...s.settings].sort((a,b)=>a.key.localeCompare(b.key))});
export function findConflicts(incoming:Content[],existing:Content[]):Conflict[]{return incoming.flatMap(c=>{const match=existing.find(e=>e.id===c.id)||existing.find(e=>fingerprint(e)===fingerprint(c));return match?[{incomingId:c.id,existingId:match.id,title:c.title,reason:match.id===c.id?'Mesmo ID':'Conteúdo idêntico com outro ID'}]:[];});}
export async function prepareImport(raw:unknown,options:{replace?:boolean;decisions?:Record<string,Decision>;editedContents?:Content[]}={}):Promise<ImportPlan>{
 const backup=(raw as {kind?:string})?.kind==='mkt-backup';const verified=backup?await verifyBackup(raw):null;const source=verified?.data??editorialSchema.parse(raw);
 const checked=editorialSchema.parse({kind:'mkt-editorial',version:1,contents:options.editedContents??source.contents}).contents;
 if(checked.some(c=>/^\[Revisar título \d+\]$/.test(c.title)))throw Error('Revise os títulos ausentes antes de importar.');
 const before=await snapshot();const originalBaseline=baseline(before);const importedMaterials=verified?await decodeMaterials(verified.data):[];
 const contents=options.replace?[]:[...before.contents];const materials=options.replace?[]:[...before.materials];const settings=options.replace?[]:[...before.settings];const materialMap=new Map<string,string>();
 for(const m of importedMaterials){
  if(options.replace){materials.push(m);materialMap.set(m.id,m.id);continue;}
  const digest=await sha256(new Uint8Array(await m.blob.arrayBuffer()));let identical:typeof m|undefined;
  for(const candidate of materials.filter(x=>x.size===m.size&&x.type===m.type&&x.name===m.name))if(await sha256(new Uint8Array(await candidate.blob.arrayBuffer()))===digest){identical=candidate;break;}
  if(identical){materialMap.set(m.id,identical.id);continue;}
  const id=materials.some(x=>x.id===m.id)?crypto.randomUUID():m.id;materialMap.set(m.id,id);materials.push({...m,id});
 }
 const conflicts=findConflicts(checked,options.replace?[]:before.contents);
 for(const incoming of checked){const cover=incoming.manual.cover.backgroundMaterialId;const c=contentSchema.parse({...incoming,manual:{...incoming.manual,cover:{...incoming.manual.cover,backgroundMaterialId:materialMap.get(cover)??cover}},materialIds:incoming.materialIds.map(id=>materialMap.get(id)??id)});const conflict=conflicts.find(x=>x.incomingId===c.id);const decision=options.decisions?.[c.id]??'keep';if(conflict&&decision==='keep')continue;if(conflict&&decision==='replace'){const i=contents.findIndex(x=>x.id===conflict.existingId);const prior=contents[i];contents[i]={...c,id:conflict.existingId,history:[...prior.history,{at:new Date().toISOString(),status:c.status,reason:'Substituição confirmada na importação',before:prior.date,after:c.date}]};}else{if(!conflict&&contents.some(x=>fingerprint(x)===fingerprint(c)))continue;contents.push({...c,id:conflict?crypto.randomUUID():c.id});}}
 if(verified)for(const s of verified.data.settings)if(!settings.some(x=>x.key===s.key))settings.push(s);
 if(!verified&&'planning' in source&&source.planning){const p=source.planning;const key=`planning:${p.period}:${p.start}:${p.end}`;const value=JSON.stringify(p);const index=settings.findIndex(x=>x.key===key);if(index<0)settings.push({key,value});else settings[index]={key,value};}
 const ids=new Set(materials.map(m=>m.id));if(contents.some(c=>c.materialIds.some(id=>!ids.has(id))||c.manual.cover.backgroundMaterialId&&!ids.has(c.manual.cover.backgroundMaterialId)))throw Error('Vínculo com anexo inexistente. Inclua o material ou corrija a referência.');
 if(options.replace&&!backup)throw Error('Substituição completa exige backup.');const target={contents,materials,settings};const temp=new PlannerDB('mkt-validation-'+crypto.randomUUID());
 try{await temp.transaction('rw',temp.contents,temp.materials,temp.settings,async()=>{await temp.contents.bulkAdd(contents);await temp.materials.bulkAdd(materials);await temp.settings.bulkAdd(settings);});const staged=await snapshot(temp);if(canonical([...staged.contents].sort((a,b)=>a.id.localeCompare(b.id)))!==canonical([...contents].sort((a,b)=>a.id.localeCompare(b.id))))throw Error('Falha de validação temporária dos conteúdos.');if(staged.materials.length!==materials.length||canonical([...staged.settings].sort((a,b)=>a.key.localeCompare(b.key)))!==canonical([...settings].sort((a,b)=>a.key.localeCompare(b.key))))throw Error('Falha de validação temporária de registros.');for(const m of staged.materials){const original=materials.find(x=>x.id===m.id)!;if(await sha256(new Uint8Array(await m.blob.arrayBuffer()))!==await sha256(new Uint8Array(await original.blob.arrayBuffer())))throw Error('Falha de validação temporária do anexo.');}}finally{temp.close();await Dexie.delete(temp.name);}
 return {baseline:originalBaseline,target,legacy:verified?.legacy??false,summary:`${contents.length} conteúdo(s), ${materials.length} anexo(s) no resultado final.`};
}
export async function commitImport(plan:ImportPlan){await db.transaction('rw',db.contents,db.materials,db.settings,async()=>{const current={contents:await db.contents.toArray(),materials:await db.materials.toArray(),settings:await db.settings.toArray()};if(baseline(current)!==plan.baseline)throw Error('Os dados locais mudaram. Refaça a prévia para evitar sobrescritas.');await db.contents.clear();await db.materials.clear();await db.settings.clear();await db.contents.bulkAdd(plan.target.contents);await db.materials.bulkAdd(plan.target.materials);await db.settings.bulkAdd(plan.target.settings);});}
export async function restore(data:unknown,replace:boolean){await commitImport(await prepareImport(data,{replace}));}

