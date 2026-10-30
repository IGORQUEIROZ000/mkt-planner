# v1.2.0 — Edição Pessoal

Evolução sobre v1.1.0 corrigida; sem publicação automática, sem backend ou mudança para serviços remotos.

- Identidade preto/dourado/branco e Montserrat local com licença; oito áreas responsivas.
- Painel com conteúdos de hoje em America/Bahia e revisões vencidas.
- Calendário diário/semanal/mensal/semestral/anual, domingo na primeira coluna, datas civis, horários/intervalos, conteúdos sem data, filtros e conflitos.
- Estúdio com sete seções e manual estruturado: estratégia, segundos/textos/cenas/slides, instruções de edição, tipografia/composição, capa, áudio/narração opcional, materiais, checklists e resultados.
- Produção guiada com tarefas, estimativa ajustável, dificuldade, conclusão e posição de retomada salvas.
- Padrões visuais reutilizáveis copiados por conteúdo; prévia de capa de referência com imagem local opcional, sem geração de imagem final.
- Integração ChatGPT por arquivos: JSON editorial v2, Markdown/TXT estruturados, prévia editável, conflitos e exportação JSON/resumo Markdown com filtros e exclusões explícitas.
- Exemplos completos e fictícios dos cinco períodos em três formatos, incluindo Reels, carrosséis, Stories e posts.
- Nove métricas manuais, indicadores documentados, comparação por formato/tema/período e tratamento de vazio/zero.
- Fonte/validação/revisão/validade de informações comerciais registradas manualmente, sem pesquisa automática.
- Histórico das alterações salvas, replanejamento e confirmação de revisão de publicados; substituição importada preserva histórico local.
- Migration aditiva v4, preservando a base v1.1 e seus Blobs. Backups novos v3; leitura dos antigos v1/v2 com verificação SHA-256 no payload original antes de normalizar os campos novos.
- Colisões de materiais também remapeiam o fundo da capa; exclusão limpa vínculos do conteúdo.
- Proteções da v1.1 mantidas: pré-validação isolada, commit atômico, detecção de alteração concorrente, segurança antes de substituição e atualização de PWA mediante ação do usuário.

Os novos módulos de UI extraem o editor e o calendário para ampliar a base existente; banco, materiais, contratos legados e infraestrutura de testes foram mantidos. Os novos campos vazios não são preenchidos como instruções supostamente recebidas. Biblioteca visual e exemplos são referências explícitas que o usuário decide aplicar.

O histórico das correções da 1.1 está em [CHANGELOG-CORRECOES.md](CHANGELOG-CORRECOES.md). A aprovação desta versão depende exclusivamente do [relatório 1.2.0](RELATORIO-TESTES-v1.2.0.md).
