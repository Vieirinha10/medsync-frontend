---
trigger: always_on
description: Aplica o repertório oficial de IA, as fontes de verdade e os limites de publicação do MedSync.
---

# Repertório oficial do MedSync

Leia `AGENTS.md` e `docs/ai/SKILLS.md` antes de modificar o projeto.

No início de cada tarefa:

1. identifique as skills realmente aplicáveis;
2. informe ao usuário quais serão usadas e por quê;
3. carregue apenas as skills necessárias;
4. preserve o escopo e as decisões já aprovadas;
5. valide o resultado conforme os comandos do repositório.

Roteamento:

- arquitetura, impacto entre arquivos, autenticação, pagamentos, Synapse ou
  integração frontend/API: consulte `graphify` primeiro;
- criação ou reformulação visual: use `frontend-design`;
- texto comercial, institucional, planos, hero ou CTA: use `copywriting`;
- revisão de naturalidade de texto público: use `humanizer` por último.

Não use `frontend-design` para uma correção técnica sem decisão visual. Não
use `humanizer` automaticamente em textos clínicos, jurídicos, contratuais ou
regulatórios. Exemplos, percentuais e depoimentos presentes nas skills externas
nunca são evidências sobre o MedSync.

As versões externas são imutáveis e estão registradas em
`docs/ai/skills-lock.json`. Preferências do MedSync pertencem aos arquivos de
contexto do projeto, não ao corpo das skills.

Nenhuma tarefa autoriza implicitamente push, PR, merge, envio de dados a
provedores externos ou publicação em produção. Peça autorização explícita para
a ação externa correspondente.
