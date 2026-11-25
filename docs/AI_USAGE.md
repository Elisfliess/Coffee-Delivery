# Registro de uso de IA — Coffee Delivery

| Campo | Informação |
| --- | --- |
| Projeto | Coffee Delivery — SPA de cafeteria fictícia |
| Data do registro | 2026-11-24 |
| Ferramenta principal | OpenCode |
| Modelo | Big Pickle |
| Escopo | Planejamento, arquitetura, escrita de código, revisão de tipos, testes e documentação |
| Natureza dos dados | Projeto fictício; nenhum dado real de cliente ou pagamento |

> Os prompts abaixo são **representativos**: reconstruem os pedidos feitos ao assistente de forma legível para registro. Não são transcrições literais integrais da conversa.

---

## 1. Ferramentas e finalidades

| Ferramenta / recurso | Finalidade | Resultado |
| --- | --- | --- |
| OpenCode (modelo Big Pickle) | Apoiar decisões de arquitetura e dividir o trabalho em fases. | Estrutura em camadas, lista de arquivos e sequência de implementação. |
| OpenCode (modelo Big Pickle) | Escrever e revisar componentes React/TypeScript. | Código em `src/`, incluindo contexts, páginas e componentes. |
| OpenCode (modelo Big Pickle) | Revisar tipos e regras de negócio. | Tipagem estrita em `src/types.ts`, `lib/format.ts` e `lib/checkoutSchema.ts`. |
| OpenCode (modelo Big Pickle) | Escrever testes e executar a suíte. | 4 arquivos de teste, 15 testes aprovados com Vitest + Testing Library. |
| OpenCode (modelo Big Pickle) | Produzir documentação do projeto. | `PRD_SPEC.md`, `TECH_SPEC.md`, `TASKS_SPEC.md`, `AGENTS.md`, `README.md` e este registro. |
| Gerador de imagem de IA | Tentativa de criar a logomarca. | **Falhou** por credencial inválida; não gerou asset utilizado. |
| Autor do projeto (aluno) | Criar a logomarca definitiva. | `public/logo.png`: arquivo PNG criado pelo aluno, integrado ao cabeçalho e ao favicon pelo assistente. |
| Assistente de IA de desenvolvimento | Integrar a logo e adaptar a documentação. | Substituição do asset provisório, ajuste de caminhos e registro da autoria real. |

### 1.1 Sobre a logo

A identidade visual final **não** veio do gerador de imagem de IA. Após a falha de autenticação da ferramenta, o próprio autor do projeto criou a logo e forneceu o arquivo `logo_cafeteria.png`, que foi versionado como `public/logo.png`:

- `public/logo.png` — usado como favicon e no cabeçalho.
- `src/components/CoffeeIllustration.tsx` — ilustração vetorial paramétrica de cada embalagem, com cores vindas de `src/data/coffees.ts`, criada com apoio do assistente e mantida como complemento visual.

A autoria da logomarca é do aluno; a IA atuou apenas na integração técnica e na documentação.

---

## 2. Prompts representativos

### 2.1 Planejamento

> "Planeje uma SPA de e-commerce de cafeteria fictícia com React 18, TypeScript e Vite. Liste as pastas, os arquivos, as rotas `/`, `/checkout` e `/sucesso` e as fases de implementação. Não inclua backend nem pagamento real."

**Resultado:** arquitetura em camadas, providers, catálogo em dados estáticos e divisão em fases que originou `TASKS_SPEC.md`.

### 2.2 Carrinho e persistência

> "Implemente um carrinho com Context API e useReducer. As ações devem adicionar, incrementar, decrementar e remover itens. Persista em `localStorage` na chave `coffee-delivery:cart:v1`, valide os dados lidos e mantenha o funcionamento em memória caso o storage falhe."

**Resultado:** `CartContext.tsx`, `cartReducer.ts` e testes de redução/hidratação.

### 2.3 Regras de entrega

> "Crie utilitários de formatação em pt-BR: moeda BRL, CEP com hífen e id de pedido. A taxa de entrega deve ser R$ 5,00 para subtotal entre zero e R$ 50,00, e gratuita para subtotal maior ou igual a R$ 50,00 ou carrinho vazio."

