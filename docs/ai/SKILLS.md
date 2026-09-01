# Repertório de IA do MedSync — frontend

Este documento define como Codex, Google Antigravity e colaboradores devem usar
as skills adotadas pelo MedSync. As versões oficiais estão fixadas em
`skills-lock.json`; atualizar uma skill exige nova auditoria e autorização.

## O que está instalado

| Skill | Local | Função |
| --- | --- | --- |
| Graphify | Repositório + CLI local | Mapa arquitetural e análise de impacto |
| Frontend Design | Local, não versionada | Direção visual e construção de interface |
| Copywriting | Repositório | Texto comercial, institucional e de conversão |
| Humanizer | Repositório | Revisão final de naturalidade |

As skills versionadas permanecem idênticas às fontes originais. O contexto do
MedSync é aplicado por `AGENTS.md`, `.agents/rules/medsync-ai.md` e
`.agents/product-marketing.md`.

## Configuração local

No primeiro uso de cada clone:

```bash
python scripts/setup_agent_skills.py install-local
python scripts/setup_agent_skills.py check-local
```

O primeiro comando:

1. instala `graphifyy==0.9.53` em ambiente isolado do `uv`;
2. baixa o `frontend-design` do commit auditado da Anthropic;
3. valida o Git blob SHA-1 antes de escrever o arquivo;
4. não instala hooks Git nem envia conteúdo a provedores externos.

Se o executável `graphify` não entrar imediatamente no `PATH`, execute
`uv tool update-shell` e reabra o terminal.

## Roteamento obrigatório

### Graphify

Use antes de:

- mudanças que atravessam vários módulos;
- alterações em autenticação, pagamentos ou integração com a API;
- investigações de arquitetura;
- refatorações com impacto incerto;
- mudanças na jornada completa do usuário.

Não exija Graphify para uma correção pequena cujo arquivo e causa já estejam
identificados.

Consultas úteis:

```bash
graphify query "HomePage"
graphify query "Synapse"
graphify query "SimulacaoCaso"
graphify affected "HomePage"
```

Depois de modificar código:

```bash
graphify update .
```

O grafo inicial foi gerado em modo `--code-only`, sem API ou LLM. São
versionados `graph.json`, `GRAPH_REPORT.md`, `manifest.json` e os metadados
de análise e agrupamento.
Cache, custos, caminhos absolutos e memórias locais não entram no Git.

### Frontend Design

Use ao criar ou reformular página, componente, hierarquia visual, tipografia,
responsividade, animação ou interação. O briefing e o design atual do MedSync
prevalecem. Não acione para correções técnicas sem decisão visual.

### Copywriting

Use para homepage, planos, páginas institucionais, proposta de valor, hero,
CTA e textos de produto. Leia `.agents/product-marketing.md` antes de escrever.
Não transforme exemplos e métricas internas da skill em alegações do MedSync.

### Humanizer

Use depois de Copywriting quando o texto público precisar de uma última revisão.
Preserve fatos, números, citações e frases institucionais. Não aplique
automaticamente a textos clínicos, jurídicos, contratuais ou regulatórios.

## Ordem em tarefas combinadas

```text
Graphify, se houver impacto arquitetural
→ Frontend Design
→ Copywriting
→ Humanizer
→ testes, lint e build
```

A IA deve anunciar ao usuário quais skills serão utilizadas. O usuário pode
forçar uma skill mencionando seu nome; no Codex, também pode usar
`$graphify`, `$frontend-design`, `$copywriting` ou `$humanizer`. No
Antigravity, Graphify também está disponível pelo workflow `/graphify`.

## Antigravity

O Antigravity encontra automaticamente:

- skills em `.agents/skills/`;
- regras em `.agents/rules/`;
- workflows em `.agents/workflows/`.

Abra este repositório como workspace e execute a configuração local acima. A
regra `medsync-ai.md` orienta a seleção das skills, e a regra oficial
`graphify.md` prioriza consultas ao grafo em questões arquiteturais.

O MCP do Graphify é opcional. Para habilitá-lo, instale o extra `mcp` da mesma
versão e use a configuração exibida por
`graphify antigravity install`. Não compartilhe chaves ou configurações
pessoais no repositório.

## Repositórios do MedSync

| Repositório | Configuração |
| --- | --- |
| `medsync-frontend` | Quatro skills; Frontend Design local |
| `medsync-api` | Graphify compartilhado e CLI local |

Ao trabalhar nos dois repositórios, consulte o grafo correspondente antes de
alterar contratos entre frontend e API.

## Segurança e atualização

- Graphify opera em modo de código local por padrão neste projeto.
- Não envie documentos, PDFs, imagens ou banco de dados a um backend sem
  autorização explícita.
- Não ative hooks restritivos automaticamente.
- Não atualize skills ou o pacote Graphify sem revisar origem, licença, diff e
  checksums.
- Push, PR, merge e deploy continuam dependendo de autorização explícita.

## Fontes fixadas

- [Graphify](https://github.com/Graphify-Labs/graphify)
- [Frontend Design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)
- [Marketing Skills — Copywriting](https://github.com/coreyhaines31/marketingskills/tree/main/skills/copywriting)
- [Humanizer](https://github.com/blader/humanizer)
