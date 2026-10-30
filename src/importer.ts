import {manualSchema,metricsSchema,marketSchema,scheduleSchema} from './personal-model';
import {blank,contentSchema,editorialSchema,backupSchema,legacyBackupSchema,type Backup,type LegacyBackup,type Content} from './core';
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const aliases:Record<string,keyof Content>={titulo:'title',conteudo:'title',data:'date',formato:'format',roteiro:'script',cenas:'scenes',cena:'scenes','instrucoes de edicao':'editing','orientacoes de edicao':'editing',edicao:'editing',legenda:'caption',hashtags:'hashtags',checklist:'checklist'};
export function parseStructuredText(raw:string){
 const blocks=raw.replace(/\r\n?/g,'\n').split(/\n\s*(?:---+|===+)\s*\n|\n(?=# (?!#))|\n(?=T[íi]tulo:\s*)/).filter(s=>s.trim());
 return blocks.map((block,index)=>{
  const c:Content={...blank(),title:'',format:'Não informado'};
  const structured:Record<string,unknown>={};
  for(const label of ['Manual de produção','Resultados estruturados','Revisão de mercado','Agenda']){
   const pattern=new RegExp('^(?:#{1,6}\\s*)?'+label+'(?: JSON)?:?\\s*\\n```json\\s*\\n([\\s\\S]*?)\\n```','mi');
   const match=block.match(pattern);if(match){structured[label]=JSON.parse(match[1]);block=block.replace(pattern,'');}
  }
  if(structured['Manual de produção'])c.manual=manualSchema.parse(structured['Manual de produção']);
  if(structured['Resultados estruturados'])c.metrics=metricsSchema.parse(structured['Resultados estruturados']);
  if(structured['Revisão de mercado'])c.market=marketSchema.parse(structured['Revisão de mercado']);
  if(structured['Agenda'])c.schedule=scheduleSchema.parse(structured['Agenda']);
let active:keyof Content='unknown';const fields:Record<string,string[]>={};const append=(key:string,value:string)=>{(fields[key]??=[]).push(value);};
  for(const original of block.split('\n')){
   const line=original.replace(/^\s*#{1,6}\s*/,'').replace(/\*\*/g,'').replace(/^[-*]\s+(?=[^:]+:)/,'').trim();const match=line.match(/^([^:]{1,60}):\s*(.*)$/);const headingKey=aliases[normalize(line)];
   if(match&&['tema','objetivo','publico-alvo','gancho','desenvolvimento','finalizacao','cta'].includes(normalize(match[1]))){
    const map:Record<string,string>={'tema':'theme','objetivo':'objective','publico-alvo':'audience','gancho':'hook','desenvolvimento':'development','finalizacao':'ending','cta':'cta'};
    (c.manual.strategy as unknown as Record<string,unknown>)[map[normalize(match[1])]]=match[2];active='unknown';
   }else if(match&&normalize(match[1])==='observacoes'){c.notes=match[2];active='unknown';}
   else if(match&&normalize(match[1])==='dados sensiveis'){c.sensitive=match[2];active='unknown';}
   else if(match&&aliases[normalize(match[1])]){active=aliases[normalize(match[1])];append(active,match[2]);}
   else if(headingKey)active=headingKey;
   else if(/^\s*# /.test(original)&&!(fields.title?.length)){append('title',line);active='script';}
   else if(/^(?:cena|story|slide)\s+\d+\b/i.test(line)){active='scenes';append(active,original);}
   else if(match){active='unknown';append('unknown',original);}
   else append(active,original);
  }
  for(const [key,lines] of Object.entries(fields)){
   const value=lines.join('\n').trim();
   if(key==='date'){const br=value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);const date=br?`${br[3]}-${br[2]}-${br[1]}`:value;if(contentSchema.shape.date.safeParse(date).success)c.date=date;else c.unknown+=`\nData não reconhecida: ${value}`;}
   else if(key==='format'){const formats:Record<string,Content['format']>={stories:'Stories',story:'Stories',reel:'Reels',reels:'Reels',carrossel:'Carrossel',carrosseis:'Carrossel',imovel:'Imóvel','post de imovel':'Imóvel','post de imoveis':'Imóvel',post:'Post'};const format=formats[normalize(value)];if(format)c.format=format;else c.unknown+=`\nFormato não reconhecido: ${value}`;}
   else if(key==='checklist')c.checklist=value.split('\n').filter(s=>s.trim()).map(s=>({text:s.replace(/^\s*(?:[-*]\s*)?(?:\[[ xX]\]\s*)?/,'').trim(),done:/\[[xX]\]/.test(s)}));
   else if(['title','script','scenes','editing','caption','hashtags','unknown'].includes(key))(c as unknown as Record<string,unknown>)[key]=key==='unknown'?[c.unknown,value].filter(Boolean).join('\n'):value;
  }
  if(!c.title){c.title=`[Revisar título ${index+1}]`;c.unknown+='\nTítulo ausente no original. Substitua o marcador antes de importar.';}
  c.unknown=c.unknown.trim();return contentSchema.parse(c);
 });
}
export function parseImport(raw:string){const clean=raw.trim().replace(/^```(?:json)?\s*\n([\s\S]*?)\n```$/i,'$1');if(!clean)throw Error('O texto está vazio.');if(/^[{[]/.test(clean)){const o=JSON.parse(clean);if(o?.kind==='mkt-backup'){if(o.version===1)legacyBackupSchema.parse(o);else backupSchema.parse(o);return {type:'backup' as const,data:o as Backup|LegacyBackup};}const parsed=editorialSchema.parse(o);parsed.contents.forEach((c,i)=>{const extra=Object.fromEntries(Object.entries(o.contents[i]).filter(([key])=>!Object.hasOwn(contentSchema.shape,key)));if(Object.keys(extra).length)c.unknown=[c.unknown,'Campos JSON adicionais: '+JSON.stringify(extra,null,2)].filter(Boolean).join('\n');});return {type:'editorial' as const,data:parsed};}return {type:'text' as const,data:editorialSchema.parse({kind:'mkt-editorial',version:1,contents:parseStructuredText(clean)})};}




