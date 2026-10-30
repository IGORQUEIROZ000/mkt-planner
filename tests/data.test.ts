import {describe,it,expect,beforeEach} from 'vitest';
import {db,blank,parseImport,monthCells,exportBackup,restore} from '../src/data';
beforeEach(async()=>{await db.contents.clear();await db.materials.clear();await db.settings.clear();});
describe('contrato e calendário',()=>{
it('inicia a semana no domingo',()=>{expect(monthCells(2026,9)[0].getDay()).toBe(0);expect(monthCells(2026,9)).toHaveLength(42);});
it('não inventa datas ou formato no texto e reconhece cenas',()=>{const p=parseImport('# Ideia\nCena 1: abertura');expect(p.data.contents[0].date).toBe('');expect(p.data.contents[0].format).toBe('Não informado');expect(p.data.contents[0].scenes).toBe('Cena 1: abertura');});
it('recusa versões incompatíveis e datas inválidas',()=>{expect(()=>parseImport('{"kind":"mkt-editorial","version":2,"contents":[]}')).toThrow();expect(()=>parseImport(JSON.stringify({kind:'mkt-editorial',version:1,contents:[{...blank(),title:'Teste',date:'2026-02-30'}]}))).toThrow();});
it('restaura um backup e preserva conflitos na mesclagem',async()=>{const c={...blank(),title:'Original'};await db.contents.add(c);const backup=await exportBackup();await db.contents.put({...c,title:'Alterado'});await restore(backup,false);expect((await db.contents.get(c.id))?.title).toBe('Alterado');await restore(backup,true);expect((await db.contents.get(c.id))?.title).toBe('Original');});
it('mantém dados ao reabrir a conexão',async()=>{const c={...blank(),title:'Persistente'};await db.contents.add(c);db.close();await db.open();expect((await db.contents.get(c.id))?.title).toBe('Persistente');});
it('recusa anexo inconsistente sem apagar dados',async()=>{await db.contents.add({...blank(),title:'Preservar'});await expect(restore({kind:'mkt-backup',version:1,exportedAt:new Date().toISOString(),contents:[],settings:[],materials:[{id:'a',name:'a',type:'text/plain',size:10,data:'YQ=='}]},true)).rejects.toThrow();expect(await db.contents.count()).toBe(1);});
it('exporta e restaura anexos',async()=>{await db.materials.add({id:'a',name:'teste.txt',type:'text/plain',size:3,blob:new Blob(['abc'],{type:'text/plain'})});const b=await exportBackup();await restore(b,true);expect((await db.materials.get('a'))?.size).toBe(3);expect(b.materials[0].data).toBe('YWJj');});
});
