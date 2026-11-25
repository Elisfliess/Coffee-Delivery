# Planejamento e Status das Tarefas — Coffee Delivery

| Campo | Informação |
| --- | --- |
| Versão do documento | 1.0 |
| Data | 2026-11-24 |
| Convenção | `[x]` concluído · `[ ]` pendente |
| Estimativas | Em horas de trabalho; são estimativas de planejamento, não medições de execução |

> Todo o código descrito aqui já foi implementado, as evidências visuais foram geradas e o repositório GitHub foi publicado. Pendem o deploy e a conferência humana de regras, textos, acessibilidade, imagens e registro de IA.

---

## 1. Visão consolidada

| Fase | Status | Estimativa | Resultado |
| --- | --- | --- | --- |
| 0. Fundação do projeto | Concluído | 2 h | Vite, TypeScript, scripts e configuração de testes |
| 1. Modelagem e catálogo | Concluído | 3 h | Tipos, 8 cafés, hero, filtros e cards |
| 2. Carrinho e estado | Concluído | 4 h | Reducer, context, persistência, drawer e resumo |
| 3. Tema e responsividade | Concluído | 3 h | Tema persistido, breakpoints e movimento reduzido |
| 4. Checkout e confirmação | Concluído | 5 h | Formulário Zod/RHF, pedido e página de sucesso |
| 5. Testes e validação | Concluído | 3 h | 15 testes, typecheck e build |
| 6. Documentação | Concluído | 3 h | PRD, TECH, TASKS, AGENTS, README e registro de IA |
| 7. Evidências visuais | Concluído | 1 h | 8 PNGs em `docs/evidence/` e script `npm run evidence` |
| 8. Publicação e conferência | **Parcialmente concluída** | 1 h | GitHub publicado; deploy, links de produção e validação por pessoa pendentes |

**Total estimado:** 25 h (24 h concluídas, 1 h pendente).

---

## 2. Fase 0 — Fundação do projeto — **Concluído** (≈ 2 h)

