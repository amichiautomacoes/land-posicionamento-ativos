# Ativos Negócios Locais

Landing estática preparada para publicação na Vercel. Flask e Jinja montam o HTML durante o build e atendem ao desenvolvimento local. Em produção, a Vercel serve somente `dist/`, com HTML, CSS, módulos JavaScript nativos e mídia.

## Publicar na Vercel

Importe o repositório na Vercel e mantenha **Root Directory** na raiz (`.`). O `vercel.json` configura **Framework Preset: Other**, instalação das dependências de build, geração da página e **Output Directory: dist**.

Os três CTAs usam o WhatsApp **+55 (31) 98383-3762** por padrão, inclusive na Vercel. Para substituir o número, configure `WHATSAPP_NUMBER` em **Settings → Environment Variables** para Production e Preview, com DDI e DDD, somente dígitos. Um valor vazio desativa os contatos. O número será público nos links de WhatsApp gerados.

O deploy usa o código versionado: inclua no commit todos os templates, scripts e arquivos de `app/static/` necessários à página. `dist/` é gerado na Vercel e fica fora do Git. Alterações no telefone exigem um novo deploy.

O [guia de publicação](docs/how-to/publicar-na-vercel.md) detalha configuração, verificação e recuperação de versões. A Vercel substitui o EasyPanel como destino de produção.

## Instalar

Python 3.12 para a aplicação. Node 22+, Chrome, Edge ou Chromium e a skill local `design-taste-frontend` para QA de navegador e preparação de mídia.

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements/development.txt
```

| Arquivo | Finalidade |
|---|---|
| `requirements/base.txt` | Flask e python-dotenv |
| `requirements/development.txt` | Ambiente local; inclui a base |

Os testes HTTP usam `unittest`; os testes de execução usam `node:test`. Ambos vêm com seus runtimes. O navegador usa o cliente da skill em `.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs`, com origem em `skills-lock.json`, sem instalação npm. `CHROME_PATH` pode indicar o executável do navegador.

Copie `.env.example` para `.env` quando precisar de configuração local. `PORT` define a porta, com padrão em `app/config.py`. `WHATSAPP_NUMBER` permite substituir o WhatsApp dos três controles de contato: hero, FAQ e contato final.

## Iniciar e encerrar

```powershell
.\scripts\dev\start.ps1
.\scripts\dev\stop.ps1
```

`start.ps1 -NoBrowser` inicia sem abrir a página. Logs e PID ficam em `runtime/`. Em primeiro plano:

```powershell
.\.venv\Scripts\python.exe run.py
```

Os comandos resolvem os caminhos pela localização do projeto. Podem ser chamados de outra pasta usando seu caminho absoluto.

## Executar verificações

Todos os cenários de navegador:

```powershell
.\scripts\qa\run-browser-tests.ps1
```

O comando inicia ou reutiliza o servidor configurado. Com `-Url`, `LANDING_BASE_URL` ou `-NoStart`, usa um servidor já ativo. É possível selecionar suítes e o destino das evidências:

```powershell
.\scripts\qa\run-browser-tests.ps1 -Url http://127.0.0.1:5641/ -Suite faq,typography-reflow -OutputDirectory reports/qa/current/browser
```

O executor Node exige o servidor ativo:

```powershell
node scripts/qa/run-browser-tests.mjs --url http://127.0.0.1:5641/
node scripts/qa/run-browser-tests.mjs --list
```

São nove suítes: `landing`, `interactions`, `card-stack`, `horizontal-journey`, `benefits-flow`, `process-rail`, `faq`, `section-transitions` e `typography-reflow`. Elas são executadas em sequência; qualquer falha resulta em código de saída `1`. O executor registra os erros e continua nas suítes seguintes, sem repetição automática. Cada suíte tem limite de três minutos.

O destino padrão é `reports/qa/browser-suite/`, com `results.json` consolidado, evidências e logs por suíte. Os estados são `preflight`, `running`, `passed`, `failed` e `preflight-failed`. Os arquivos de QA são gerados e podem ser recriados pelos comandos.

Testes HTTP e contratos de execução:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests/integration -v
node --test tests/unit/execution-context.test.mjs
```

Uma suíte individual e a inspeção visual:

```powershell
node tests/browser/faq.mjs --url http://127.0.0.1:5641/ --out reports/qa/current/faq
.\scripts\qa\inspect.ps1 -Url http://127.0.0.1:5641/ -OutputDirectory reports/qa/current/inspect
```

