import {db,contentSchema,canonical,type Content} from './data';
import {planningSchema} from './personal-model';
import {todayBahia} from './calendar-model';
export async function saveContent(input:Content,allowPublished=false,reason='Edição do conteúdo'){
 const c=contentSchema.parse(input);
 return db.transaction('rw',db.contents,async()=>{const prior=await db.contents.get(c.id);if(prior&&canonical({...prior,history:[]})===canonical({...c,history:[]}))return;
 if(prior?.status==='Publicado'&&!allowPublished)throw Error('Confirme a alteração do conteúdo já publicado.');
 const changes=prior?Object.keys(c).filter(k=>k!=='history'&&canonical(prior[k as keyof Content])!==canonical(c[k as keyof Content])).join(', '):'novo conteúdo';
 c.history=[...(prior?.history??c.history),{at:new Date().toISOString(),status:c.status,reason:reason+': '+changes,before:prior?`${prior.date} ${prior.schedule.time}`:'',after:`${c.date} ${c.schedule.time}`}];await db.contents.put(c);
 });
}
export function missingManual(c:Content){const missing:string[]=[];const s=c.manual.strategy;
 for(const [label,value] of [['Objetivo',s.objective],['Público-alvo',s.audience],['Gancho',s.hook],['CTA',s.cta],['Roteiro',c.script],['Instruções de edição',c.editing||c.manual.edit.steps.map(s=>s.text).join('')],['Legenda',c.caption]])if(!value)missing.push(label);
 if(!c.manual.frames.length&&!c.scenes)missing.push('Cenas/slides');if(!c.manual.cover.phrase)missing.push('Frase da capa');return missing;
}
export function editorialExport(contents:Content[],planning:typeof planningSchema._output|null=null){return {kind:'mkt-editorial' as const,version:2 as const,planning,contents:contents.map(c=>contentSchema.parse(c))};}
export function chatGptExport(contents:Content[],options:{start:string;end:string;ids:string[];pending:boolean;results:boolean;notes:boolean;excludeSensitive:boolean;period:typeof planningSchema._output.period}){
 const filtered=contents.filter(c=>(!options.ids.length||options.ids.includes(c.id))&&(!options.start||c.date&&c.date>=options.start)&&(!options.end||c.date&&c.date<=options.end));
 const rows=filtered.map(c=>{const copy=structuredClone(c);if(!options.results){copy.metrics={views:null,reach:null,likes:null,comments:null,saves:null,shares:null,profileVisits:null,followers:null,contacts:null};copy.results='';}if(!options.notes){copy.notes='';copy.market.notes='';copy.unknown='';}if(!options.pending){copy.checklist=[];copy.manual.guided.steps=[];copy.manual.edit.steps=[];copy.manual.guided.currentStep=0;}if(options.excludeSensitive)copy.sensitive='';return copy;});
 const json=editorialExport(rows,{period:options.period,start:options.start,end:options.end,timeZone:'America/Bahia'});
 const markdown=`# MKT Planner — acompanhamento\nExportado em ${todayBahia()} · America/Bahia\nPeríodo: ${options.start||'sem início'} a ${options.end||'sem fim'}\n\n`+rows.map(c=>`## ${c.title}\nData: ${c.date||'Não definida'} ${c.schedule.time}\nFormato: ${c.format} · Status: ${c.status}\nTema: ${c.manual.strategy.theme||'Não informado'}\n${options.pending?'Pendências: '+missingManual(c).join(', ')+'\nChecklist: '+c.checklist.filter(x=>!x.done).map(x=>x.text).join('; ')+'\n':''}${options.results?'Resultados: '+JSON.stringify(c.metrics)+'\nObservações de resultado: '+c.results+'\n':''}${options.notes?'Observações: '+c.notes+'\nRevisar: '+c.unknown+'\n':''}${!options.excludeSensitive?'Dados sensíveis: '+c.sensitive+'\n':''}`).join('\n');
 return {json,markdown};
}
