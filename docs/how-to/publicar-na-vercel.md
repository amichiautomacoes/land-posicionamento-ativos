---
type: how-to
status: Accepted
date: 2026-11-05
language: pt-BR
---

# Publicar a landing na Vercel

A Vercel gera e publica somente a saída estática de [`scripts/build_static.py`](../../scripts/build_static.py). Python, Flask e Jinja são ferramentas de build e desenvolvimento local; o site publicado não precisa de servidor Python.

## Importar o repositório e configurar os contatos

1. Envie ao seu repositório Git as alterações do projeto, incluindo os arquivos novos em `app/static/`, os templates, `scripts/build_static.py`, `requirements/base.txt` e `vercel.json`. Não envie `.env`, `.venv`, matrizes de design ou `dist/`.
2. Na Vercel, selecione **Add New → Project** e importe o repositório.
3. Mantenha **Root Directory** na raiz do repositório (`.`) e confira **Framework Preset: Other**. As demais opções vêm de [`vercel.json`](../../vercel.json):

   | Campo | Valor |
   |---|---|
   | Install Command | `python3 -m venv .venv && .venv/bin/python -m pip install -r requirements/base.txt` |
   | Build Command | `.venv/bin/python scripts/build_static.py` |
   | Output Directory | `dist` |

4. Os três contatos já usam **+55 (31) 98383-3762**. Para substituir, adicione `WHATSAPP_NUMBER` em **Environment Variables** para Production e Preview, com DDI e DDD, somente dígitos. Se essa variável não existir, o número padrão será usado; um valor vazio desativa os contatos. O número faz parte dos links públicos de WhatsApp.
5. Clique em **Deploy**. O build instala as dependências Python em um ambiente virtual, resolve os templates e gera `dist/index.html`, `dist/robots.txt` e `dist/static/`. Apenas `dist/` será publicado.
6. Abra a URL retornada e confira navegação, imagens, vídeos e os três contatos. Em **Settings → Domains**, associe seu domínio e aplique no DNS os registros indicados pela Vercel.

[`vercel.json`](../../vercel.json) segue as opções oficiais de [configuração por arquivo](https://vercel.com/docs/project-configuration/vercel-json). A [imagem de build da Vercel](https://vercel.com/docs/builds/build-image) fornece Python para executar a instalação e o exportador. O projeto não usa Docker, Waitress ou Functions para servir a landing.

## Conferir a versão estática antes de publicar

Com o ambiente local instalado conforme o [README](../../README.md), execute:

```powershell
.\.venv\Scripts\python.exe scripts/build_static.py
.\.venv\Scripts\python.exe -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abra `http://127.0.0.1:4173/`. O diretório servido precisa ser `dist`, pois a raiz do repositório contém código e documentação. Em macOS/Linux, use `.venv/bin/python`.

Em outro terminal, rode as verificações:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests/integration -v
node --test tests/unit/execution-context.test.mjs
node scripts/qa/run-browser-tests.mjs --url http://127.0.0.1:4173/ --out reports/qa/vercel-static
```

O QA de navegador exige as ferramentas locais descritas no README; elas não participam do build na Vercel. Encerre a prévia com `Ctrl+C`.

## Atualizar conteúdo, telefone e indexação

Commits enviados para a branch de produção conectada acionam novos deploys. Mudanças nas variáveis de ambiente exigem **Redeploy**, pois telefone e diretivas de indexação ficam gravados no HTML gerado.

Em produção, o exportador gera `index, follow` e `robots.txt` com `Allow: /`. Em Preview e Development, usa `noindex, nofollow` e `Disallow: /`, conforme `VERCEL_ENV`. Mantenha habilitada a exposição das variáveis de sistema da Vercel para o build. Fora da Vercel, o exportador assume produção; defina `VERCEL_ENV=preview` para testar uma prévia sem indexação. O Flask local continua sem indexação.

## Corrigir uma falha de deploy ou recuperar uma versão

Se o build falhar, consulte **Deployments → deployment → Build Logs**. Confira a raiz do projeto, os arquivos versionados, a instalação de `requirements/base.txt` e os caminhos de mídia apontados pelos templates. Após corrigir e enviar um commit, acompanhe o novo deployment.

Se os contatos estiverem desativados, confira se `WHATSAPP_NUMBER` está vazio no ambiente do deployment. Remova a variável para usar o número padrão ou informe o número desejado e execute **Redeploy**. Se a página carregar sem estilos ou imagens, confirme `Output Directory: dist` e os arquivos versionados em `app/static/`.

Para recuperar uma publicação anterior, selecione um deployment de produção que funcionava e use a opção de rollback disponível no painel. O procedimento da plataforma está na [documentação de Instant Rollback](https://vercel.com/docs/instant-rollback). Valide a URL de produção após a troca.