**Resultado:** `src/lib/format.ts` e `src/lib/format.test.ts`.

### 2.4 Checkout validado

> "Monte um formulário de checkout com React Hook Form e Zod. Valide CEP no formato 00000-000, rua, número, bairro, cidade, UF de duas letras e forma de pagamento obrigatória entre crédito, débito e dinheiro. Complemento é opcional com até 80 caracteres. Mensagens em português."

**Resultado:** `src/lib/checkoutSchema.ts`, `src/pages/CheckoutPage.tsx` e `src/lib/checkoutSchema.test.ts`.

### 2.5 Testes

> "Escreva testes unitários para o reducer e para os utilitários, e um teste de integração que adicione um café, aumente a quantidade e verifique o `localStorage`. Use Vitest, Testing Library e limpe o storage entre testes."

**Resultado:** suíte com 15 testes aprovados; `renderWithProviders` com `MemoryRouter` em `src/test/utils.tsx`.

### 2.6 Documentação sem invenção

> "Documente o projeto em pt-BR usando apenas funcionalidades presentes no código. Se algo não existir, como rastreamento real ou pagamento online, diga explicitamente que está fora de escopo. Inclua critérios Given/When/Then e o registro da falha do gerador de imagem."

**Resultado:** documentação com escopo, regras, critérios de aceite e limitações registradas.

### 2.7 Evidências visuais

> "Com `npm run dev` ativo, execute `npm run evidence` usando `playwright-core` e o Chrome instalado. Gere as capturas mobile, relacione os arquivos criados e deixe claro que a conferência visual final ainda depende de uma pessoa."

**Resultado:** `scripts/capture-evidence.mjs`, script `npm run evidence` e capturas em `docs/evidence/`.

---

## 3. Entregas geradas com apoio da IA