## Configuração de URL e caminhos

A precedência da URL é `--url`, variável de processo `LANDING_BASE_URL` e porta lida de `app/config.py` pelo Python de `.venv`. A configuração Python lê `PORT` do ambiente ou de `.env`. Uma URL explícita dispensa consultar o Python local.

Use somente opções nomeadas: `--url URL`, `--out PASTA` e, no executor, `--suite NOME,...`. Saídas relativas partem da raiz do projeto e precisam ficar dentro dela. Os auxiliares ficam em `scripts/lib/project-paths.mjs` e `scripts/lib/execution-context.mjs`.

`LANDING_BASE_URL` seleciona o alvo do QA e do preparo de vídeo. `start.ps1` e `stop.ps1` administram o servidor local baseado em `PORT`.

## Preparar mídias

Os comandos usam as matrizes atuais em `design/originals/` e sobrescrevem suas exportações em `app/static/`:

```powershell
node scripts/media/prepare-brand-logo.mjs
node scripts/media/prepare-channel-logos.mjs
node scripts/media/prepare-service-images.mjs
node scripts/media/prepare-benefit-images.mjs
node scripts/media/prepare-benefit-expanded-images.mjs
node scripts/media/prepare-productivity-image.mjs
node scripts/media/prepare-hero-media.mjs --url http://127.0.0.1:5641/
```

Apenas o preparo do hero exige o servidor ativo. As matrizes locais não acompanham um clone do Git. Os procedimentos e prompts das mídias atuais estão em `docs/brand/`.

## Onde editar

| Responsabilidade | Local |
|---|---|
| Configuração | `app/config.py` |
| Deploy e exportação estática | `vercel.json` e `scripts/build_static.py` |
| Criação da aplicação e rotas | `app/__init__.py` e `app/routes.py` |
| Montagem do contato | `app/services/contact_links.py` |
| Composição da página | `app/templates/pages/home.html` |
| Conteúdo | `app/templates/sections/` |
| FAQ aprovado | `docs/content/faq.md` |
| Cabeçalho e rodapé | `app/templates/partials/` |
| Tokens, base e estrutura | `app/static/css/` |
| Estilos de componentes e suas media queries | `app/static/css/components/` |
| Composição específica da landing | `app/static/css/pages/home.css` |
| Comportamentos | `app/static/js/modules/` |
| Servidor local | `scripts/dev/` |
| Mídia, auxiliares e QA | `scripts/media/`, `scripts/lib/` e `scripts/qa/` |

A página inclui hero, introdução, serviços, benefícios, jornada, processo, FAQ e contato. Os estilos carregam tokens, base, layout, componentes compartilhados, componentes específicos e página. Os templates mantêm as âncoras usadas pela navegação.

## Gerar e conferir a versão de produção

```powershell
.\.venv\Scripts\python.exe scripts/build_static.py
.\.venv\Scripts\python.exe -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Acesse `http://127.0.0.1:4173/`. O servidor estático é apenas uma prévia local; encerre com `Ctrl+C`. Em macOS/Linux, use `.venv/bin/python` nos comandos. O build resolve os templates, recria `dist/` e copia os arquivos públicos e as licenças das fontes. Documentação, configurações locais e matrizes de design ficam fora da saída.

Na Vercel, `VERCEL_ENV=production` gera HTML e `robots.txt` que permitem indexação. Preview e Development geram `noindex, nofollow` e `Disallow: /`; o servidor Flask local também usa `noindex, nofollow`. Fora da Vercel, o exportador assume produção; defina `VERCEL_ENV=preview` para gerar uma prévia sem indexação. `PORT` só configura o servidor Flask local.

Para testar a saída estática no navegador, com a prévia acima ativa:

```powershell
node scripts/qa/run-browser-tests.mjs --url http://127.0.0.1:4173/ --out reports/qa/vercel-static
```

## Documentação

- [Mapa do projeto](docs/design/organizacao-do-projeto.md).
- [Inventário](docs/design/inventario-arquivos.csv).
- [Sistema visual](docs/brand/design-system.md).
- [Fontes e referências](docs/references/third-party.md).
- [Evidências de QA](reports/qa/README.md).

`.env`, matrizes de design, ferramentas locais, ambiente virtual, caches, logs e evidências geradas ficam fora do Git. Todas as mídias necessárias ao site e suas licenças são versionadas em `app/static/`.
