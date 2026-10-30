import Dexie, {type Table} from 'dexie';
import {z} from 'zod';
import {civilDate,manualSchema,metricsSchema,marketSchema,scheduleSchema,planningSchema,personalDefaults} from './personal-model';
export const formats=['Não informado','Stories','Reels','Carrossel','Imóvel','Post'] as const;
export const contentSchema=z.object({
 id:z.string().min(1),title:z.string().min(1).max(300),date:civilDate,
 format:z.enum(formats),status:z.enum(['Ideia','Em produção','Pronto','Publicado']),script:z.string(),editing:z.string(),caption:z.string(),hashtags:z.string(),checklist:z.array(z.object({text:z.string(),done:z.boolean()})),results:z.string(),history:z.array(z.object({at:z.string().datetime({offset:true}),status:z.string(),reason:z.string().optional(),before:z.string().optional(),after:z.string().optional()})),scenes:z.string().default(''),unknown:z.string().default(''),materialIds:z.array(z.string().min(1)).default([]),
 manual:manualSchema.default(()=>manualSchema.parse({})),metrics:metricsSchema.default(()=>metricsSchema.parse({})),market:marketSchema.default(()=>marketSchema.parse({})),schedule:scheduleSchema.default(()=>scheduleSchema.parse({})),notes:z.string().default(''),sensitive:z.string().default('')
}).refine(c=>!c.schedule.endDate||!!c.date&&c.schedule.endDate>=c.date,'Data final anterior ao início ou início ausente').refine(c=>!c.schedule.endTime||!!c.schedule.time&&((c.schedule.endDate&&c.schedule.endDate>c.date)||c.schedule.endTime>=c.schedule.time),'Intervalo de horário inválido');
export type Content=z.infer<typeof contentSchema>;
export type Material={id:string;name:string;type:string;size:number;blob:Blob;revision?:string};
export type Setting={key:string;value:string};
export class PlannerDB extends Dexie{
 contents!:Table<Content,string>;materials!:Table<Material,string>;settings!:Table<Setting,string>;
 constructor(name='mkt-planner-igor'){
  super(name,{chromeTransactionDurability:'strict'});
  this.version(1).stores({contents:'id,date,format,status',materials:'id,name',settings:'key'});
  this.version(2).stores({contents:'id,date,format,status',materials:'id,name',settings:'key'}).upgrade(tx=>tx.table('contents').toCollection().modify(c=>{c.history??=[];c.results??='';}));
  this.version(3).stores({contents:'id,date,format,status',materials:'id,name',settings:'key'}).upgrade(async tx=>{await tx.table('contents').toCollection().modify(c=>{c.scenes??='';c.unknown??='';c.materialIds??=[];});await tx.table('materials').toCollection().modify(m=>{m.revision=crypto.randomUUID();});});
    this.version(4).stores({contents:'id,date,format,status',materials:'id,name',settings:'key'}).upgrade(tx=>tx.table('contents').toCollection().modify(c=>{const defaults=personalDefaults();for(const [key,value] of Object.entries(defaults))c[key]??=value;}));
  this.materials.hook('creating',(_key,obj)=>{obj.revision=crypto.randomUUID();});
  this.materials.hook('updating',()=>({revision:crypto.randomUUID()}));
  this.on('versionchange',()=>{this.close();globalThis.dispatchEvent?.(new Event('mkt-db-versionchange'));});
 }
}
export const db=new PlannerDB();
const unique=<T extends {id:string}>(items:T[])=>new Set(items.map(c=>c.id)).size===items.length;
const editorialFields={kind:z.literal('mkt-editorial'),contents:z.array(contentSchema).refine(unique,'IDs duplicados')};
export const editorialSchema=z.union([z.object({...editorialFields,version:z.literal(1)}).strict(),z.object({...editorialFields,version:z.literal(2),planning:planningSchema.nullable()}).strict()]);
const materialSchema=z.object({id:z.string().min(1),name:z.string().min(1),type:z.string(),size:z.number().int().nonnegative(),data:z.string().refine(s=>/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s),'Anexo inválido')}).strict();
const backupFields={kind:z.literal('mkt-backup'),exportedAt:z.string().datetime({offset:true}),contents:z.array(contentSchema).refine(unique,'IDs de conteúdo duplicados'),settings:z.array(z.object({key:z.string().min(1),value:z.string()}).strict()).refine(items=>new Set(items.map(s=>s.key)).size===items.length,'Configurações duplicadas'),materials:z.array(materialSchema).refine(unique,'IDs de anexos duplicados')};
export const legacyBackupSchema=z.object({...backupFields,version:z.literal(1)}).strict();
const integrity=z.object({algorithm:z.literal('SHA-256'),digest:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
export const backupSchema=z.union([z.object({...backupFields,version:z.literal(2),integrity}).strict(),z.object({...backupFields,version:z.literal(3),integrity}).strict()]);
export type Backup=z.infer<typeof backupSchema>;
export type LegacyBackup=z.infer<typeof legacyBackupSchema>;
export function blank():Content{return {id:crypto.randomUUID(),title:'',date:'',format:'Reels',status:'Ideia',script:'',editing:'',caption:'',hashtags:'',checklist:[],results:'',history:[],scenes:'',unknown:'',materialIds:[],...personalDefaults()};}
export function canonical(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value!==null&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical((value as Record<string,unknown>)[k])).join(',')+'}';return JSON.stringify(value);}
export async function sha256(value:string|Uint8Array){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
export async function signBackup(payload:Omit<Backup,'integrity'>):Promise<Backup>{const normalized=backupSchema.parse({...payload,integrity:{algorithm:'SHA-256',digest:'0'.repeat(64)}});const {integrity,...data}=normalized;return {...data,integrity:{algorithm:'SHA-256',digest:await sha256(canonical(data))}};}
export async function verifyBackup(raw:unknown){const record=raw as Record<string,unknown>;if(record?.version===1)return {data:legacyBackupSchema.parse(raw),legacy:true};const data=backupSchema.parse(raw);const {integrity,...payload}=record;if(await sha256(canonical(payload))!==data.integrity.digest)throw Error('Integridade SHA-256 inválida: backup corrompido ou modificado.');return {data,legacy:false};}
export async function snapshot(database=db){return database.transaction('r',database.contents,database.materials,database.settings,async()=>({contents:await database.contents.toArray(),materials:await database.materials.toArray(),settings:await database.settings.toArray()}));}
export async function exportBackup():Promise<Backup>{const data=await snapshot();const materials=await Promise.all(data.materials.map(async m=>({id:m.id,name:m.name,type:m.type,size:m.size,data:await blobBase64(m.blob)})));return signBackup({kind:'mkt-backup',version:3,exportedAt:new Date().toISOString(),contents:data.contents.map(c=>contentSchema.parse(c)),settings:data.settings,materials});}
export async function decodeMaterials(data:Backup|LegacyBackup){return Promise.all(data.materials.map(async m=>{const bytes=Uint8Array.from(atob(m.data),c=>c.charCodeAt(0));if(bytes.length!==m.size)throw Error('Tamanho de anexo inconsistente: '+m.name);return {id:m.id,name:m.name,type:m.type,size:m.size,blob:new Blob([bytes],{type:m.type})} as Material;}));}
export function monthCells(year:number,month:number){const start=new Date(year,month,1).getDay();return Array.from({length:42},(_,i)=>new Date(year,month,i-start+1));}
export function dateKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function download(name:string,data:Blob|string){const url=URL.createObjectURL(typeof data==='string'?new Blob([data],{type:'application/json'}):data);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function blobBase64(blob:Blob){const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);}
export {parseImport} from './importer';
