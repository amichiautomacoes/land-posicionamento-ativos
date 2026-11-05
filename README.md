# Landing page da Ativos Tecnologia

Landing implementada em Flask, templates Jinja, CSS e módulos JavaScript nativos. A aplicação publica os arquivos de `app/static/`. Originais, referências, documentação e relatórios têm diretórios próprios.

A página apresenta a proposta da **Ativos Negócios Locais**: presença no Google, marketing nas redes sociais e automação comercial com IA para atrair contatos e acompanhar oportunidades. O visual atual usa a assinatura metálica, vídeos próprios para desktop e celular, pilha de canais, trilho de soluções e benefícios com prévias de imagens. A jornada conecta descoberta, atendimento e acompanhamento; o FAQ reúne seis perguntas, inicialmente fechadas, antes do contato final.

## Iniciar no Windows

Na raiz do projeto:

~~~powershell
.\scripts\dev\start.ps1
~~~

O comando abre `http://127.0.0.1:5017/` e reutiliza o servidor quando já estiver disponível. Acrescente `-NoBrowser` para iniciar sem abrir o navegador. Para encerrar somente o processo registrado deste projeto:

~~~powershell
.\scripts\dev\stop.ps1
~~~

Os comandos resolvem os caminhos pela própria localização. Logs e PID ficam em `runtime/`. Para acompanhar a execução em primeiro plano:

~~~powershell
.\.venv\Scripts\python.exe run.py
~~~

## Preparar o ambiente

Python 3.12 foi utilizado nesta reorganização. As verificações de navegador usam Node 22 ou superior e Chrome, Edge ou Chromium instalado.

~~~powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements/base.txt
~~~

`requirements/base.txt` contém Flask e python-dotenv. `requirements/production.txt` acrescenta Waitress. As extensões declaradas anteriormente permanecem em `requirements/optional.txt` para decisão futura. `requirements.txt` conserva o conjunto anterior por compatibilidade. Nenhum pacote foi desinstalado.

Copie `.env.example` para `.env` se precisar de configuração local. `PORT` define a porta, com padrão `5017`. A configuração de `WHATSAPP_NUMBER` foi preservada: sem número, os dois botões de contato continuam sem destino ativo.

## Docker e deploy manual no EasyPanel

O `Dockerfile` usa Python 3.12 e Waitress, atende em `0.0.0.0:8504` e executa com um usuário sem privilégios de administrador. O healthcheck verifica a página inicial. A imagem contém apenas `app/` e as dependências de produção; arquivos locais, skills, relatórios, originais e `.env` ficam fora pelo `.dockerignore`.

Para construir e testar localmente:

~~~powershell
docker build --tag ativos-posicionamento-digital:local .
docker run --rm --publish 8504:8504 ativos-posicionamento-digital:local
~~~

Abra `http://localhost:8504/`. Para encerrar o teste em primeiro plano, use Ctrl+C.

No EasyPanel, crie um serviço **App**, envie o projeto pela opção **Upload** e configure:

| Configuração | Valor |
|---|---|
| Build | Dockerfile |
| Caminho do Dockerfile | `Dockerfile` na raiz |
| Contexto de build | Raiz do projeto (`.`) |
| Comando de inicialização | Usar o padrão da imagem |
| Protocolo do domínio | HTTP |
| Porta de destino do domínio | `8504` |

As variáveis da aplicação podem ser definidas em **Environment** no EasyPanel. O contato permanece conforme a configuração existente. Se `PORT` for informado, use `8504` para manter a configuração alinhada ao container.

