# Correções 1.1.0

Trabalho realizado sobre o projeto existente. Identidade visual, calendário de domingo, estúdio, resultados, histórico, materiais locais, IndexedDB/Dexie, PWA e arquitetura estática foram preservados. Nenhuma publicação foi feita.

## C01 — Atualização segura

- `registerType` alterado de `autoUpdate` para `prompt`, sem skipWaiting automático.
- Aviso de nova versão, busca manual e bloqueios para edição/revisão, offline e edição detectada em outras abas via BroadcastChannel.
- Ação de salvar e atualizar só envia a ativação depois da gravação concluída.
- Callback de recarga também protege alterações se outra aba ativar uma versão.
- Migration aditiva v3 mantém a base existente e acrescenta cenas, informações para revisão, IDs de materiais e revisão dos anexos.

## C02 — Backup e restauração

- Backup v2 com SHA-256 da representação JSON canônica de todo o payload, inclusive anexos base64.
- Validação de versão, schema, IDs únicos, tamanho dos anexos e vínculos.
- Ensaio completo em IndexedDB temporário, com releitura e comparação dos registros/bytes.
- Commit único e atômico para conteúdos, materiais e configurações, com detecção de alterações concorrentes desde a prévia.
- Oferta de exportação de segurança, escolha explícita e confirmação antes de substituição.
- Backup legado v1 continua legível com aviso e aceite de ausência de checksum; não é rotulado como integridade SHA-256 verificada.

## C03 — Importação

- JSON editorial v1 mantido e validado com Zod.
- Parser determinístico para Markdown/TXT com título, data ISO ou DD/MM/AAAA, formato, roteiro, cenas, edição, legenda, hashtags e checklist.
- Campos ausentes não são deduzidos. Formato ausente aparece como Não informado; título ausente exige revisão antes de gravar.
- Informações desconhecidas são preservadas para revisão. A prévia permite editar os campos reconhecidos e os vínculos antes da validação temporária.
- Exemplos completos dos quatro formatos em JSON, Markdown e TXT.

## C04 — Mesclagem

- Conflitos por ID e conteúdo idêntico são apresentados individualmente.
- Decisões manter/substituir/duplicar. Duplicação explícita gera novo ID.
- Reimportação idêntica não cria cópias por padrão. Colisões de anexos são remapeadas; os vínculos do conteúdo importado acompanham o novo ID, preservando os originais.
- Exclusão de material remove seus vínculos na mesma transação. Esta alteração é necessária para não deixar referências quebradas, dentro do escopo C04.

## C05 — Publicação estática

- `vercel.json` configura instalação/build no serviço e saída `dist`.
- GitHub Pages mantido com workflow manual, sem publicar a cada push.
- Guia para subir o código pelo navegador e publicar sem Node.js local. Node permanece apenas como opção de desenvolvimento/preview, não como requisito do usuário final.
- Documentação explícita do banco independente por navegador/perfil/origem e da transferência por backup.

## Escopo de segurança

A auditoria exigiu atualizar Zod 3.25.76 para 4.6.7 e Vitest 3.2.7 para 4.1.12. As versões anteriores apresentavam vulnerabilidades alta/críticas na validação e na cadeia de testes. O contrato JSON foi preservado e os testes foram repetidos. Referências: [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [Tinypool](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) e [Vitest](https://github.com/advisories/GHSA-qxg6-89mg-rqv8). A prévia também bloqueia edição durante sua validação/gravação para impedir divergência entre o que foi revisado e o resultado validado.

Texto continua sendo renderizado pelo React, sem execução de HTML/JavaScript importado. SHA-256 detecta alterações/corrupção, mas não é assinatura digital nem prova de autoria: quem editar um arquivo pode recalcular seu hash. Os testes simulam falhas de escrita para verificar rollback; não prometem que todo dispositivo terá espaço suficiente ou armazenamento permanente.
