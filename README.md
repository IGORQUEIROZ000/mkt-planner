# MKT Planner | Igor Queiroz — v1.2.0 Edição Pessoal

**Segurança para decidir. Confiança para conquistar.**

Evolução da base corrigida v1.1.0. Aplicativo pessoal e estático, com dados em IndexedDB, funcionamento offline após o cache inicial e transferência manual de arquivos para o ChatGPT. Sem backend de dados, login obrigatório, IA paga, sincronização em nuvem ou mensalidade obrigatória. **Não foi publicado automaticamente.**

## Começar sem experiência técnica

1. Leia [GUIA-INICIANTES.md](GUIA-INICIANTES.md).
2. No aplicativo publicado, abra **Integração ChatGPT**, selecione um planejamento JSON e revise a prévia.
3. Verifique o resultado em banco temporário, resolva os conflitos e confirme.
4. Abra **Calendário editorial**, selecione a visão e clique no conteúdo.
5. No Estúdio, siga as sete seções ou a Produção guiada. Salve para guardar alterações e progresso.
6. Produza no editor escolhido e publique manualmente na rede social.
7. Registre números em **Resultados** e exporte acompanhamento para o ChatGPT.

O usuário final utiliza uma URL HTTPS e pode instalar a PWA, sem Node.js local. A hospedagem compila o código. Nesta entrega ainda não existe URL publicada: consulte o [guia de publicação](GUIA-PUBLICACAO-SEM-NODE.md). Para instalar no Windows e iPad, consulte [GUIA-INSTALACAO-WINDOWS-IPAD.md](GUIA-INSTALACAO-WINDOWS-IPAD.md).

## Oito áreas

| Área | Uso |
| --- | --- |
| Painel inicial | Conteúdo do dia em America/Bahia, revisões vencidas e status de produção. |
| Calendário editorial | Diário, semanal, mensal, semestral e anual; domingo na primeira coluna; filtros de formato/status e conteúdos sem data. |
| Estúdio de produção | Estratégia, roteiro/cenas/slides, edição, legenda, materiais, checklist e publicação/resultados. |
| Biblioteca de materiais | Blobs locais, vínculos, substituição, remoção, download, quota e padrões visuais de referência. |
| Integração ChatGPT | Importação com prévia e conflitos; exportação JSON completo e resumo Markdown com seleção/privacidade. |
| Resultados | Registro manual e comparação por formato, tema e datas; indicadores com fórmulas explícitas. |
| Histórico | Alterações salvas e replanejamentos, inclusive revisão confirmada de publicados. |
| Configurações e backup | Exportação completa/editorial, restauração validada, proteção de armazenamento e busca de atualização. |

## Planejamento e produção

Datas civis são YYYY-MM-DD e horários HH:mm em **America/Bahia**. Datas não são convertidas a partir de UTC para marcar o calendário. A semana começa no domingo; semestre é janeiro–junho ou julho–dezembro. Horários sobrepostos ou iguais são destacados; vários conteúdos no mesmo dia são permitidos. Sem horário, nenhum horário é inventado. Intervalos finais anteriores ao início são rejeitados.

Para mover/replanejar, abra o conteúdo, altere data/horários e salve. Roteiro, manual, materiais, legenda e checklist permanecem juntos. Alteração em publicado exige confirmação; o histórico registra a revisão. Importar atualização permite manter, substituir ou duplicar com novo ID.

O manual armazena estratégia, textos exatos por cena/slide, segundos, dimensões, tipografia, composição, edição por etapas, áudio/narração opcional, capa e resultados. Campos não fornecidos ficam vazios e são sinalizados como pendências. Informações desconhecidas são preservadas para revisão. Não há geração automática de roteiros ou imagens.

Na Produção guiada, crie/ajuste etapas, tempo estimado e dificuldade; marque conclusão e avance. **Clique em Salvar conteúdo antes de sair.** Ao reabrir, a etapa atual e os checklists salvos são recuperados. Tempos são estimativas ajustáveis.

Os padrões visuais usam preto `#0D0D0D`, dourado `#C8A45D`, branco `#F5F5F5` e Montserrat distribuída localmente. Aplicar um padrão copia seus valores de referência para aquele conteúdo, sem alterar a biblioteca global nem sobrescrever as especificações individuais de cada cena/slide. A prévia de capa usa texto e uma imagem local opcional; não é uma arte final nem uma garantia de recorte na rede social. A fonte e a licença OFL são distribuídas com o projeto.

## Contrato e exemplos

Leia [CONTRATO-JSON.md](CONTRATO-JSON.md). JSON editorial v1 continua legível; v2 inclui metadados de período (ou `planning: null` quando não definidos) e o manual completo. Backups antigos v1/v2 continuam legíveis. Novos backups completos usam v3 com SHA-256.

Exemplos fictícios, parciais e editáveis (nenhum preenche automaticamente os dias vazios):

- [Diário](exemplos/v1.2.0/diario.json).
- [Semanal](exemplos/v1.2.0/semanal.json).
- [Mensal](exemplos/v1.2.0/mensal.json).
- [Semestral](exemplos/v1.2.0/semestral.json).
- [Anual](exemplos/v1.2.0/anual.json).

Cada um possui versões `.md` e `.txt` na mesma pasta. Nos textos, campos identificados são processados deterministicamente; os blocos JSON rotulados carregam manual/agenda/métricas/revisão completos. Não há interpretação por IA dentro do aplicativo.

## Resultados e revisão de mercado

Nove métricas são manuais: visualizações, alcance, curtidas, comentários, salvamentos, compartilhamentos, visitas ao perfil, novos seguidores e contatos recebidos. Vazio é desconhecido, não zero.

