# Relatório de testes — MKT Planner v1.2.0

Data: 29/10/2026. Evolução da base corrigida v1.1.0. Não houve publicação. O escopo aprovado é a execução automatizada local; instalação por ícone e dispositivos físicos permanecem pendentes.

## Ambiente e comandos efetivamente executados

Windows, Node.js 24.22.1, pnpm 11.25.0, navegador Chrome instalado controlado por Playwright, perfis isolados. Dados pessoais do navegador não foram usados.

| Verificação | Execução e resultado |
|---|---|
| Dependências | Instalação concluída, lockfile conferido; Montserrat 5.3.0 acrescentada e distribuída localmente |
| TypeScript | `tsc -b` concluído com código 0 |
| Produção | `node scripts/build-pwa-test.mjs`: produção 1.2.0 e build de atualização concluídos com código 0 |
| Vitest / RTL | `pnpm test`: 5 arquivos, 52 testes aprovados, código 0 |
| Playwright | Resultado final registrado em evidencias/playwright-v120.json e abaixo |
| Segurança | Auditoria: 0 críticas, 0 altas, 0 moderadas, 1 baixa; auditoria retorna código 1 pelo aviso baixo |
| Documentação e pacote | Links locais, arquivos obrigatórios, configuração de hospedagem, fonte local e CRC do ZIP conferidos pelo empacotador |

## Cobertura automatizada

- Quinze arquivos de exemplo: cinco períodos, cada um em JSON, Markdown e TXT, com manual estruturado.
- Todos os campos do manual e o progresso preservados em ida e volta por exportação/importação; comparação integral de registros após reabrir o banco.
- Fluxo real em Chrome: planejamento anual → calendário → sete seções → edição de capa → etapa guiada/checklist → nove métricas → JSON → outro perfil → encerrar/reabrir navegador → igualdade integral dos conteúdos e retomada da etapa.
- JSON editorial v1/v2; backup antigo v2 com checksum original antes dos defaults; backup completo v3; migrations com roteiro e Blob preservados.
- Backup e restauração com anexos, integridade SHA-256, base64/tamanho/vínculos inválidos, incompatibilidade de versão, corrupção, ensaio temporário e rollback controlado.
- Conflitos individuais manter/substituir/duplicar, prevenção de duplicação, colisão de materiais e alterações concorrentes.
- Datas civis, Bahia próximo à virada UTC, ano bissexto, viradas de mês/ano, domingo, cinco períodos, intervalos, revisão vencida, replanejamento de publicado com confirmação.
- Métricas com campos ausentes e denominador zero, filtros e exclusão do campo sensível dedicado.
- PWA com dois builds reais: aviso de versão, bloqueio durante edição, outra aba e offline, salvar antes de ativar, dados legados migrados e nova versão reaberta offline.
- Layouts de 390 e 1024 px sem transbordamento horizontal; oito áreas, fonte Montserrat local carregada; nenhuma requisição remota de aplicação durante o cenário verificado.
- Inspeção de código sem eval, new Function, dangerouslySetInnerHTML, fetch ou XMLHttpRequest em src. Texto importado é renderizado como texto, não HTML executável.

## Advertências e limites

A compilação avisa sobre comentários PURE da dependência Zod e chunk JavaScript de aproximadamente 504 kB; concluiu normalmente. O precache contém 16 arquivos essenciais, incluindo as fontes. A auditoria baixa de deepmerge na cadeia de build não possui correção compatível indicada pelo retorno; não foi ocultada. Consulte [PENDENCIAS-REAIS.md](PENDENCIAS-REAIS.md).

Não foram executados deploy real, instalação pelo sistema, testes em iPad/iPhone/Android físico, esgotamento de quota física nem backup de 200 MB com vídeos reais. Não há homologação definitiva desses cenários. A largura emulada de iPad não comprova Safari/iPadOS.

A primeira execução de navegador teve 7 aprovados e 1 falha de seletor da automação. O seletor foi corrigido; o cenário isolado passou com fechamento e reabertura reais (2,7 minutos). O resultado agregado final é informado separadamente para não apresentar a primeira execução como aprovada.

## Resultado agregado final

**Aprovados: 8 de 8 testes Playwright, 0 falhas, 0 instáveis e 0 ignorados**, execução final de 4,1 minutos, código de saída 0. O cenário completo de exportação/importação/reabertura passou em 2,2 minutos; persistência após encerrar/reabrir em 1,1 minuto; atualização PWA em 13,8 segundos. O reporter JSON integral está em [evidencias/playwright-v120.json](evidencias/playwright-v120.json).

A versão está aprovada nos testes automatizados executados, sem falha crítica conhecida nesses cenários. Permanecem o aviso baixo de dependência e os limites de homologação descritos acima. O projeto não foi publicado.

Evidências adicionais: [verificações](evidencias/verificacoes-v120.json), [auditoria](evidencias/auditoria-dependencias-v120.json) e capturas em `evidencias/telas/`. O ZIP é acompanhado por SHA-256 externo e passa por conferência CRC e presença dos arquivos obrigatórios.
