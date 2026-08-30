# Painel administrativo de consumo da Synapse

## Objetivo e escopo

A aba `Administração → Synapse` permite acompanhar eficiência e custo da camada
de IA sem alterar a experiência do estudante. Esta versão não cria franquia,
contador individual visível ou bloqueio de perguntas.

O painel consome a rota administrativa protegida:

```text
GET /admin/synapse/consumo?dias={7|30|90}
```

A API aceita de 1 a 180 dias; a interface oferece os três intervalos mais úteis
para operação. Somente administradores conseguem consultar os dados.

## Conteúdo apresentado

- chamadas e usuários ativos;
- tokens de entrada, cache, saída e total;
- custo estimado e indicação de chamadas sem preço configurado;
- latência média e percentil 95;
- tendência diária;
- distribuição por modelo e por operação;
- dez usuários com maior consumo, apenas para identificar padrões e anomalias;
- modelos, esforço de raciocínio e tetos de saída atualmente ativos na API.

O custo exibido é uma estimativa registrada pela API. A presença de chamadas
sem tarifa configurada é explicitada, evitando apresentar um total incompleto
como se fosse definitivo.

## Estados e interação

- os dados iniciais são carregados junto das demais informações administrativas;
- ao selecionar outro período, somente a telemetria da Synapse é atualizada;
- o botão de atualização repete a consulta do período corrente;
- erros de atualização permanecem dentro da aba e preservam os últimos dados;
- listas vazias mostram mensagens neutras, sem tratar ausência de consumo como
  falha;
- os controles têm rótulos e estados `aria-pressed` para navegação assistiva.

## Arquivos envolvidos

- `src/components/AdminSynapseUsage.jsx`: painel e troca de período;
- `src/pages/AdminAcademicPage.jsx`: aba e carregamento inicial;
- `src/services/api.js`: contrato HTTP;
- `src/styles/admin-operations.css`: layout responsivo;
- testes correspondentes em `*.test.jsx` e `src/services/api.test.js`.

## Publicação e verificação

1. Publicar primeiro a API com `/admin/synapse/consumo` disponível.
2. Publicar o frontend.
3. Entrar como administrador e abrir a aba `Synapse`.
4. Conferir os períodos de 7, 30 e 90 dias e o botão de atualização.
5. Comparar os totais com `ai_usage_records` e confirmar que usuários comuns
   recebem `403` ao tentar consultar a rota.

Se o frontend for publicado antes da API, a área administrativa poderá falhar
no carregamento inicial; por isso a ordem acima deve ser preservada. Nenhuma
migração de banco é necessária.
