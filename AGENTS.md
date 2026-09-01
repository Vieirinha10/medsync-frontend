# Instruções para agentes e colaboradores

Estas instruções abrangem todo o repositório.

## Repertório de IA do MedSync

Antes de alterar código, conteúdo ou interface, leia
`docs/ai/SKILLS.md` e identifique as skills aplicáveis. Informe ao usuário,
em uma atualização curta, quais skills serão usadas e por quê.

- Use `graphify` antes de mudanças arquiteturais, fluxos que atravessam vários
  arquivos ou integrações entre frontend e API. Não o exija para correções
  pequenas e já localizadas.
- Use `frontend-design` para criar ou reformular páginas, componentes,
  hierarquia visual, tipografia, responsividade ou movimento. Essa skill é
  instalada localmente pelo script documentado e não é redistribuída neste
  repositório.
- Use `copywriting` para criar ou revisar textos de marketing, páginas
  institucionais, planos, propostas de valor e chamadas para ação.
- Use `humanizer` como revisão final de textos destinados ao público, depois
  de `copywriting` quando ambas forem necessárias. Não a aplique
  automaticamente a textos clínicos, jurídicos, contratuais ou regulatórios.

As skills externas devem permanecer idênticas às versões registradas em
`docs/ai/skills-lock.json`. As regras próprias do MedSync ficam em
`AGENTS.md`, `.agents/rules/`, `.agents/product-marketing.md` e
`docs/ai/`; não edite o conteúdo das skills para inserir preferências locais.

Quando `graphify-out/graph.json` existir, consulte o grafo antes de uma
investigação arquitetural ampla. Depois de alterações em código, atualize o
grafo com `graphify update .` ou registre claramente por que a atualização não
pôde ser executada.

Não instale, atualize, envie código, abra PR, faça merge ou publique em produção
sem a autorização correspondente. Uma autorização de implementação não implica
autorização de publicação.

Antes de criar, editar, importar ou revisar desafios visuais, leia integralmente
`docs/DIRETRIZ_DESAFIOS_VISUAIS.md`.

A diretriz `MEDSYNC-DV-001` é obrigatória para novos lotes. Em especial:

- não altere os 150 desafios atuais sem solicitação expressa;
- organize cada novo lote de 10 em 6 desafios diretos e clínicos e 4 específicos
  e contextualizados;
- mantenha a distribuição preferencial de 3 básicos, 4 intermediários e
  3 avançados;
- utilize apenas imagens clínicas reais, rastreáveis e com licença compatível;
- não exponha o gabarito no frontend, na imagem, no nome do arquivo ou no texto
  alternativo;
- distribua as respostas corretas entre A, B, C e D: em cada bloco consecutivo
  de 10, cada posição deve aparecer 2 ou 3 vezes; no catálogo completo, a
  diferença entre a posição mais e menos frequente deve ser de no máximo 1;
- não declare um lote pronto enquanto o checklist clínico, editorial, visual,
  legal e técnico da diretriz não estiver concluído.

Quando a alteração envolver frontend e API, mantenha enunciados e alternativas
públicas no frontend e respostas, explicações e demais dados protegidos na API.