- Interações = curtidas + comentários + salvamentos + compartilhamentos, somente com os quatro números informados.
- Engajamento por alcance = interações ÷ alcance × 100, somente se alcance > 0.
- Contatos por visita = contatos ÷ visitas ao perfil × 100, somente se visitas > 0.
- O agregado usa soma das interações e soma dos alcances apenas dos conteúdos completos; a tabela mostra a quantidade de registros considerados.
- Denominador zero/ausente ou métrica necessária ausente resulta em “—”. Comparações não estabelecem causalidade.

Fonte, última verificação, próxima revisão, validade, observações e situação são registradas manualmente. Datas de revisão/validade anteriores a hoje em America/Bahia são destacadas. **Nenhuma pesquisa de mercado é feita automaticamente.** Não se presume que preço, taxa, financiamento ou condição comercial continue válido.

## ChatGPT: transferência manual e privacidade

Na área de integração, selecione período/publicações e escolha incluir pendências, resultados e observações. Baixe JSON e Markdown por botões separados, revise e anexe no ChatGPT usado separadamente. Nenhuma chamada à OpenAI é feita pelo aplicativo.

A exclusão de dados sensíveis limpa o campo específico `sensitive`; não identifica automaticamente informação pessoal escrita em outros campos. Revise também títulos, roteiros, legendas e observações. Datas de filtro vazias incluem conteúdos sem data; com filtro temporal, itens sem data não são incluídos. Sem seleção de publicações, são considerados todos os itens do filtro.

JSON serve para ida e volta do planejamento/manual; Markdown de exportação é um **resumo de acompanhamento**, não substitui backup completo. O arquivo editorial não contém Blobs: para transferir materiais e preservar seus vínculos em outro navegador, use backup completo.

## Backup, migrations e segurança

Cada navegador/perfil/origem possui seu próprio banco. Trocar domínio, protocolo ou porta não transfere dados. Faça backup e restaure manualmente no destino.

O backup completo inclui todos os conteúdos, campos de produção, progresso, métricas, histórico, configurações e arquivos base64. SHA-256 cobre o payload canônico; detecta alteração/corrupção, mas não é assinatura de autoria. Backups v1 sem checksum exigem aceite explícito; v2 é verificado no payload original antes de acrescentar os campos da 1.2.0.

Na restauração: selecione arquivo → prévia → mesclar/substituir → escolha conflitos → exporte segurança antes de substituir → valide em base temporária → confirme. A gravação final é atômica; falha ou alteração concorrente impede restauração parcial. Colisões de arquivos preservam os originais e remapeiam vínculos, inclusive o fundo da capa.

A migration v4 apenas acrescenta campos aos dados da base v1.1; versões antigas do schema foram mantidas. HTML/JavaScript importado não é executado. O armazenamento pode ser apagado por limpeza, quota ou falha; não é infalível. A validação temporária exige espaço extra. Faça cópias externas regularmente. Importação por arquivo é limitada a 200 MB; arquivos maiores que 50 MB exigem confirmação antes de entrar na biblioteca.

## Offline e atualização segura

O Service Worker armazena os arquivos essenciais, inclusive a Montserrat. Após o carregamento completo/ativação, agenda, Estúdio, biblioteca local, integração por arquivos, exportações, histórico e backups ficam disponíveis sem rede. Instagram, links remotos e o aplicativo externo de edição não são tornados offline pelo Planner.

A atualização exige sua ação. Edição/revisão em andamento, edição detectada em outra aba ou ausência de rede bloqueiam a ativação. “Salvar conteúdo e atualizar” aguarda o banco concluir a gravação. Antes da primeira troca de uma instalação antiga, salve e faça backup; código já instalado não pode ser corrigido retroativamente.

## Desenvolvimento e reprodução dos testes

Somente para manutenção/preview opcional: Node.js 22.18+ e pnpm compatível com `allowBuilds`.

```text
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test
node scripts/build-pwa-test.mjs
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm build` verifica TypeScript e gera `dist`. O script de homologação cria dois builds reais para testar atualização do PWA; o segundo fica em `../../work/pwa-next`, fora da entrega de produção. O servidor `e2e/static-server.mjs` é uma fixture de teste, não um backend de dados publicado. Mantenha a porta 4173 livre ou inicie essa fixture para a suíte.

Para usar Chrome já instalado no PowerShell: `$env:PLAYWRIGHT_CHANNEL='chrome'`, depois execute a suíte. Perfis de teste isolados ficam em `../../work`; não usam seu perfil pessoal. O teste de ida e volta fecha e reabre o navegador e possui prazo maior para permitir o encerramento real no Windows.

Opcionalmente, com Node instalado, `node servir.mjs` ou `INICIAR.cmd` serve o build local em `http://127.0.0.1:4173`. Essa opção não é necessária ao usuário da PWA publicada. Não abra `index.html` pelo explorador de arquivos. O servidor `dev` não habilita a instalação offline de produção.

## Entrega e limites da homologação

Consulte [CHANGELOG.md](CHANGELOG.md), [RELATORIO-TESTES-v1.2.0.md](RELATORIO-TESTES-v1.2.0.md) e [PENDENCIAS-REAIS.md](PENDENCIAS-REAIS.md). Só esses registros descrevem a aprovação da v1.2.0; relatórios da v1.1 são históricos. Instalação por ícone e dispositivos físicos precisam de testes reais, sem confundir emulação de largura com homologação de iPad/iPhone/Android. A publicação continua manual, após sua decisão.
