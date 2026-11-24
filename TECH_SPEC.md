# Especificação Técnica — Coffee Delivery

| Campo | Informação |
| --- | --- |
| Versão do documento | 1.0 |
| Data | 2026-11-24 |
| Status | Descreve a implementação atual |
| Código-fonte | `src/` |
| Build | `dist/` (gerado; ignorado pelo Git) |

> Este documento registra a arquitetura realmente adotada. Funcionalidades ou bibliotecas não presentes no `package.json` não são consideradas parte do projeto.

---

## 1. Visão geral da arquitetura

A aplicação é uma SPA React organizada em quatro camadas lógicas:

```
┌─────────────────────────────────────────────────────────────┐
│ Apresentação                                                │
│ App.tsx, pages/*, components/*, styles/global.css          │
│ Rotas, layout, telas, cards, formulário e drawer           │
├─────────────────────────────────────────────────────────────┤
│ Estado e interface                                          │
│ contexts/CartContext.tsx + cartReducer.ts                  │
│ contexts/OrderContext.tsx, ThemeContext.tsx, UiContext.tsx │
├─────────────────────────────────────────────────────────────┤
│ Domínio e regras                                            │
│ data/coffees.ts, lib/format.ts, lib/checkoutSchema.ts      │
│ types.ts                                                    │
├─────────────────────────────────────────────────────────────┤
│ Infraestrutura de execução                                  │
│ Vite 5, Vitest 2 + jsdom, TypeScript 5, npm scripts         │
│ playwright-core para captura de evidências (opcional)       │
└─────────────────────────────────────────────────────────────┘
```

Regras de dependência adotadas:

- Componentes consomem contexts por hooks (`useCart`, `useOrder`, `useTheme`, `useUi`); não recebem estado global por props.
- Regras de negócio puras ficam em `src/lib/` e podem ser testadas isoladamente.
- O catálogo é dado estático em `src/data/coffees.ts`; não há camada de rede.
- `localStorage` é acessado somente nos providers, com tratamento de falhas.

---

## 2. Tecnologias e versões

Versões declaradas em `package.json` (intervalos semver com `^`):

| Finalidade | Tecnologia | Versão declarada |
| --- | --- | --- |
| Interface | React / React DOM | `^18.3.1` |
| Roteamento | react-router-dom | `^6.26.2` |
| Tipagem | TypeScript | `^5.6.2` |
| Build e dev server | Vite | `^5.4.8` |
| Plugin React para Vite | @vitejs/plugin-react | `^4.3.1` |
| Formulário | react-hook-form | `^7.53.0` |
| Adaptador de validação | @hookform/resolvers | `^3.9.0` |
| Schema de validação | Zod | `^3.23.8` |
| Ícones | lucide-react | `^0.441.0` |
| Testes | Vitest | `^2.1.1` |
| Ambiente de testes | jsdom | `^25.0.0` |
| Utilitários de teste | @testing-library/react | `^16.0.1` |
| Interação de usuário em testes | @testing-library/user-event | `^14.5.2` |
| Assertivas DOM | @testing-library/jest-dom | `^6.4.8` |
| Captura de evidências | playwright-core | `^1.65.1` |
| Tipos React | @types/react / @types/react-dom | `^18.3.5` / `^18.3.0` |

**Importante:** o CSS é puro, com variáveis customizadas em `src/styles/global.css`. Não há Tailwind, CSS-in-JS, biblioteca de UI, estado global externo (Redux/Zustand) nem cliente HTTP. `playwright-core` é dependência de desenvolvimento usada apenas para gerar imagens; não é necessária para build, testes nem execução da aplicação.

---

## 3. Estrutura de pastas

