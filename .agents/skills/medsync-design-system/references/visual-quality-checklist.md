# Checklist de qualidade visual

## Fidelidade

- Cada escolha relevante corresponde a uma referência, token ou necessidade.
- O resultado preserva proporção, densidade e hierarquia da referência, não
  apenas suas cores.
- Elementos não presentes na referência têm justificativa funcional.
- A tela parece parte do MedSync sem imitar a estrutura promocional da home.

## Consistência

- Cores, tipografia, raios, sombras e ícones seguem papéis compartilhados.
- Componentes equivalentes têm os mesmos estados e comportamento.
- Não há verde decorativo nem nova cor de marca acidental.
- Não existem cards, pílulas ou gradientes usados apenas para preencher espaço.

## Hierarquia e conteúdo

- A tarefa principal está visível cedo.
- Existe uma ação primária inequívoca por contexto.
- Metadados não competem com títulos ou conteúdo clínico.
- Textos e métricas reais não foram alterados sem autorização.

## Interação e movimento

- Toda animação explica apresentação, conexão, estado ou confirmação.
- Informação e ação funcionam sem hover.
- Foco é visível e controles têm área de toque suficiente.
- `prefers-reduced-motion` foi testado.
- Efeitos contínuos desnecessários foram removidos.

## Responsividade e verificação

- `360`, `390`, `430`, `760` px e desktop foram inspecionados.
- Não há rolagem horizontal, corte, deformação ou texto sobreposto.
- O console não apresenta erros atribuíveis à mudança.
- Testes relevantes, lint e build foram executados.
- A comparação final foi visual, não apenas baseada no código.
