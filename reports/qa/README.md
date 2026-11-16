# Evidências de qualidade

Os relatórios, capturas e logs desta pasta são gerados pelos comandos de `scripts/qa/` e pelos testes de navegador. Podem ser recriados; não são entradas necessárias da aplicação ou dos scripts de mídia.

- `current/`: verificações da estrutura limpa, com testes HTTP, contratos de execução e cenários de navegador.
- `design-system-v05/`: migração para `base.md` v0.5, com capturas antes/depois, auditoria da marca e resultados consolidados em `verification.json`; as primeiras falhas e suas verificações finais são preservadas nas respectivas pastas.
- `media-blue-controls/`: ajuste solicitado para manter mídias nas cores originais e retomar os azuis nos controles; inclui capturas responsivas, contraste e testes de interação contra a versão estática.
- `hero-cover/`: preenchimento integral do fundo do hero no desktop, com vídeo e poster, múltiplas proporções de tela, texto ampliado e verificações dos controles de reprodução.
- `hero-reframe/`: revisão posterior do hero sem scrim no desktop, com largura própria para a copy, verificação de cobertura e capturas do vídeo em 1021, 1280, 1440, 1920 e 2560px, além de controle mobile.
- `browser-suite/`: destino padrão do executor das nove suítes, quando utilizado sem `--out`.
- `inspect/`: destino padrão da inspeção visual.
- `vercel-static/`: suítes executadas contra o frontend exportado, servido sem Flask.
- `vercel-static-recheck/`: repetição da suíte da página após falha de inicialização do Chrome na primeira execução.

`results.json` registra o estado e os códigos de saída; cada suíte recebe sua pasta de evidências e logs. Use `--out` ou `-OutputDirectory` para escolher o destino dentro do projeto.

Somente este índice é versionado. As saídas geradas ficam fora do Git conforme `.gitignore`.