```
.
├── public/
│   └── logo.svg                     # logo vetorial usada como favicon e no cabeçalho
├── src/
│   ├── main.tsx                     # ponto de entrada: createRoot + StrictMode
│   ├── App.tsx                      # providers + BrowserRouter + Routes
│   ├── types.ts                     # tipos compartilhados
│   ├── data/
│   │   └── coffees.ts               # 8 cafés, mapa por id e categorias
│   ├── lib/
│   │   ├── format.ts                # moeda, taxa de entrega, CEP e id do pedido
│   │   ├── format.test.ts
│   │   ├── checkoutSchema.ts        # schema Zod do checkout
│   │   └── checkoutSchema.test.ts
│   ├── contexts/
│   │   ├── CartContext.tsx          # estado do carrinho + derivações + persistência
│   │   ├── cartReducer.ts           # transições puras do carrinho
│   │   ├── cartReducer.test.ts
│   │   ├── OrderContext.tsx         # último pedido e criação do pedido
│   │   ├── ThemeContext.tsx         # tema claro/escuro
│   │   └── UiContext.tsx            # estado de abertura do drawer
│   ├── components/
│   │   ├── Header.tsx               # marca, localização, tema, carrinho
│   │   ├── Layout.tsx               # shell, Outlet, scroll to top, drawer
│   │   ├── Footer.tsx
│   │   ├── CartPanel.tsx            # lista, totais e botão opcional de finalizar
│   │   ├── CartDrawer.tsx           # overlay/dialog do carrinho
│   │   ├── CoffeeCard.tsx           # card do catálogo
│   │   ├── CoffeeIllustration.tsx   # SVG paramétrico da embalagem
│   │   └── QuantityStepper.tsx      # controle de quantidade reutilizável
│   ├── pages/
│   │   ├── HomePage.tsx             # hero, filtros, catálogo e aside
│   │   ├── CheckoutPage.tsx         # formulário + resumo
│   │   └── SuccessPage.tsx          # confirmação do pedido
│   ├── styles/
│   │   └── global.css               # design tokens, componentes e media queries
│   ├── test/
│   │   ├── setup.ts                 # jest-dom, cleanup e limpeza do storage
│   │   ├── utils.tsx                # renderWithProviders com MemoryRouter
│   │   └── cartFlow.test.tsx        # testes de integração do carrinho/tema
│   └── vite-env.d.ts
├── docs/
│   ├── AI_USAGE.md                  # registro de uso de IA
│   └── evidence/                    # 8 capturas (desktop, drawer, checkout, mobile)
│       ├── home-light.png
│       ├── cart-drawer.png
│       ├── home-dark.png
│       ├── checkout.png
│       ├── success.png
│       ├── mobile-light.png
│       ├── mobile-cart.png
│       └── mobile-dark.png
├── scripts/
│   └── capture-evidence.mjs         # capturas mobile com playwright-core + Chrome
├── index.html                       # idioma pt-BR, favicon e metadados
├── vite.config.ts                    # plugin React + configuração Vitest/jsdom
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json / package-lock.json
├── PRD_SPEC.md
├── TECH_SPEC.md
├── TASKS_SPEC.md
├── AGENTS.md
└── README.md
```

---

## 4. Responsabilidades dos componentes

