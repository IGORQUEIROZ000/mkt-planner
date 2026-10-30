import {useMemo,useState} from 'react';
import {contentSchema,formats,type Content,download,exportBackup,verifyBackup,decodeMaterials} from './data';
import {findConflicts,prepareImport,commitImport,type Decision,type ImportPlan} from './transfer';
import type {parseImport} from './importer';
import {ProductionFields} from './Studio';
type Parsed=ReturnType<typeof parseImport>;
export function ImportPreview({source,existing,onDone,onError}:{source:Parsed;existing:Content[];onDone:()=>void;onError:(s:string)=>void}){
 const [rows,setRows]=useState(source.data.contents.map(c=>contentSchema.parse(c))),[decisions,setDecisions]=useState<Record<string,Decision>>({}),[replace,setReplace]=useState(false),[review,setReview]=useState(false),[legacy,setLegacy]=useState(false),[safety,setSafety]=useState(false),[plan,setPlan]=useState<ImportPlan|null>(null),[busy,setBusy]=useState(false);
 const [checklists,setChecklists]=useState(rows.map(c=>c.checklist.map(x=>`[${x.done?'x':' '}] ${x.text}`).join('\n')));
 const [links,setLinks]=useState(rows.map(c=>c.materialIds.join(', ')));
 const conflicts=useMemo(()=>findConflicts(rows,existing),[rows,existing]);
 const isLegacy=source.type==='backup'&&source.data.version===1;
 function invalidate(){setPlan(null);setReview(false);}
 function update(index:number,patch:Partial<Content>){setRows(rows.map((c,i)=>i===index?{...c,...patch}:c));invalidate();}
 async function validate(){setBusy(true);try{if(source.type==='backup'){await verifyBackup(source.data);await decodeMaterials(source.data);}const editedContents=rows.map((c,i)=>({...c,checklist:checklists[i].split('\n').filter(x=>x.trim()).map(x=>({text:x.replace(/^\[[ xX]\]\s*/,''),done:/^\[[xX]\]/.test(x)})),materialIds:links[i].split(',').map(x=>x.trim()).filter(Boolean)}));const prepared=await prepareImport(source.data,{replace,decisions,editedContents});setPlan(prepared);}catch(e){setPlan(null);onError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}}
 async function apply(){if(!plan||!review||(replace&&!safety)||(isLegacy&&!legacy))return;setBusy(true);try{if(replace&&!confirm('Substituir TODOS os dados locais pelo resultado validado?'))return;await commitImport(plan);onDone();}catch(e){setPlan(null);onError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}}
 return <div className="import-preview"><fieldset disabled={busy} className="preview-controls"><h3>Prévia editável · versão {source.data.version}</h3><p>{rows.length} conteúdo(s){source.type==='backup'?`, ${source.data.materials.length} anexo(s)`:''}.</p>
 {'planning' in source.data&&source.data.planning&&<p>Planejamento {source.data.planning.period}: {source.data.planning.start||'início não definido'} a {source.data.planning.end||'fim não definido'} · {source.data.planning.timeZone}</p>}
 {isLegacy&&<label className="check"><input type="checkbox" checked={legacy} onChange={e=>setLegacy(e.target.checked)}/>Este backup antigo não possui checksum. Aceito revisar e validar os anexos antes de restaurar.</label>}
 {rows.map((c,i)=><details key={c.id} open={rows.length===1}><summary>{c.title} · {c.date||'Sem data'} · {c.format}</summary>
 <label>Título da prévia<input value={c.title} onChange={e=>update(i,{title:e.target.value})}/></label>
 <label>Data da prévia<input type="date" value={c.date} onChange={e=>update(i,{date:e.target.value})}/></label>
 <label>Formato da prévia<select value={c.format} onChange={e=>update(i,{format:e.target.value as Content['format']})}>{formats.map(f=><option key={f}>{f}</option>)}</select></label>
 {(['script','scenes','editing','caption','hashtags','unknown'] as const).map((key,j)=><label key={key}>{['Roteiro','Cenas','Instruções de edição','Legenda','Hashtags','Informações para revisão'][j]} da prévia<textarea value={c[key]} onChange={e=>update(i,{[key]:e.target.value})}/></label>)}
 <label>Checklist da prévia<textarea value={checklists[i]} onChange={e=>{setChecklists(checklists.map((x,j)=>j===i?e.target.value:x));invalidate();}}/></label>
 <label>IDs de anexos da prévia<input value={links[i]} onChange={e=>{setLinks(links.map((x,j)=>j===i?e.target.value:x));invalidate();}}/></label>
 <details><summary>Revisar manual completo, agenda e resultados</summary><div className="form-grid"><label>Horário da prévia<input type="time" value={c.schedule.time} onChange={e=>update(i,{schedule:{...c.schedule,time:e.target.value}})}/></label><label>Fim da data da prévia<input type="date" value={c.schedule.endDate} onChange={e=>update(i,{schedule:{...c.schedule,endDate:e.target.value}})}/></label><label>Fim do horário da prévia<input type="time" value={c.schedule.endTime} onChange={e=>update(i,{schedule:{...c.schedule,endTime:e.target.value}})}/></label></div><ProductionFields value={{...c,checklist:checklists[i].split('\n').filter(x=>x.trim()).map(x=>({text:x.replace(/^\[[ xX]\]\s*/,''),done:/^\[[xX]\]/.test(x)})),materialIds:links[i].split(',').map(x=>x.trim()).filter(Boolean)}} onChange={updated=>{update(i,updated);setChecklists(checklists.map((x,j)=>j===i?updated.checklist.map(t=>'['+(t.done?'x':' ')+'] '+t.text).join('\n'):x));setLinks(links.map((x,j)=>j===i?updated.materialIds.join(', '):x));}} materials={[]} prefix="Prévia · "/></details>
 </details>)}
 {source.type==='backup'&&<label>Modo de restauração<select value={String(replace)} onChange={e=>{setReplace(e.target.value==='true');invalidate();setSafety(false);}}><option value="false">Mesclar com decisões por conteúdo</option><option value="true">Substituir todos os dados</option></select></label>}
 {!replace&&conflicts.map(conflict=><fieldset key={conflict.incomingId}><legend>Conflito: {conflict.title}</legend><p>{conflict.reason} · registro local {conflict.existingId}</p>{existing.find(c=>c.id===conflict.existingId)?.status==='Publicado'&&<p className='warning'>Este conteúdo já foi publicado. Substitua somente após revisar; o histórico local será preservado.</p>}<label>Decisão para {conflict.title}<select value={decisions[conflict.incomingId]??'keep'} onChange={e=>{setDecisions({...decisions,[conflict.incomingId]:e.target.value as Decision});invalidate();}}><option value="keep">Manter conteúdo local</option><option value="replace">Substituir conteúdo local</option><option value="duplicate">Duplicar com novo ID</option></select></label></fieldset>)}
 {replace&&<div className="safety"><strong>Antes de substituir, proteja os dados atuais.</strong><button disabled={busy} onClick={async()=>{try{download('mkt-backup-seguranca.json',JSON.stringify(await exportBackup(),null,2));}catch(e){onError(String(e));}}}>Exportar backup de segurança</button><label className="check"><input type="checkbox" checked={safety} onChange={e=>setSafety(e.target.checked)}/>Guardei uma cópia ou decidi continuar sem ela.</label></div>}
 <button disabled={busy||(isLegacy&&!legacy)} onClick={validate}>{busy?'Validando…':'Validar resultado em banco temporário'}</button>
 {plan&&<><p role="status">Validação temporária concluída. {plan.summary}</p><label className="check"><input type="checkbox" checked={review} onChange={e=>setReview(e.target.checked)}/>Revisei os dados e os campos ausentes.</label><button disabled={busy||!review||(replace&&!safety)||(isLegacy&&!legacy)} onClick={apply}>Confirmar importação</button></>}
 </fieldset></div>;
}


