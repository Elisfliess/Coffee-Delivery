# AGENTS — Diretrizes para uso de assistente de IA

Aplicável a assistentes de IA (por exemplo, OpenCode com modelo Big Pickle) que trabalhem neste repositório. Estas regras complementam — e não substituem — a revisão humana.

---

## 1. Propósito

Manter a implementação e a documentação coerentes, previsíveis e verificáveis. O projeto é uma SPA de demonstração com dados fictícios; qualquer mudança deve respeitar esse caráter.

### 1.1 Ferramenta registrada

- Assistente: **OpenCode**, modelo **Big Pickle**.
- Função: apoio em planejamento, arquitetura, escrita de código, revisão de tipos, testes e documentação.
- Gerador de imagem: tentativa de uso para a logo falhou por credencial inválida; a logo final é um SVG original criado com apoio do assistente de desenvolvimento. Ver `docs/AI_USAGE.md`.

---

## 2. Escopo permitido

| Área | Permitido | Requer revisão humana |
| --- | --- | --- |
| Planejamento | Sugerir fases, critérios de aceite e estimativas. | Sim, antes de virar escopo. |
| Código | Implementar ajustes nas pastas `src/` e arquivos de configuração existentes, mantendo a arquitetura atual. | Sim, sempre. |
| Testes | Escrever/adaptar testes unitários e de integração com Vitest + Testing Library. | Sim, sempre. |
| Documentação | Atualizar `README.md`, `PRD_SPEC.md`, `TECH_SPEC.md`, `TASKS_SPEC.md`, `AGENTS.md` e `docs/AI_USAGE.md`. | Sim, sempre. |
| Dependências | Propor inclusão de pacote com justificativa. | Sim; não instalar sem aprovação. |
| Evidências | Executar `npm run evidence` e inspecionar as capturas geradas. | Sim; conferência visual final das imagens. |
| Deploy | Sugerir comandos e configuração para Vercel/Netlify. | Sim; publicação é decisão humana. |

Fora do escopo de uma alteração comum: introduzir backend, gateway de pagamento, autenticação, PIX, rastreamento real, estoque ou serviços externos sem solicitação explícita e aprovação.

---

## 3. Regras de código

1. **Respeitar a estrutura existente.** Componentes em `src/components/`, páginas em `src/pages/`, estado em `src/contexts/`, regras puras em `src/lib/`, dados em `src/data/`.
2. **Não duplicar regras de negócio.** Preço dos cafés vem de `src/data/coffees.ts`; taxa de entrega vem de `calculateDeliveryFee`; validação vem de `checkoutSchema`.
3. **Manter tipagem estrita.** Evitar `any`, asserções sem necessidade e ignorar erros do TypeScript. Usar `type`/`interface` de `src/types.ts` quando aplicável.
4. **Preservar o padrão de estado.** Carrinho via `useReducer` + `CartContext`; pedido, tema e UI em seus contexts próprios. Não introduzir biblioteca de estado global sem aprovação.
5. **Acessibilidade é requisito.** Manter `aria-label`, `aria-pressed`, `aria-invalid`, `aria-live`, `role="dialog"`/`aria-modal` e fechamento por Escape onde já existem. Novos controles interativos devem ser acessíveis por teclado.
6. **Idioma.** Textos visíveis, mensagens de erro e documentação em pt-BR.
7. **Estilos.** Usar variáveis CSS de `src/styles/global.css`. Não introduzir framework de CSS sem decisão explícita.
8. **Persistência.** Usar as chaves versionadas existentes (`coffee-delivery:cart:v1`, `coffee-delivery:theme:v1`, `coffee-delivery:last-order:v1`); envolver acesso a `localStorage` em `try/catch`.
9. **Escopo mínimo.** Alterar somente arquivos necessários para a tarefa; não fazer refatorações amplas não solicitadas.
10. **Verificação obrigatória antes de declarar concluído.** Executar `npm run typecheck`, `npm test` e `npm run build`, registrar navegação automatizada em navegador quando aplicável e conferir o checklist manual de `TECH_SPEC.md` quando a mudança afetar interface.

---

## 4. Prompts recomendados

Prompts úteis para tarefas recorrentes neste repositório:

- **Adicionar teste de regra de negócio**
  > "Leia `src/lib/format.ts` e `src/lib/format.test.ts`. Adicione um teste para o caso de subtotal exatamente R$ 50,00 sem alterar a implementação. Explique o que foi alterado e execute `npm test`."

- **Ajustar componente com acessibilidade**
  > "Revise `src/components/QuantityStepper.tsx`. Garanta que os botões continuem com `aria-label` e que o valor tenha `aria-live`. Não modifique o visual nem o reducer. Liste as mudanças."