| Arquivo | Responsabilidade | Detalhes relevantes |
| --- | --- | --- |
| `src/main.tsx` | Montar a aplicação. | `createRoot` em `#root`, `StrictMode` e import do CSS global. |
| `src/App.tsx` | Definir providers e rotas. | Ordem: `ThemeProvider → CartProvider → OrderProvider → UiProvider → BrowserRouter`. Rota `*` renderiza `HomePage`. |
| `components/Layout.tsx` | Shell comum. | `Header`, `Outlet`, `Footer` e `CartDrawer`; `window.scrollTo({ top: 0 })` a cada mudança de `pathname`. |
| `components/Header.tsx` | Ações globais. | Link para `/`, logo, texto "Entregar em Brasil", botão de tema e botão de carrinho com badge. |
| `components/Footer.tsx` | Rodapé estático. | Ano atual e texto "Projeto final · Single Page Application". |
| `components/CoffeeCard.tsx` | Apresentar e controlar um café. | Lê a quantidade atual pelo `coffeeId`; alterna entre botão "Adicionar" e `QuantityStepper`. |
| `components/CoffeeIllustration.tsx` | Gerar SVG da embalagem. | Recebe `coffee.color` e `coffee.accent`; `role="img"` com `aria-label` do produto. |
| `components/QuantityStepper.tsx` | Controle reutilizável de quantidade. | Botões com `aria-label` específicos e valor com `aria-live="polite"`; variante `compact`. |
| `components/CartPanel.tsx` | Resumo do carrinho. | Estado vazio, lista de itens, remoção, totais e dica de entrega grátis. Aceita `showCheckoutButton` (padrão `true`); quando `true`, exibe "Finalizar pedido", que fecha o drawer e navega para `/checkout`. |
| `components/CartDrawer.tsx` | Modal do carrinho. | `role="dialog"`, `aria-modal="true"`, backdrop, botão de fechar, Escape e bloqueio de `body.overflow`. |
| `pages/HomePage.tsx` | Catálogo. | Estado local `activeCategory`, `useMemo` para filtrar, hero, benefícios textuais, grid e aside com `CartPanel` (com botão de finalizar). |
| `pages/CheckoutPage.tsx` | Checkout. | `useForm` + `zodResolver`, máscaras, estado vazio, envio com criação de pedido, limpeza e navegação. Renderiza `<CartPanel showCheckoutButton={false} />`: o resumo não repete "Finalizar pedido" e o envio é feito apenas pelo botão "Confirmar pedido". |
| `pages/SuccessPage.tsx` | Confirmação. | Lê `lastOrder`; redireciona para `/` se ausente; rótulos de pagamento e total pago. |

---

## 5. Fluxo de estado

### 5.1 Árvore de providers

```
ThemeProvider        → tema + persistência em coffee-delivery:theme:v1
└── CartProvider     → itens + totais + persistência em coffee-delivery:cart:v1
    └── OrderProvider → último pedido em coffee-delivery:last-order:v1
        └── UiProvider → isCartOpen (somente memória)
            └── BrowserRouter → Layout → páginas
```

### 5.2 Chaves de armazenamento

| Chave | Formato | Leitura | Escrita |
| --- | --- | --- | --- |
| `coffee-delivery:cart:v1` | `CartItem[]` | `readStoredCart()`: valida array, `coffeeId` existente e `quantity` inteiro positivo | `useEffect` a cada mudança de `items` |
| `coffee-delivery:theme:v1` | `"light"` ou `"dark"` | `getInitialTheme()`: valor salvo ou `prefers-color-scheme` | `useEffect` a cada mudança de `theme`, além de `document.documentElement.dataset.theme` |
| `coffee-delivery:last-order:v1` | `Order` serializado | `readStoredOrder()` na inicialização do provider | `createOrder()` |
| — (memória) | `boolean` | `UiContext` | `openCart()` / `closeCart()` |

Todas as operações de storage usam `try/catch`; valores corrompidos ou indisponíveis não quebram a aplicação.

### 5.3 Carrinho (`useReducer`)

Estado: `CartItem[]`, inicializado pela função `readStoredCart` (hydratation eager).

Ações definidas em `cartReducer.ts`:

| Ação | Efeito |
| --- | --- |
| `add` | Se o café já existe, incrementa 1; caso contrário, insere com quantidade 1. |
| `increment` | Aumenta a quantidade do `coffeeId` informado. |
| `decrement` | Diminui 1 e remove itens cuja quantidade chega a zero. |
| `remove` | Remove o item do `coffeeId`. |
| `clear` | Esvazia o carrinho. |
| `hydrate` | Remove duplicatas por `coffeeId` e quantidades inválidas; ação disponível no reducer, não despachada pelo provider (a hidratção é feita na inicialização). |

Valores derivados em `CartContext` com `useMemo`:

- `subtotal = Σ (preço do café × quantidade)`;
- `itemCount = Σ quantidades`;
- `deliveryFee = calculateDeliveryFee(subtotal)`;
- `total = subtotal + deliveryFee`;
- `getOrderItems()`: converte itens em `OrderItem`, anexando `name` e `unitPrice` a partir do catálogo.

`addCoffee` valida a existência do `coffeeId` no mapa `coffeeById` antes de despachar a ação.

### 5.4 Pedido

`createOrder(items, address, paymentMethod)`:

1. Recalcula o subtotal a partir de `unitPrice × quantity` dos itens recebidos.
2. Gera `id` com `formatOrderId(new Date())` (`CD-AAAAMMDD-NNNN`).
3. Calcula taxa com `calculateDeliveryFee(subtotal)`.
4. Registra `createdAt` em ISO 8601.
5. Atualiza `lastOrder` em memória e grava no storage.
6. Retorna o pedido criado.

O `CheckoutPage` chama `createOrder`, `clear()` (carrinho), `closeCart()` e `navigate('/sucesso', { replace: true })`. Se `createOrder` lançar exceção, exibe mensagem de erro genérica.

### 5.5 Tema e UI

- `ThemeContext` mantém `theme: 'light' | 'dark'`, aplica `data-theme` em `<html>` e alterna o valor por `toggleTheme`.
- `UiContext` mantém apenas `isCartOpen`, sem persistência.
- Hooks lançam erro explícito se usados fora de seus providers, facilitando diagnóstico.

---

## 6. Modelagem de tipos

Definida em `src/types.ts`. `CoffeeCategory` é uma união de literais; os filtros oferecidos na interface vêm de `categories` em `src/data/coffees.ts`: `Todos`, `Expresso`, `Cremoso` e `Gelado`.

```ts
export interface Coffee {
  id: string
  name: string
  description: string
  price: number
  tags: string[]
  category: CoffeeCategory
  color: string    // cor principal da ilustração
  accent: string   // cor do rótulo
}

export interface CartItem {
  coffeeId: string
  quantity: number
}

export type PaymentMethod = 'credit' | 'debit' | 'cash'

export interface Address {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface OrderItem extends CartItem {
  name: string
  unitPrice: number
}

export interface Order {
  id: string
  items: OrderItem[]
  address: Address
  paymentMethod: PaymentMethod
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
}

export type Theme = 'light' | 'dark'
```

Decisões de modelagem:

- `CartItem` guarda apenas referência e quantidade; nome e preço são resolvidos pelo catálogo no momento da leitura.
- `OrderItem` congela nome e preço unitário no pedido, preservando o valor da compra mesmo que o catálogo mude depois.
- `CheckoutFormValues` é inferido do schema Zod (`z.infer`), evitando duplicação entre validação e formulário.
- `CategoryFilter` em `HomePage` é inferido de `categories`, mantendo os filtros alinhados aos dados.

---

## 7. Validação e formatação

### 7.1 Schema Zod (`lib/checkoutSchema.ts`)

| Campo | Regra | Mensagem |
| --- | --- | --- |
| `cep` | `trim()` + regex `/^\d{5}-?\d{3}$/` | "Informe um CEP válido (00000-000)" |
| `street` | `trim()` + mínimo 3 | "Informe a rua ou avenida" |
| `number` | `trim()` + mínimo 1 | "Informe o número" |
| `complement` | `trim()`, máximo 80, opcional | "Máximo de 80 caracteres" |
| `neighborhood` | `trim()` + mínimo 2 | "Informe o bairro" |
| `city` | `trim()` + mínimo 2 | "Informe a cidade" |
| `state` | `trim()`, exatamente 2 letras A-Za-z | "Use a sigla do estado (UF)" |
| `paymentMethod` | `enum(['credit', 'debit', 'cash'])` | "Selecione uma forma de pagamento" |

O resolver `@hookform/resolvers/zod` liga o schema ao `useForm`. O formulário usa `noValidate`, deixando a validação para o Zod. CEP e UF têm transformações no evento `onChange` registrado pelo React Hook Form: `formatCep` insere o hífen após 5 dígitos e `toUpperCase()` normaliza a UF.

### 7.2 Utilitários (`lib/format.ts`)

| Função | Comportamento |
| --- | --- |
| `formatCurrency(value)` | `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. |
| `calculateDeliveryFee(subtotal)` | Retorna `0` se `subtotal >= 50` ou `subtotal === 0`; caso contrário, `5`. |
| `formatCep(value)` | Remove não dígitos, limita a 8 caracteres e insere hífen após o quinto dígito. |
| `formatOrderId(date)` | `CD-` + `YYYYMMDD` (UTC via `toISOString`) + `-` + inteiro aleatório de 1000 a 9999. |

Constantes exportadas: `FREE_DELIVERY_THRESHOLD = 50` e `DELIVERY_FEE = 5`.

---

## 8. Estratégia de testes

### 8.1 Configuração

`vite.config.ts` usa `defineConfig` de `vitest/config`, plugin React e:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.ts',
  css: true,
}
```