- [x] Criar `package.json` com scripts `dev`, `build`, `preview`, `test`, `test:watch`, `typecheck` e `evidence`.
- [x] Configurar Vite 5 com `@vitejs/plugin-react`.
- [x] Configurar TypeScript em modo estrito (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`).
- [x] Criar `index.html` com `lang="pt-BR"`, favicon `/logo.png`, viewport e descrição.
- [x] Configurar Vitest 2 com jsdom, `globals: true`, `setupFiles` e `css: true`.
- [x] Criar `.gitignore` para `node_modules`, `dist`, `.vite`, `coverage` e `.env`.
- [x] Instalar dependências com `npm install`.

**Critério de pronto:** servidor de desenvolvimento inicia e script de build compila sem erros.

---

## 3. Fase 1 — Modelagem e catálogo — **Concluído** (≈ 3 h)

- [x] Definir `Coffee`, `CoffeeCategory`, `CartItem`, `Address`, `Order`, `PaymentMethod` e `Theme` em `src/types.ts`.
- [x] Cadastrar 8 cafés com preço, descrição, tags, categoria e cores em `src/data/coffees.ts`.
- [x] Exportar `coffeeById` e a lista `categories` com `Todos`, `Expresso`, `Cremoso` e `Gelado`.
- [x] Criar `CoffeeIllustration.tsx` com SVG parametrizado por cor.
- [x] Criar `CoffeeCard.tsx` com tags, nome, descrição, preço e ação de adicionar.
- [x] Criar `HomePage.tsx` com hero, benefícios textuais, filtros com `aria-pressed` e grid.
- [x] Integrar a logo original criada pelo aluno como `public/logo.png` (substituindo o SVG provisório).

**Critério de pronto:** catálogo exibe 8 itens e os 4 filtros alteram a grade.

---

## 4. Fase 2 — Carrinho e estado — **Concluído** (≈ 4 h)

- [x] Implementar `cartReducer.ts` com ações `add`, `increment`, `decrement`, `remove`, `clear` e `hydrate`.
- [x] Implementar `CartContext.tsx` com itens, derivações de subtotal/taxa/total e `getOrderItems`.
- [x] Persistir e hidratar `coffee-delivery:cart:v1` com validação de itens.
- [x] Criar `QuantityStepper.tsx` com rótulos acessíveis e `aria-live`.
- [x] Criar `CartPanel.tsx` com estado vazio, lista, remoção, totais e dica de entrega grátis, com `showCheckoutButton` opcional para controlar o botão "Finalizar pedido".
- [x] Criar `UiContext.tsx` para controle de abertura do drawer.
- [x] Criar `CartDrawer.tsx` com dialog, backdrop, botão de fechar, Escape e bloqueio de scroll.
- [x] Criar `Header.tsx` com badge dinâmico e botão de abrir carrinho.
- [x] Exibir resumo lateral em `HomePage.tsx` e resumo no checkout.

**Critério de pronto:** adicionar, incrementar, decrementar, remover e recarregar preserva o estado correto.

---

## 5. Fase 3 — Tema e responsividade — **Concluído** (≈ 3 h)

- [x] Implementar `ThemeContext.tsx` com `light`/`dark`, `data-theme` no `<html>` e persistência.
- [x] Usar `prefers-color-scheme` como fallback quando não houver tema salvo.
- [x] Definir tokens de cores em `src/styles/global.css` para os dois temas.
- [x] Implementar breakpoints de 1024 px (esconde aside e empilha checkout), 720 px (hero em coluna, grid 2 colunas, filtros e header compacto) e 420 px (grid e formulário em 1 coluna).
- [x] Adicionar regra `prefers-reduced-motion`.
- [x] Criar `Layout.tsx` com shell, `Outlet`, rodapé, drawer e scroll to top.
- [x] Criar `Footer.tsx` com ano dinâmico.

**Critério de pronto:** tema alterna e persiste; layout se adapta aos quatro intervalos de largura.

---

## 6. Fase 4 — Checkout e confirmação — **Concluído** (≈ 5 h)

- [x] Implementar `lib/format.ts` com `formatCurrency`, `calculateDeliveryFee`, `formatCep` e `formatOrderId`.
- [x] Implementar `lib/checkoutSchema.ts` com validação de endereço e pagamento em pt-BR.
- [x] Implementar `OrderContext.tsx` com criação e persistência do último pedido.
- [x] Criar `CheckoutPage.tsx` com React Hook Form + `zodResolver`, máscaras, `aria-invalid` e erros por campo; resumo com `<CartPanel showCheckoutButton={false} />` e único botão "Confirmar pedido".
- [x] Bloquear checkout com carrinho vazio e oferecer link para o catálogo.
- [x] Ao enviar: criar pedido, limpar carrinho, fechar drawer e navegar com `replace: true`.
- [x] Criar `SuccessPage.tsx` com número do pedido, endereço, pagamento, itens e total.
- [x] Redirecionar `/sucesso` para `/` quando não houver último pedido.
- [x] Redirecionar rotas desconhecidas para a home em `App.tsx`.

**Critério de pronto:** fluxo completo do catálogo à confirmação funciona sem servidor.

---

## 7. Fase 5 — Testes e validação — **Concluído** (≈ 3 h)

- [x] Criar `src/test/setup.ts` com jest-dom, `cleanup()` e limpeza do storage.
- [x] Criar `src/test/utils.tsx` com `renderWithProviders` e `MemoryRouter`.
- [x] Escrever 5 testes para `cartReducer`.
- [x] Escrever 3 testes para utilitários de formatação.
- [x] Escrever 5 testes para `checkoutSchema`.
- [x] Escrever 2 testes de integração do carrinho e do tema.
- [x] Executar `npm test`: 4 arquivos e 15 testes aprovados.
- [x] Executar `npm run typecheck` e `npm run build` com sucesso.

**Critério de pronto:** suíte verde e build estático gerado em `dist/`.

---

## 8. Fase 6 — Documentação — **Concluído** (≈ 3 h)

- [x] `PRD_SPEC.md`: visão, personas, escopo, RF/RNF, regras, critérios Given/When/Then e fluxos.
- [x] `TECH_SPEC.md`: arquitetura, versões, estrutura, componentes, estado, tipos, validação, testes e decisões.
- [x] `TASKS_SPEC.md`: fases, checklist, status, estimativas e critérios de pronto.
- [x] `AGENTS.md`: diretrizes para uso de assistente de IA no projeto.
- [x] `README.md`: apresentação, execução, rotas, regras, testes, deploy e status.
- [x] `docs/AI_USAGE.md`: ferramentas, prompts, entregas, verificações automatizadas, pendências humanas e limitações (falha do gerador de imagem).
- [x] Conferir documentação com o código para não atribuir ao sistema funcionalidades não implementadas.

**Critério de pronto:** documentos em pt-BR, coerentes com o código e sem funcionalidades inventadas.

---

## 9. Fase 7 — Evidências visuais — **Concluído** (≈ 1 h)

- [x] Adicionar `playwright-core` como dependência de desenvolvimento e o script `npm run evidence` (`scripts/capture-evidence.mjs`).
- [x] Executar navegação automatizada em navegador (adicionar cafés, abrir/fechar carrinho, alternar tema).
- [x] Gerar e conferir automaticamente a presença das 8 capturas em `docs/evidence/`:
  - [x] `home-light.png` — catálogo desktop em tema claro.
  - [x] `cart-drawer.png` — carrinho aberto em drawer.
  - [x] `home-dark.png` — catálogo desktop em tema escuro.
  - [x] `checkout.png` — formulário de checkout.
  - [x] `success.png` — confirmação do pedido.
  - [x] `mobile-light.png` — catálogo mobile em tema claro.
  - [x] `mobile-cart.png` — carrinho mobile aberto.
  - [x] `mobile-dark.png` — catálogo mobile em tema escuro.
- [x] Referenciar todas as capturas no `README.md`.

**Critério de pronto:** 8 PNGs presentes e referenciados; capturas mobile regeneráveis com `npm run evidence`. A conferência visual por pessoa segue pendente na fase 8.

---

## 10. Fase 8 — Publicação e conferência — **Parcialmente concluída** (≈ 1 h)

- [x] Criar repositório GitHub e fazer o push do projeto (sem `node_modules` e `dist`): https://github.com/Elisfliess/Coffee-Delivery.
- [x] Preencher URL do repositório no `README.md`.
- [ ] Publicar no Vercel (ou Netlify) com `npm run build` e diretório `dist`.
- [ ] Preencher URL de deploy no `README.md`.
- [ ] Validar o deploy publicado com o checklist manual de `TECH_SPEC.md`.
- [ ] Confirmar humano: regras monetárias e textos de entrega/pagamento.
- [ ] Confirmar humano: acessibilidade e conteúdo das 8 evidências visuais.
- [ ] Confirmar humano: registro de uso de IA, links públicos e documentação final.

**Critério de pronto:** links ativos no README, fluxo principal validado no ambiente publicado e pendências humanas fechadas.

---

## 11. Convenções de estimativa

| Faixa | Interpretação |
| --- | --- |
| 1–2 h | Ajuste localizado ou configuração pontual. |
| 3–4 h | Implementação de componente ou fluxo completo com integração. |
| 5+ h | Fluxo de ponta a ponta com estado, validação e testes. |

As estimativas servem apenas para planejamento e comparação de fases. O status "Concluído" baseia-se no código existente e na verificação de build/testes, não no tempo efetivamente gasto.