O deploy é manual pelo painel. Consulte [App Service — documentação do EasyPanel](https://easypanel.io/docs/services/app).

## Onde editar

| Parte | Local |
|---|---|
| Criação da aplicação | `app/__init__.py` |
| Configuração | `app/config.py` |
| Página e contexto | `app/routes.py` |
| Montagem do contato | `app/services/contact_links.py` |
| Versão dos arquivos públicos | `app/template_helpers.py` |
| Ordem das seções | `app/templates/pages/home.html` |
| Conteúdo | `app/templates/sections/` |
| Cabeçalho e rodapé | `app/templates/partials/` |
| Botões de contato | `app/templates/components/contact-button.html` |
| Cores compartilhadas | `app/static/css/tokens.css` |
| Fontes e regras gerais | `app/static/css/base.css` |
| Estrutura e componentes | `app/static/css/layout.css` e `components.css` |
| Composição da landing | `app/static/css/pages/home.css` |
| Comportamentos | `app/static/js/modules/` |
| Mídias publicadas | `app/static/` |
| Originais e referências | `design/` |
| Especificação visual | [Design system](docs/brand/design-system.md) |

Os templates mantêm as âncoras existentes. Menu, vídeo e entrada das seções têm inicializadores independentes. A seção de depoimentos foi removida a pedido do usuário. Os estilos carregam nesta ordem: tokens, base, layout, componentes e página.

## Verificar as alterações

Testes HTTP, arquivos públicos e vídeo com requisições parciais:

~~~powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests/integration -v
~~~

As verificações de navegador e o inspetor são ferramentas locais opcionais: dependem da skill `design-taste-frontend` instalada em `.agents/skills/`. O conteúdo das skills não é versionado; `skills-lock.json` registra suas origens. Os testes HTTP e o Docker funcionam sem essas ferramentas.

Com o servidor ativo e a skill instalada, teste de menu, links internos, vídeo, ausência do depoimento, movimento reduzido e conteúdo sem JavaScript:

~~~powershell
node tests/browser/landing.mjs
~~~

Estados de hover/press, navegação por teclado, foco ao mudar de breakpoint, semântica de controles e pausa do vídeo fora da tela:

~~~powershell
node tests/browser/interactions.mjs
~~~

Pilha de cards da segunda seção: hover, clique, toque, teclado, recolhimento e movimento reduzido:

~~~powershell
node tests/browser/card-stack.mjs
~~~

Texto ampliado a 200%: leitura dos benefícios e da pilha de cards, contenção da página e retorno às interações ao restaurar o tamanho da fonte:

~~~powershell
node tests/browser/typography-reflow.mjs
~~~

Jornada horizontal: três etapas conectadas, navegação por setas e teclado, pausa do movimento e rolagem nativa no celular, inclusive sem JavaScript:

~~~powershell
node tests/browser/horizontal-journey.mjs
~~~

Expanding Flow com os quatro benefícios da nova seção: expansão de todos os cards, navegação por teclado, independência da jornada original e leitura responsiva:

~~~powershell
node tests/browser/benefits-flow.mjs
~~~

Trilho de soluções: imagem fixa, rotação da moldura, troca de imagem por scroll, retorno ao rolar para cima, links diretos, responsividade e leitura estática sem JavaScript ou com movimento reduzido:

~~~powershell
node tests/browser/process-rail.mjs
~~~

FAQ: abertura exclusiva, interrupção de transições, teclado, foco, texto ampliado, movimento reduzido e leitura sem JavaScript:

~~~powershell
node tests/browser/faq.mjs
~~~

O FAQ apresenta seis cards expansivos, com três perguntas em cada coluna no desktop. Com JavaScript, todas as perguntas começam fechadas e apenas uma resposta pode ficar aberta por vez. As perguntas e respostas fornecidas pelo usuário estão em `faq_07.txt` e em `app/templates/sections/before-start.html`. O teste de navegador compara integralmente o conteúdo publicado com o arquivo de origem.

Inspeção visual em 1440, 768 e 390px:

~~~powershell
.\scripts\qa\inspect.ps1
~~~

As evidências ficam em `reports/qa/`. O adaptador em `tests/browser/support/browser-env.mjs` centraliza a integração com a biblioteca de navegador da skill de design. A origem da skill está em `skills-lock.json`.

## Organização e manutenção

- [Organização aplicada](docs/design/organizacao-do-projeto.md).
- [Inventário da estrutura atual](docs/design/inventario-arquivos.csv).
- [Origem dos arquivos e licenças](docs/references/third-party.md).
- [Como interpretar os relatórios](reports/qa/README.md).

Todos os templates e módulos usam os caminhos atuais de `app/`. As rotas da estrutura anterior foram retiradas.

As skills permanecem intactas em `.agents/skills/`. Direção e briefing vigente ficam em `.taste-skill/`. Essas ferramentas locais, o ambiente virtual, caches, credenciais, execução e saídas de QA ficam fora do versionamento conforme `.gitignore`. Somente o índice de QA em `reports/qa/README.md` é mantido no Git.

`design/` conserva os originais e a referência visual na cópia local e fica fora do repositório remoto. Todas as mídias necessárias à landing e suas licenças estão em `app/static/` e são versionadas. O inventário descreve a cópia de trabalho completa, incluindo esses diretórios locais.

O backup e os scripts temporários da migração, os relatórios de versões anteriores e os materiais de referência sem uso foram removidos conforme solicitado. As evidências da estrutura atual permanecem em `reports/qa/project-organization/`; a limpeza está registrada em `reports/qa/cleanup/`. Os logs e o PID da execução atual ficam em `runtime/`. Os originais da marca e do hero ficam em `design/originals/`.