`src/test/setup.ts` importa `@testing-library/jest-dom/vitest`, executa `cleanup()` e `localStorage.clear()` após cada teste. `src/test/utils.tsx` expõe `renderWithProviders`, que embrulha a UI em `ThemeProvider → CartProvider → OrderProvider → UiProvider → MemoryRouter`.

### 8.2 Suíte atual (4 arquivos, 15 testes)

| Arquivo | Tipo | Casos cobertos |
| --- | --- | --- |
| `src/contexts/cartReducer.test.ts` | Unitário | adicionar, incrementar existente, decrementar até remover, remover/limpar, hidratar descartando duplicatas e quantidades inválidas (5 testes). |
| `src/lib/format.test.ts` | Unitário | formatação BRL, taxa de entrega (20 → 5; 50 → 0; 0 → 0) e máscara de CEP (3 testes). |
| `src/lib/checkoutSchema.test.ts` | Unitário | endereço válido, CEP inválido, UF inválida, pagamento desconhecido, CEP sem máscara e complemento opcional (5 testes). |
| `src/test/cartFlow.test.tsx` | Integração | adicionar/incrementar/persistir carrinho e alternar tema (2 testes). |

Resultado verificado no estado entregue: **4 arquivos aprovados, 15 testes aprovados**. Durante a execução aparecem avisos do React Router sobre future flags da v7; não são falhas de teste.

### 8.3 Comandos

```bash
npm install
npm run dev         # servidor de desenvolvimento Vite
npm run build       # tsc -b && vite build
npm run preview     # serve o build localmente
npm test            # vitest run (execução única)
npm run test:watch  # vitest em modo watch
npm run typecheck   # tsc --noEmit
npm run evidence    # capturas mobile (requer npm run dev e Chrome instalado)
```

### 8.4 Checklist de verificação manual

Executar após alterações que afetem interface ou estado:

- [ ] `npm run typecheck` sem erros.
- [ ] `npm test` com 15 testes aprovados.
- [ ] `npm run build` conclui e gera `dist/`.
- [ ] `npm run dev`: catálogo mostra 8 cafés e os 4 filtros (`Todos`, `Expresso`, `Cremoso`, `Gelado`).
- [ ] Filtro `Gelado` mostra apenas `Expresso Gelado`.
- [ ] Adicionar 1 café: badge mostra `1 item`, entrega R$ 5,00, total R$ 14,90.
- [ ] Adicionar até 6 cafés: entrega passa a "Grátis".
- [ ] Recarregar a página: carrinho permanece.
- [ ] Abrir drawer, fechar por Escape, backdrop e botão; corpo volta a rolar.
- [ ] Alternar tema, recarregar e conferir persistência.
- [ ] Acessar `/checkout` com carrinho vazio: ver estado vazio.
- [ ] Enviar formulário vazio: ver erros de CEP, rua, número, bairro, cidade, UF e pagamento.
- [ ] Preencher CEP `01310100`: campo passa a `01310-100`; UF vira maiúscula.
- [ ] Confirmar pedido: carrinho limpo, `/sucesso` exibe número, endereço, pagamento e total; no checkout existe apenas o botão "Confirmar pedido".
- [ ] Acessar `/sucesso` em nova sessão sem pedido: redireciona para `/`.
- [ ] Testar larguras 1024 px, 720 px e 420 px, conferindo aside, grid e formulário.
- [ ] Ativar preferência de movimento reduzido no sistema: animações são minimizadas.

### 8.5 Evidências visuais automatizadas

