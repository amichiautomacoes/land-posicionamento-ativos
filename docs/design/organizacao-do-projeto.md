---
type: architecture
status: Accepted
date: 2026-11-05
language: pt-BR
---

# Organização do projeto

A landing separa configuração, rotas, serviço de contato e interface. Flask e Jinja geram o HTML durante o build e atendem ao desenvolvimento local. A Vercel serve a saída estática `dist/`, com CSS e JavaScript nativos.

## A aplicação reúne somente o que atende a página

| Local | Responsabilidade |
|---|---|
| `app/__init__.py` | Compor a aplicação Flask |
| `app/config.py` | Ler configuração do ambiente e `.env` |
| `app/routes.py` | Preparar contexto e renderizar a página |
| `app/services/contact_links.py` | Normalizar telefone e montar o contato |
| `app/template_helpers.py` | Gerar URLs versionadas dos arquivos públicos |
| `run.py` | Iniciar o servidor de desenvolvimento |
| `vercel.json` | Configurar instalação, build e saída estática na Vercel |
| `scripts/build_static.py` | Gerar HTML, robots.txt e arquivos públicos em `dist/` |
| `app/templates/` | Composição, conteúdo e componentes Jinja |
| `app/static/` | CSS, JavaScript, imagens, vídeos e fontes usados pelo site |

A página inclui oito seções: hero, introdução, serviços, benefícios, jornada, processo, FAQ e contato. `benefits.html` e `faq.html` identificam os conteúdos correspondentes. A referência editorial do FAQ fica em `docs/content/faq.md` e é comparada integralmente com a página pelo teste específico.

Os três controles de contato dependem de `WHATSAPP_NUMBER`. As regras de montagem do link ficam no serviço; os templates apresentam o resultado.

## Cada componente mantém seus estilos e comportamento

O carregamento CSS em `app/templates/base.html` segue tokens, base, layout, componentes compartilhados, componentes específicos e composição da página.

| CSS específico | Conteúdo |
|---|---|
| `components/card-stack.css` | Pilha de canais |
| `components/process-rail.css` | Trilho de serviços |
| `components/horizontal-journey.css` | Jornada horizontal |
| `components/expanding-flow.css` | Benefícios expansíveis |
| `components/faq.css` | Perguntas e respostas |
| `pages/home.css` | Hero, composição, processo, contato e entradas das seções |

As regras responsivas acompanham o respectivo componente. Os nove módulos JavaScript são inicializados por `app/static/js/main.js`. O conteúdo continua legível sem JavaScript e com movimento reduzido.

## Os scripts são separados por finalidade

| Pasta | Uso |
|---|---|
| `scripts/dev/` | Iniciar e encerrar o servidor; contexto compartilhado em `server-support.ps1` |
| `scripts/media/` | Exportar marca, vídeos e ilustrações das matrizes atuais |
| `scripts/lib/` | Caminhos, contexto de execução, navegador e codificação WebP |
| `scripts/qa/` | Executor das suítes e inspeção visual |
| `tests/integration/` | Contratos HTTP, mídia pública, contato e limites de publicação |
| `tests/unit/` | Contratos de URL, opções e orquestração |
| `tests/browser/` | Nove suítes de comportamento e responsividade |

A URL usa `--url`, depois `LANDING_BASE_URL` e, por último, `PORT` obtido de `app/config.py` pelo Python local. Caminhos são resolvidos a partir do projeto, e saídas precisam ficar dentro dele. A interface dos comandos aceita opções nomeadas.

O executor valida as ferramentas e a resposta da landing, executa as suítes em sequência, registra cada resultado e retorna código `1` se alguma falhar. O relatório consolidado inclui estados e códigos de saída. Os comandos estão no [README](../../README.md).

## O build e o desenvolvimento compartilham as dependências

`requirements/base.txt` fixa Flask e python-dotenv, usados para gerar o HTML na Vercel. `requirements/development.txt` inclui a mesma base para o ambiente local. Os testes usam `unittest` e `node:test`, incluídos nos runtimes. Docker e Waitress foram retirados do fluxo de produção.

O QA de navegador e o preparo de mídia exigem Node 22+, Chrome, Edge ou Chromium e a skill local `design-taste-frontend`, com origem em `skills-lock.json`. Eles não precisam de pacotes npm. Os testes HTTP e o build da Vercel não dependem dessa ferramenta local.

## Fontes de trabalho e saídas geradas têm limites próprios

`design/originals/` contém as matrizes das mídias atuais; `design/design_system_ativos/` reúne os materiais da marca vigente. Esses materiais são locais e ficam fora da saída estática. As [referências e licenças](../references/third-party.md) documentam o material distribuído.

`runtime/` recebe PID e logs do servidor. `reports/qa/` recebe evidências regeneráveis. `.env`, caches, ferramentas locais, `.vercel/`, ambiente virtual e `dist/` ficam fora do Git. `.vercelignore` também exclui arquivos locais dos envios pela CLI. Apenas `dist/` é servido pela Vercel; os detalhes estão no [guia de publicação](../how-to/publicar-na-vercel.md).

O [inventário](inventario-arquivos.csv) lista os arquivos mantidos e as fontes locais, com `caminho`, `papel` e `escopo`. Diretórios regeneráveis são descritos por padrões. Credenciais não são inventariadas.

## A verificação acompanha a estrutura atual

Os testes HTTP conferem a página, contatos, arquivos e alternativas de `srcset`, requisições parciais dos vídeos e limites entre conteúdo público e interno. Também verificam que as mídias e fontes publicadas são referenciadas pelo HTML ou pelo CSS.

As suítes de navegador cobrem menu, teclado, foco, vídeo, pilha, benefícios, jornada, trilho, FAQ, transições e texto ampliado. O executor reúne resultados e logs em `reports/qa/`; as evidências da limpeza ficam em `reports/qa/current/`.

O registro da limpeza anterior está em `reports/qa/current/verification.json`. A migração para a Vercel acrescenta testes da exportação estática, da reconstrução da saída e da indexação por ambiente. A versão gerada pode receber as mesmas suítes de navegador usando `--url`, conforme o guia de publicação.