| Entrega | Arquivos | Observação |
| --- | --- | --- |
| Fundação e configuração | `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `.gitignore` | Scripts de dev/build/test/typecheck/evidence. |
| Modelagem e catálogo | `src/types.ts`, `src/data/coffees.ts` | 8 cafés, categorias e mapa por id. |
| Interface | `src/App.tsx`, `src/main.tsx`, `src/components/*`, `src/pages/*`, `src/styles/global.css` | Rotas, layout, cards, drawer, checkout e confirmação. |
| Estado e regras | `src/contexts/*`, `src/lib/format.ts`, `src/lib/checkoutSchema.ts` | Carrinho, pedido, tema, UI, formatação e validação. |
| Identidade visual | `public/logo.png`, `src/components/CoffeeIllustration.tsx` | Logo criada pelo aluno; ilustrações de embalagens com apoio do assistente; gerador de imagem não foi usado no resultado final. |
| Testes | `src/test/*`, `src/lib/*.test.ts`, `src/contexts/cartReducer.test.ts` | 15 testes aprovados. |
| Evidências visuais | `scripts/capture-evidence.mjs`, `docs/evidence/*.png` | 8 capturas presentes; as mobile são regeneráveis com `npm run evidence`. |
| Documentação | `PRD_SPEC.md`, `TECH_SPEC.md`, `TASKS_SPEC.md`, `AGENTS.md`, `README.md`, `docs/AI_USAGE.md` | Ajustada para refletir apenas o implementado e as pendências de conferência humana. |

---

## 4. Revisão e validação

Até este registro, a conferência foi feita pelo próprio assistente de IA. **Nada nesta seção significa que uma pessoa já revisou ou aprovou a entrega.** A conferência humana ainda deve acontecer.

### 4.1 Verificações automatizadas executadas

| Verificação | Meio | Resultado registrado |
| --- | --- | --- |
| Tipagem | `npm run typecheck` | Executado sem erros. |
| Build | `npm run build` | `tsc -b` + `vite build` concluídos; `dist/` gerado. |
| Testes unitários e de integração | `npm test` | 4 arquivos, 15 testes aprovados. |
| Navegação manual automatizada em navegador | `playwright-core` com Chrome via `scripts/capture-evidence.mjs` | Fluxo automatizado: adicionar cafés, abrir/fechar carrinho e alternar tema; capturas salvas. |
| Conferência de coerência documental | Assistente comparou documentos ao código | Documentos ajustados aos filtros atuais, ao botão único do checkout e às evidências geradas. |

Essas verificações não substituem a avaliação humana.

### 4.2 Itens que dependem de confirmação humana

- **Regras monetárias:** preço de R$ 9,90, taxa de R$ 5,00, limite de R$ 50,00 e exemplos de total.
- **Textos:** mensagens de erro, textos de marketing, "entrega rastreada" e o prazo estático de "20 a 40 minutos".
- **Acessibilidade:** rótulos, estados de erro, navegação por teclado, dialog e movimento reduzido.
- **Evidências visuais:** conteúdo das 8 capturas em `docs/evidence/` (`home-light.png`, `cart-drawer.png`, `home-dark.png`, `checkout.png`, `success.png`, `mobile-light.png`, `mobile-cart.png`, `mobile-dark.png`).
- **Links públicos e publicação:** repositório GitHub, deploy e URLs preenchidas no `README.md`.
- **Registro de IA:** exatidão dos prompts representativos, das entregas atribuídas ao assistente e das limitações descritas.

Nenhum desses itens foi marcado como aprovado por pessoa neste documento.

---

## 5. Limitações encontradas

| Limitação | Impacto | Como foi tratada |
| --- | --- | --- |
| Gerador de imagem indisponível (credencial inválida) | Não foi possível produzir a logo por IA de imagem. | Logo criada pelo autor do projeto e integrada como `public/logo.png`; registro mantido neste documento. |
| Ausência de backend | Dados são locais e não persistem entre dispositivos. | Escopo documentado como fictício; armazenamento versionado por navegador. |
| Testes em jsdom | Não validam renderização real nem interação visual por conta própria. | Checklist em `TECH_SPEC.md` e navegação automatizada em navegador; 8 evidências foram geradas em `docs/evidence/` (`home-light.png`, `cart-drawer.png`, `home-dark.png`, `checkout.png`, `success.png`, `mobile-light.png`, `mobile-cart.png`, `mobile-dark.png`), pendentes de conferência visual humana. |
| Avisos do React Router sobre future flags da v7 | Aparecem no stderr dos testes; não são falhas. | Registrados em `TECH_SPEC.md` como avisos, sem alteração de configuração. |
| Texto de prazo "20 a 40 minutos" | Pode sugerir cálculo que não existe. | Explicitado como texto estático em PRD, README e diretrizes de IA. |
| Modelo pode cometer erros | Risco de código ou documentação inconsistentes. | Verificação por tipos, testes, navegação automatizada, regras em `AGENTS.md` e conferência humana ainda pendente. |

---

## 6. Boas práticas adotadas

- **Escopo explícito:** separar o que existe do que é evolução futura em todos os documentos.
- **Prompts com restrições:** indicar arquivos alvo, regras de negócio e o que não fazer (por exemplo, "sem pagamento real").
- **Fontes da verdade:** catálogo em `data/coffees.ts`, preço e entrega em `lib/format.ts`, validação em `lib/checkoutSchema.ts`; a IA não inventou valores paralelos.
- **Validação automática:** testes, typecheck, build e navegação automatizada em navegador após mudanças relevantes; nada disso é apresentado como aprovação humana.
- **Transparência:** falha da geração de imagem registrada, assim como a autoria da logo pelo aluno e as limitações dos testes.
- **Conferência humana pendente:** regras em `AGENTS.md` indicam o que ainda precisa de validação por pessoa em código, acessibilidade, segurança, documentação e publicação.
- **Sem segredos:** nenhuma credencial, token ou dado pessoal real foi incluído em código, documentação ou prompts registrados.
- **Documentação como espelho do código:** ao revisar um documento, confrontar com a implementação antes de afirmar algo como concluído.

---

## 7. Referência cruzada

- Regras para assistentes: `../AGENTS.md`
- Produto e critérios de aceite: `../PRD_SPEC.md`
- Arquitetura e testes: `../TECH_SPEC.md`
- Status e tarefas pendentes: `../TASKS_SPEC.md`
- Visão geral e execução: `../README.md`
