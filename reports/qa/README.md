# Evidências de qualidade

Os relatórios, capturas e logs desta pasta são gerados pelos comandos de `scripts/qa/` e pelos testes de navegador. Podem ser recriados; não são entradas necessárias da aplicação ou dos scripts de mídia.

- `current/`: verificações da estrutura limpa, com testes HTTP, contratos de execução e cenários de navegador.
- `browser-suite/`: destino padrão do executor das nove suítes, quando utilizado sem `--out`.
- `inspect/`: destino padrão da inspeção visual.
- `vercel-static/`: suítes executadas contra o frontend exportado, servido sem Flask.
- `vercel-static-recheck/`: repetição da suíte da página após falha de inicialização do Chrome na primeira execução.

`results.json` registra o estado e os códigos de saída; cada suíte recebe sua pasta de evidências e logs. Use `--out` ou `-OutputDirectory` para escolher o destino dentro do projeto.

Somente este índice é versionado. As saídas geradas ficam fora do Git conforme `.gitignore`.
