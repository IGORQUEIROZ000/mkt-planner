import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
vi.mock('virtual:pwa-register',()=>({registerSW:vi.fn()}));
import {App} from '../src/main';
import {db} from '../src/data';
it('salva conteúdo pelo estúdio e apresenta texto sem executar HTML',async()=>{await db.contents.clear();const {container}=render(<App/>);fireEvent.click(screen.getByRole('button',{name:'Novo conteúdo',exact:true}));fireEvent.change(screen.getByLabelText('Título',{exact:true}),{target:{value:'<script>alert(1)</script>'}});fireEvent.click(screen.getByRole('tab',{name:'2. Roteiro e cenas/slides',exact:true}));fireEvent.change(screen.getByLabelText('Roteiro · cenas e falas'),{target:{value:'Minha cena'}});fireEvent.click(screen.getByRole('button',{name:'Salvar conteúdo'}));await waitFor(()=>expect(screen.queryByRole('button',{name:'Salvar conteúdo'})).not.toBeInTheDocument());expect(await db.contents.count()).toBe(1);expect(container.querySelector('script')).toBeNull();expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();});
