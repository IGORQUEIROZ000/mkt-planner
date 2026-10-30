import {isCivilDate,type periods} from './personal-model';
type Period=typeof periods[number];
export const TIME_ZONE='America/Bahia';
export function todayBahia(now=new Date()){const p=new Intl.DateTimeFormat('en-CA',{timeZone:TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);return ['year','month','day'].map(k=>p.find(x=>x.type===k)!.value).join('-');}
function at(date:string){if(!isCivilDate(date))throw Error('Data civil inválida');const d=new Date(0);d.setUTCFullYear(+date.slice(0,4),+date.slice(5,7)-1,+date.slice(8,10));d.setUTCHours(12,0,0,0);return d;}
export function civilKey(d:Date){const y=d.getUTCFullYear();if(y<1||y>9999)throw Error('Data fora do intervalo suportado');return `${String(y).padStart(4,'0')}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;}
export function addDays(date:string,n:number){const d=at(date);d.setUTCDate(d.getUTCDate()+n);return civilKey(d);}
export function weekday(date:string){return at(date).getUTCDay();}
export function addMonths(date:string,n:number){const d=at(date);d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+n);return civilKey(d);}
export function periodBounds(period:Period,anchor:string){const y=anchor.slice(0,4),mo=+anchor.slice(5,7);let start=anchor,end=anchor;if(period==='Semanal'){start=addDays(anchor,-weekday(anchor));end=addDays(start,6);}if(period==='Mensal'){start=anchor.slice(0,7)+'-01';end=addDays(addMonths(start,1),-1);}if(period==='Semestral'){start=`${y}-${mo<=6?'01':'07'}-01`;end=addDays(addMonths(start,6),-1);}if(period==='Anual'){start=`${y}-01-01`;end=`${y}-12-31`;}return {start,end};}
export function rangeDays(start:string,end:string){const days:string[]=[];for(let d=start;d<=end;d=addDays(d,1)){days.push(d);if(d===end)break;}return days;}
export function monthGrid(anchor:string){const first=anchor.slice(0,7)+'-01';const start=addDays(first,-weekday(first));return Array.from({length:42},(_,i)=>addDays(start,i));}
export function displayCivil(d:string){return d?d.split('-').reverse().join('/'):'Sem data';}
export function reviewOverdue(m:{nextReview:string;expiresOn:string},today=todayBahia()){return !!((m.nextReview&&m.nextReview<today)||(m.expiresOn&&m.expiresOn<today));}
export function scheduleConflicts<T extends {id:string;date:string;schedule:{time:string;endDate:string;endTime:string}}>(c:T,others:T[]){
 if(!c.date||!c.schedule.time)return [];
 const interval=(x:T)=>{const start=x.date+'T'+x.schedule.time;let end=(x.schedule.endDate||x.date)+'T'+(x.schedule.endTime||x.schedule.time);return {start,end};};
 const a=interval(c);return others.filter(o=>o.id!==c.id&&o.date&&o.schedule.time).filter(o=>{const b=interval(o);return a.start===b.start||(a.start<b.end&&b.start<a.end);});
}