O script `scripts/capture-evidence.mjs` usa `playwright-core` com o Chrome instalado no sistema para abrir a aplicação em viewport mobile (390 × 844), percorrer o fluxo de adicionar cafés, abrir/fechar o carrinho e alternar o tema. Pré-requisitos: `npm run dev` em execução e Chrome disponível; `BASE_URL` e `CHROME_PATH` podem sobrescrever os padrões. Ele gera `docs/evidence/mobile-light.png`, `docs/evidence/mobile-cart.png` e `docs/evidence/mobile-dark.png`.

As demais capturas (`home-light.png`, `cart-drawer.png`, `home-dark.png`, `checkout.png` e `success.png`) também estão presentes em `docs/evidence/`. A conferência visual final dessas imagens por uma pessoa ainda está pendente; o script apenas automatiza a navegação e a captura.

---

## 9. Decisões técnicas

| Decisão | Justificativa | Trade-off |
| --- | --- | --- |
| Context API + `useReducer` para carrinho | Estado compartilhado entre cards, header, drawer e páginas sem dependência externa; reducer mantém transições puras e testáveis. | Re-renderizações de consumidores do context; aceitável para a escala atual. |
| Contexts separados (tema, pedido, UI) | Isola motivos de mudança e evita acoplar abertura do drawer a dados de domínio. | Mais providers em `App.tsx`. |
| Hidratação eager com validação em `readStoredCart` | Evita renderizar estado inválido e descarta dados corrompidos antes do primeiro paint. | Lógica de validação duplicada em parte com `hydrate` do reducer. |
| Zod + React Hook Form | Schema único como fonte da verdade de validação e tipos inferidos; mensagens em pt-BR. | Dependências adicionais. |
| CSS puro com variáveis | Tema claro/escuro por `data-theme`, sem etapa de build de estilos. | Estilos centralizados em um arquivo extenso. |
| SVG em código para ilustrações e logo | Vetores leves, escaláveis e parametrizáveis por café; sem assets binários. | Ilustrações são abstratas, não fotos de produto. |
| `localStorage` versionado (`v1`) | Permite futura migração de formato sem conflito com chaves antigas. | Dados ficam restritos ao navegador/dispositivo. |
| Rota `*` para home | Navegação tolerante a URLs inválidas em uma SPA estática. | Erros de digitação não exibem página 404. |
| Vitest + jsdom | Configuração integrada ao Vite e rápida para testes de componentes com Testing Library. | Não substitui validação em navegador real (ver checklist manual). |
| `playwright-core` apenas para evidências | Gera capturas mobile em Chrome instalado sem baixar navegadores; fica isolado em `devDependencies` e em `scripts/capture-evidence.mjs`. | Exige Chrome local e servidor de dev ativo; não é suíte de testes nem afeta o build. |
| `showCheckoutButton={false}` no checkout | Evita dois botões de avanço no resumo: o catálogo/drawer usa "Finalizar pedido" e o checkout usa "Confirmar pedido" dentro do `<form>`. | `CartPanel` passou a ter uma prop opcional, com valor padrão preservando o uso anterior. |

---

## 10. Possíveis evoluções (não implementadas)

Lista de trabalho futuro, mantida separada do escopo entregue:

1. Backend/API para catálogo, pedidos e autenticação.
2. Gateway de pagamento real e novas formas (PIX, boleto).
3. Consulta de CEP via serviço externo com preenchimento automático.
4. Rastreamento de entrega e prazo calculado, substituindo os textos estáticos.
5. Histórico de pedidos e recompra de um pedido anterior.
6. Busca textual, ordenação e mais categorias com cafés cadastrados.
7. Estoque, cupons e regras de frete por região.
8. Suíte de testes end-to-end e testes de acessibilidade automatizados (hoje `playwright-core` é usado somente para capturar evidências).
9. Internacionalização e PWA.
10. Extração de estilos por componente e design tokens em arquivo dedicado.

---

## 11. Referência rápida de execução

```bash
npm install
npm run dev
# Abrir o endereço indicado pelo Vite (normalmente http://localhost:5173)
```

Deploy estático: executar `npm run build` e publicar o diretório `dist/`. Para rotas profundas do React Router, o repositório inclui `vercel.json` (rewrite para `/index.html`) e `public/_redirects` (fallback da Netlify). Instruções detalhadas em `README.md`.
