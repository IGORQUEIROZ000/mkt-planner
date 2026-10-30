# Contrato de intercâmbio — v1.2.0

O contrato executável é validado por Zod em `src/core.ts` e `src/personal-model.ts`. Não há chamada à API do ChatGPT. Use os arquivos completos de [exemplos](exemplos/v1.2.0/anual.json) como modelo.

## JSON editorial

A raiz contém `kind: "mkt-editorial"`, `version: 2`, `planning` e `contents`. `planning` pode ser `null` quando nenhum período foi informado; caso contrário contém `period` (Diário, Semanal, Mensal, Semestral ou Anual), `start`, `end` e `timeZone: "America/Bahia"`. Datas são strings civis `AAAA-MM-DD`; vazio significa não informado. A versão editorial 1 continua aceita. Versões desconhecidas são rejeitadas antes da escrita.

Cada conteúdo contém:

| Campo | Tipo e finalidade |
|---|---|
| id, title | Strings não vazias; título até 300 caracteres; IDs únicos no arquivo |
| date | Data civil ou vazio, sem conversão UTC |
| format | Não informado, Stories, Reels, Carrossel, Imóvel ou Post |
| status | Ideia, Em produção, Pronto ou Publicado |
| script, scenes, editing | Texto legado preservado |
| caption, hashtags | Texto pronto para copiar |
| checklist | Lista `{text, done}` |
| results | Anotações de resultado em texto |
| history | Lista com at ISO, status e reason/before/after opcionais |
| unknown | Informações não reconhecidas para revisão |
| materialIds | IDs dos materiais vinculados |
| manual | Manual estruturado abaixo |
| schedule | time, endDate, endTime; horários HH:mm ou vazio |
| metrics | Nove contadores inteiros não negativos ou null |
| market | Revisão manual de informação de mercado |
| notes, sensitive | Observações e campo separado de informação sensível |

Campos pessoais ausentes em dados antigos recebem campos vazios, listas vazias e contadores null. Isso não cria instruções nem resultados. Um zero digitado é diferente de um resultado não informado.

## Manual completo

| Objeto | Propriedades |
|---|---|
| strategy | theme, objective, audience, hook, development, ending, cta, durationSeconds |
| frames[] | id, number, startSeconds, endSeconds, objective, text, materials, dimensions, background, font, weight, fontSize, color, alignment, position, margins, visuals, assembly, hierarchy |
| edit | app, steps[], effects, transitions, audio, music, narration, coverNotes |
| cover | phrase, backgroundMaterialId, font, weight, fontSize, color, position, margins, graphics |
| guided | estimatedMinutes, difficulty, materials, currentStep, steps[] |
| visual | presetId, background, textColor, accentColor, font, weight, fontSize, position, margins, dimensions |

Tarefas `steps[]` contêm id, text e done. `difficulty` aceita Não informado, Fácil, Intermediário ou Avançado. Tempos e duração aceitam número finito não negativo ou null. Fim de cena não pode preceder início. `currentStep` é um índice inteiro a partir de zero. A capa é referência de montagem, não um gerador de imagens.

`metrics`: views, reach, likes, comments, saves, shares, profileVisits, followers, contacts. `market`: source, verifiedOn, nextReview, expiresOn, notes, status (Não verificado, Confirmado manualmente ou Revisar). Todas as datas de revisão são civis ou vazias.

## Markdown e TXT determinísticos

Use um título por conteúdo e rótulos como Título, Data, Formato, Roteiro, Cenas, Edição, Legenda, Hashtags e Checklist. Os exemplos incluem blocos JSON nomeados **Manual de produção**, **Resultados estruturados**, **Revisão de mercado** e **Agenda**, validados com os mesmos schemas. Assim preservam a estrutura completa sem inferência por linguagem natural. O texto desconhecido fica em `unknown` para revisão; campos ausentes ficam pendentes. Confira a prévia editável antes de confirmar.

O resumo Markdown gerado para análise é uma síntese. Para ida e volta de todos os campos, exporte o JSON; para anexos e configurações, use backup completo.

## Conflitos, anexos e privacidade

A prévia identifica registros existentes e permite manter, substituir ou duplicar individualmente. Duplicação remapeia IDs e vínculos. Substituição exige revisão e preserva histórico local; publicação concluída recebe confirmação. A importação ensaia o resultado em IndexedDB temporário e confirma em transação atômica com detecção de alterações concorrentes.

JSON editorial referencia materiais, mas não transporta seus bytes. Use backup completo quando houver anexos. Referências inexistentes são rejeitadas. Na exportação ChatGPT, o controle de dados sensíveis remove o campo dedicado `sensitive`; revise também legenda, notas, cenas e demais campos antes de compartilhar.

## Backup

Novos backups usam `kind: "mkt-backup"`, `version: 3`, exportedAt, contents, settings, materials e integrity. Cada material contém id, name, type, size e data base64. `integrity` contém algorithm SHA-256 e digest hexadecimal de 64 caracteres. O hash cobre o JSON canônico da raiz sem integrity (chaves ordenadas, arrays na ordem original). A versão 2 permanece aceita; seu hash é conferido sobre o payload original, antes de acrescentar defaults. A versão 1 não tem checksum e exige aviso de integridade não verificável. SHA-256 detecta alterações, não autentica a origem do arquivo.

Validação inclui versão, estrutura, IDs, datas, base64, tamanho e vínculos. A restauração permite backup de segurança e ensaio temporário antes da substituição atômica. A migration IndexedDB v4 acrescenta campos, preservando registros e Blob anteriores.

## Exemplos completos e fictícios

- [Diário](exemplos/v1.2.0/diario.json)
- [Semanal](exemplos/v1.2.0/semanal.json)
- [Mensal](exemplos/v1.2.0/mensal.json)
- [Semestral](exemplos/v1.2.0/semestral.json)
- [Anual](exemplos/v1.2.0/anual.json)

Cada JSON possui equivalentes `.md` e `.txt` na mesma pasta. Planejamentos parciais são válidos; dias vazios não geram conteúdos. Consulte o README para as fórmulas de resultados e os limites de armazenamento.
