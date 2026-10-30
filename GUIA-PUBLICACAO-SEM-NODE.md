# Publicar pelo navegador, sem instalar Node.js

Este guia prepara uma publicação futura. **Nada foi publicado nesta entrega.** O usuário final não precisa de terminal, Node.js, pnpm ou servidor próprio. As ferramentas de build rodam no GitHub/Vercel; depois basta acessar a URL HTTPS e instalar a PWA pelo navegador.

## Antes de começar

1. Extraia o ZIP. A pasta `mkt-planner` contém o projeto.
2. Se já usa o aplicativo em outra URL, exporte um backup completo e confirme o arquivo salvo. Cada navegador, perfil e origem (protocolo + domínio + porta) tem seu próprio IndexedDB. Os dados não são enviados ao GitHub ou à Vercel, nem transferidos automaticamente para outro endereço.
3. Use uma conta GitHub e, para a primeira alternativa abaixo, uma conta Vercel. Verifique se o plano gratuito atende ao seu tipo de uso e aos termos do provedor. Não é necessário contratar serviços para o aplicativo funcionar.

## Colocar o código no GitHub pela interface web

1. Entre no GitHub e crie um repositório novo, por exemplo `mkt-planner`.
2. Escolha **Add file → Upload files**.
3. Envie o conteúdo de dentro de `mkt-planner`, preservando as pastas. O arquivo `package.json` deve aparecer na raiz do repositório, ao lado de `pnpm-lock.yaml`, `vite.config.ts` e `vercel.json`.
4. Inclua `src`, `public`, `scripts`, `tests`, `e2e`, `exemplos`, os documentos e `.github/workflows/pages.yml`. No Windows, habilite a visualização de itens ocultos para encontrar `.github` e `.gitignore`. Se a pasta oculta não for enviada, crie o arquivo diretamente com **Add file → Create new file** e o nome `.github/workflows/pages.yml`, copiando o texto fornecido.
5. Não envie `node_modules`, `test-results`, perfis de navegador, backups pessoais nem arquivos da pasta de trabalho temporária. `dist` não é necessário no repositório: será recompilado pelo serviço.
6. Confirme o envio (**Commit changes**). O workflow Pages fornecido é manual; o envio do código, sozinho, não publica o GitHub Pages.

Se o GitHub limitar o envio de uma pasta, envie os grupos em etapas. Não envie somente o ZIP: o serviço precisa dos arquivos extraídos para compilar.

## Alternativa opcional: GitHub + Vercel

1. Quando decidir publicar, entre na Vercel e escolha **Add New → Project**.
2. Conecte sua conta GitHub e selecione apenas o repositório necessário.
3. Confira **Root Directory**: a pasta que contém `package.json` (raiz se seguiu o guia).
4. Confira o framework **Vite**. A configuração `vercel.json` define:
   - Install Command: `pnpm install --frozen-lockfile`.
   - Build Command: `pnpm build`.
   - Output Directory: `dist`.
5. Escolha Node.js 22.18 ou superior entre as versões suportadas no painel, se for necessário configurar a versão. Isso é a versão usada na hospedagem, não uma instalação no seu computador.
6. Não cadastre banco, login, variáveis secretas ou integrações. O projeto é estático.
7. **Deploy** é o passo que efetivamente publica. Só clique quando quiser disponibilizar o aplicativo.
8. Aguarde o build e abra a URL HTTPS retornada. Se houver erro, leia o log; não altere o comando para ignorar TypeScript.

A Vercel normalmente gera novos deploys quando o repositório conectado recebe commits. Antes de atualizar uma instalação em uso, faça backup e salve/feche a edição. Nesta entrega não foi criado projeto Vercel nem conexão com repositório.

## Publicação principal: GitHub Pages

1. No repositório, abra **Settings → Pages** e selecione **GitHub Actions** como fonte.
2. Abra **Actions → Publicar MKT Planner → Run workflow** e escolha a branch que contém o projeto. Esta é a ação manual que inicia a publicação.
3. O GitHub instala as dependências, executa os testes Vitest, verifica TypeScript, gera o build e publica apenas `dist`.
4. Ao terminar, abra a URL exibida na execução/Settings → Pages. O `base: './'` suporta o subdiretório do repositório.
5. Para atualizações futuras, envie os arquivos corrigidos e execute novamente o workflow. Não há gatilho automático de push no workflow entregue.

O workflow de publicação não executa Playwright por padrão; a suíte de navegador tem procedimento próprio de homologação no README. Não interprete uma publicação concluída como homologação de dispositivos físicos.

## Instalar e verificar depois de publicado

1. Abra a URL HTTPS e aguarde o carregamento completo.
2. Chrome/Edge no computador e Android: use **Instalar aplicativo** ou o menu do navegador.
3. iPad/iPhone no Safari: **Compartilhar → Adicionar à Tela de Início**.
4. Crie um conteúdo de teste, salve e feche. Abra novamente pelo ícone e confira o conteúdo.
5. Desligue a rede e reabra. Confira o indicador Offline, calendário, edição, materiais locais e exportação de backup.
6. Faça um backup, guarde o arquivo e restaure em outro navegador pela prévia/validação temporária. Importar o backup é a transferência manual entre dispositivos; não existe sincronização em nuvem.

## Atualizações e mudança de endereço

O aplicativo corrigido avisa quando existe nova versão e bloqueia a ativação durante edição/revisão, sem rede ou com edição detectada em outra aba. Use **Salvar conteúdo e atualizar** ou termine sua revisão antes de **Atualizar agora**. Nenhum upgrade apaga o IndexedDB deliberadamente; migrations acrescentam os campos novos.

**Primeira transição de uma versão antiga:** código já instalado não pode ser corrigido retroativamente. Antes de disponibilizar esta correção sobre uma instalação antiga, salve tudo, exporte backup e feche as abas antigas. Reabra no mesmo endereço após disponibilizar a versão corrigida. Para uma versão futura do banco que exija mudanças incompatíveis, será necessário criar e testar nova migration; não remova versões anteriores do schema.

Mudar de domínio, de HTTP para HTTPS ou de porta cria outra origem. O banco anterior continua associado à origem anterior. Faça backup antes da mudança e restaure na nova URL.

## Referências oficiais consultadas

- [Builds e configuração da Vercel](https://vercel.com/docs/builds/configure-a-build).
- [Integração Git da Vercel](https://vercel.com/docs/git).
- [Fonte de publicação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
- [Publicação estática com Vite](https://vite.dev/guide/static-deploy).

