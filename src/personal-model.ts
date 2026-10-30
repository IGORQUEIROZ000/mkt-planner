import {z} from 'zod';
export const civilDate=z.string().refine(v=>v===''||isCivilDate(v),'Data civil inválida');
export function isCivilDate(v:string){const m=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return false;const y=+m[1],mo=+m[2],d=+m[3];const leap=y%4===0&&(y%100!==0||y%400===0);return y>=1&&mo>=1&&mo<=12&&d>=1&&d<=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31][mo-1];}
const text=()=>z.string().default('');
const quantity=()=>z.number().finite().nonnegative().nullable().default(null);
const whole=()=>z.number().int().nonnegative().nullable().default(null);
const task=z.object({id:z.string().min(1),text:z.string(),done:z.boolean()});
export const frameSchema=z.object({id:z.string().min(1),number:z.number().int().positive(),startSeconds:quantity(),endSeconds:quantity(),objective:text(),text:text(),materials:text(),dimensions:text(),background:text(),font:text(),weight:text(),fontSize:text(),color:text(),alignment:text(),position:text(),margins:text(),visuals:text(),assembly:text(),hierarchy:text()}).refine(f=>f.startSeconds===null||f.endSeconds===null||f.endSeconds>=f.startSeconds,'Fim da cena anterior ao início');
export const visualSchema=z.object({presetId:text(),background:text(),textColor:text(),accentColor:text(),font:text(),weight:text(),fontSize:text(),position:text(),margins:text(),dimensions:text()});
export const manualSchema=z.object({
 strategy:z.object({theme:text(),objective:text(),audience:text(),hook:text(),development:text(),ending:text(),cta:text(),durationSeconds:quantity()}).default(()=>({theme:'',objective:'',audience:'',hook:'',development:'',ending:'',cta:'',durationSeconds:null})),
 frames:z.array(frameSchema).default([]),
 edit:z.object({app:text(),steps:z.array(task).default([]),effects:text(),transitions:text(),audio:text(),music:text(),narration:text(),coverNotes:text()}).default(()=>({app:'',steps:[],effects:'',transitions:'',audio:'',music:'',narration:'',coverNotes:''})),
 cover:z.object({phrase:text(),backgroundMaterialId:text(),font:text(),weight:text(),fontSize:text(),color:text(),position:text(),margins:text(),graphics:text()}).default(()=>({phrase:'',backgroundMaterialId:'',font:'',weight:'',fontSize:'',color:'',position:'',margins:'',graphics:''})),
 guided:z.object({estimatedMinutes:quantity(),difficulty:z.enum(['Não informado','Fácil','Intermediário','Avançado']).default('Não informado'),materials:text(),currentStep:z.number().int().nonnegative().default(0),steps:z.array(task).default([])}).default(()=>({estimatedMinutes:null,difficulty:'Não informado' as const,materials:'',currentStep:0,steps:[]})),
 visual:visualSchema.default(()=>({presetId:'',background:'',textColor:'',accentColor:'',font:'',weight:'',fontSize:'',position:'',margins:'',dimensions:''}))
});
export type Manual=z.infer<typeof manualSchema>;
export const metricNames={views:'Visualizações',reach:'Alcance',likes:'Curtidas',comments:'Comentários',saves:'Salvamentos',shares:'Compartilhamentos',profileVisits:'Visitas ao perfil',followers:'Novos seguidores',contacts:'Contatos recebidos'} as const;
export const metricsSchema=z.object({views:whole(),reach:whole(),likes:whole(),comments:whole(),saves:whole(),shares:whole(),profileVisits:whole(),followers:whole(),contacts:whole()});
export type Metrics=z.infer<typeof metricsSchema>;
export const marketSchema=z.object({source:text(),verifiedOn:civilDate.default(''),nextReview:civilDate.default(''),expiresOn:civilDate.default(''),notes:text(),status:z.enum(['Não verificado','Confirmado manualmente','Revisar']).default('Não verificado')});
export const scheduleSchema=z.object({time:z.string().refine(v=>v===''||/^([01]\d|2[0-3]):[0-5]\d$/.test(v),'Horário inválido').default(''),endDate:civilDate.default(''),endTime:z.string().refine(v=>v===''||/^([01]\d|2[0-3]):[0-5]\d$/.test(v),'Horário final inválido').default('')});
export const periods=['Diário','Semanal','Mensal','Semestral','Anual'] as const;
export const planningSchema=z.object({period:z.enum(periods),start:civilDate,end:civilDate,timeZone:z.literal('America/Bahia')}).refine(p=>!p.start||!p.end||p.start<=p.end,'Intervalo de planejamento inválido');
export function personalDefaults(){return {manual:manualSchema.parse({}),metrics:metricsSchema.parse({}),market:marketSchema.parse({}),schedule:scheduleSchema.parse({}),notes:'',sensitive:''};}
export function metricRates(m:Metrics){
 const values=[m.likes,m.comments,m.saves,m.shares];const interactions=values.every(v=>v!==null)?values.reduce<number>((a,v)=>a+(v??0),0):null;
 return {interactions,engagement:interactions!==null&&m.reach!==null&&m.reach>0?100*interactions/m.reach:null,contactRate:m.contacts!==null&&m.profileVisits!==null&&m.profileVisits>0?100*m.contacts/m.profileVisits:null};
}

