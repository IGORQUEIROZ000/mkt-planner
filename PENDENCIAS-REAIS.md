# Pendências reais — 1.2.0

## 1. Aviso baixo na cadeia de build

A auditoria registrou um aviso de severidade **baixa** em `deepmerge@4.3.1`, transitivo de `vite-plugin-pwa → workbox-build → @rollup/plugin-node-resolve`. [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). O retorno da auditoria não indica versão corrigida. É uma dependência de desenvolvimento/build, não uma dependência executada pelo aplicativo estático no navegador.

Os alertas críticos, altos e moderados encontrados anteriormente foram corrigidos atualizando Vitest e Zod. O resultado integral atual está em `evidencias/auditoria-dependencias.json`. Não é declarado “zero vulnerabilidades”: permanece este aviso baixo. Reavaliar a cadeia Workbox/Rollup quando houver correção compatível e repetir build/testes/auditoria antes de publicar.

## 2. Instalação e dispositivos físicos

Não foi concluída instalação pelo menu/ícone do sistema em computador, iPad, iPhone ou Android físico. Foram realizados testes automatizados em Chrome no Windows, incluindo persistência após encerrar/reabrir, Service Worker, atualização entre builds e recarga offline. A emulação de largura de celular não homologa Safari/iOS ou Android real.

Para concluir: acessar a URL HTTPS definitiva, instalar pela opção do navegador/Safari, criar e salvar um conteúdo, fechar e abrir pelo ícone, desligar a rede, editar e salvar, exportar backup e restaurar em outro navegador. Registrar dispositivo, versão do sistema/navegador e resultado.

## 3. Publicação e URL definitiva

Não foi publicado site, criado projeto Vercel ou alterado repositório remoto. Isso atende à instrução de não publicar ainda. Os arquivos e o guia estão preparados para compilação pelo serviço. A execução real de Vercel/GitHub Actions, o comportamento de cache da hospedagem e a instalação pelo endereço definitivo ainda precisam ser verificados quando a publicação for autorizada.

## 4. Limites reais de armazenamento e recursos

Falhas de escrita e rollback foram testados de forma controlada. Não foi esgotada a quota física de diferentes dispositivos nem testado um backup de 200 MB com vídeos reais. O ensaio usa uma base temporária e precisa de espaço extra; em falta de espaço, deve falhar preservando o original. Memória, quota e retenção do IndexedDB dependem do navegador. Manter backup fora do navegador e testar o volume real de materiais no dispositivo pretendido.

## 5. Backup legado e primeira transição

Backups antigos v1 não contêm checksum; sua integridade original não pode ser comprovada retroativamente. São aceitos somente com aviso e revisão, além da validação de estrutura/tamanho/vínculos e do ensaio temporário. Exporte um novo backup v3 após conferir a restauração.

A versão antiga já instalada pode conter a política automática anterior. Antes da primeira publicação desta correção sobre uma instalação antiga, salve, faça backup e feche as abas antigas. As proteções de atualização desta entrega passam a atuar quando o código corrigido estiver carregado. Não é prometida segurança retroativa para código antigo ou migrations futuras ainda inexistentes.


## 6. Avisos de compilação e cobertura

O build v1.2.0 emite avisos de comentários PURE da dependência Zod e de um chunk JavaScript de aproximadamente 504 kB minificado. A compilação conclui, mas a divisão futura do bundle pode reduzir o carregamento inicial. Não foi alegado teste de todas as combinações possíveis de dispositivos, arquivos ou anos históricos extremos. Os testes de calendário cobrem datas civis, bissextos, viradas, domingo e os cinco períodos com exemplos de 2026.

A exclusão de dados sensíveis na exportação limpa somente o campo dedicado. Não existe detecção automática de informação pessoal em texto livre; revisar o arquivo antes de compartilhar.
