# ATIVOS Negócios Locais

Landing de apresentação de serviços da ATIVOS Tecnologia, em português brasileiro. O conteúdo reúne presença no Google e Maps, site profissional, marketing digital e automação comercial com IA para WhatsApp, retornos, agendamentos e organização de contatos.

O objetivo apresentado é gerar uma conversa comercial pelo WhatsApp. Hero, FAQ e contato final compartilham o contato configurável por `WHATSAPP_NUMBER`. Os textos descrevem serviços e benefícios; as imagens são conceituais e não constituem evidência de resultados.

**Público inferido do conteúdo:** responsáveis por negócios locais que desejam melhorar sua presença digital e agilizar o atendimento. Não há segmentação de porte ou setor formalizada nestes arquivos.

A página contém hero, introdução, soluções, benefícios, jornada, processo, FAQ e contato. A navegação usa âncoras; há cards interativos, conteúdo expansível, jornada e vídeo com controles. Conteúdo essencial permanece legível sem JavaScript, com alternativas para movimento reduzido e texto ampliado.

Flask e Jinja montam o HTML no desenvolvimento e no build. A produção serve a exportação estática `dist/` na Vercel, com CSS e módulos JavaScript nativos. Conteúdo em `app/templates/sections/`; estilos em `app/static/css/`; comportamento em `app/static/js/modules/`. Ver `README.md` para operação e verificações.

A identidade fornecida pelo usuário é `design/design_system_ativos/base.md` v0.5. `DESIGN.md` captura suas regras implementadas; `docs/brand/design-system.md` contém a documentação visual detalhada. Preservar a marca oficial, os textos aprovados e o conteúdo de FAQ em `docs/content/faq.md`.