- **Atualizar documentação após mudança**
  > "Compare o código atual com `PRD_SPEC.md` e `TECH_SPEC.md`. Ajuste apenas os trechos que ficaram desatualizados, sem descrever funcionalidades que não existem."

- **Revisão de tipos**
  > "Rode `npm run typecheck` e proponha correções mínimas para quaisquer erros, preservando as interfaces de `src/types.ts`."

- **Investigação de regressão**
  > "O badge do carrinho não atualiza após remover um item. Investigue `CartContext`, `cartReducer` e `Header`, proponha a causa antes de editar qualquer arquivo."

- **Gerar evidências**
  > "Com `npm run dev` ativo, execute `npm run evidence` e confirme quais PNGs foram gerados em `docs/evidence/`. Não afirme que uma pessoa já conferiu visualmente as imagens."

- **Preparar publicação**
  > "Confira `README.md` e `TASKS_SPEC.md`. Liste o que falta para publicar no Vercel/Netlify e o que depende de conferência humana, sem executar deploy."

Ao pedir algo ao assistente, inclua sempre o arquivo ou fluxo alvo e o critério de pronto.

---

## 5. O que deve ser revisado por humano

- Regras de negócio e valores monetários (R$ 9,90, R$ 5,00, limite de R$ 50,00).
- Textos legais, de marketing e de interface — especialmente "entrega rastreada" e prazo estimado, que hoje são textos estáticos.
- Mudanças em validação de CEP/UF e mensagens de erro.
- Mudanças em estrutura de providers e ordem de montagem em `App.tsx`.
- Qualquer nova dependência, script ou configuração de build/deploy.
- Exposição de dados, permissões, URLs públicas e conteúdo de repositório.
- Evidências visuais e links de publicação (a conferência visual e a publicação ainda não ocorreram).
- Registro de uso de IA em `docs/AI_USAGE.md`, incluindo limitações e falhas ocorridas.
- Diferenças entre documentação e comportamento real do aplicativo.

---

## 6. Proibições

- **Não inventar funcionalidades, dados, métricas, endpoints, usuários ou resultados de pesquisa.** Se uma informação não estiver no código ou em fonte confirmada, marque como pendente ou hipótese.
- **Não expor segredos:** tokens, chaves de API, credenciais, `.env` ou dados pessoais reais. Nunca versionar `node_modules`, `dist` ou arquivos `.env`.
- **Não afirmar que pagamento, rastreamento ou consulta de CEP são reais** — o pedido é fictício e não há integrações externas.
- **Não substituir revisão humana por output do assistente**, especialmente em regras financeiras e de acessibilidade.
- **Não afirmar que uma pessoa já revisou ou aprovou algo.** Até a confirmação explícita, registro apenas verificações automatizadas e marque a conferência humana como pendente.
- **Não apagar ou sobrescrever trabalho existente** sem entendê-lo e sem autorização.
- **Não prometer prazos de entrega reais** com base no texto estático da tela de sucesso.
- **Não usar a falha do gerador de imagem como justificativa para omitir o registro de uso de IA.**
- **Não ocultar limitações** de testes (jsdom não substitui navegador real).
- **Não executar deploy, push ou publicação** sem confirmação explícita da pessoa responsável.

---

## 7. Checklist de revisão do assistente

Antes de entregar qualquer alteração:

- [ ] Li os arquivos relacionados antes de editar.
- [ ] A mudança é compatível com React 18, TypeScript estrito e Vite 5.
- [ ] Nenhuma regra de negócio foi duplicada ou alterada sem solicitação.
- [ ] Novos controles são acessíveis por teclado e têm rótulo adequado.
- [ ] Textos e mensagens estão em pt-BR.
- [ ] `localStorage` continua protegido contra falhas.
- [ ] Documentação foi atualizada somente onde necessário.
- [ ] Nenhuma funcionalidade inexistente foi documentada como existente.
- [ ] Não afirmei que uma pessoa revisou ou aprovou algo; conferências humanas foram marcadas como pendentes.
- [ ] `npm run typecheck`, `npm test` e `npm run build` passaram.
- [ ] Diferenças relevantes foram explicadas na resposta final.

---

## 8. Comandos de referência

```bash
npm install
npm run dev
npm run build
npm test
npm run test:watch
npm run typecheck
```

Documentação relacionada: `PRD_SPEC.md`, `TECH_SPEC.md`, `TASKS_SPEC.md`, `README.md` e `docs/AI_USAGE.md`.
