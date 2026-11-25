# PRD — Especificação do Produto: Coffee Delivery

| Campo | Informação |
| --- | --- |
| Produto | Coffee Delivery — e-commerce SPA de cafeteria fictícia |
| Versão do documento | 1.0 |
| Data | 2026-11-24 |
| Status | Implementado; documentação elaborada a partir do código existente |
| Plataforma | Aplicação web (Single Page Application), navegador, idioma pt-BR |

> Este documento descreve o que **foi implementado**, não um plano de funcionalidades futuras. Itens fora de escopo estão sinalizados explicitamente para evitar interpretações incorretas.

---

## 1. Visão do produto

O Coffee Delivery é uma loja online fictícia de cafés especiais. O cliente navega por um catálogo de oito cafés, monta seu pedido em um carrinho, informa um endereço de entrega e escolhe uma forma de pagamento. Ao confirmar, recebe uma tela de confirmação com os dados do pedido.

A proposta é demonstrar, em uma aplicação completa de front-end, os fluxos essenciais de um e-commerce: catálogo com filtros, carrinho com persistência local, formulário validado, resumo do pedido e confirmação. Não há servidor, pagamento real nem operação logística: todos os dados são locais ao navegador.

### 1.1 Objetivos do produto

- Permitir ao usuário encontrar um café por categoria e adicioná-lo ao pedido em poucas interações.
- Manter o carrinho disponível entre recarregamentos da página.
- Deixar claro, antes da confirmação, o subtotal, a taxa de entrega e o total.
- Coletar endereço e forma de pagamento com validação imediata e mensagens em português.
- Fornecer uma confirmação legível com número do pedido, itens, endereço e total.

### 1.2 Indicadores observáveis no produto

Não há telemetria implementada. Os resultados são observáveis diretamente na interface e nos testes automatizados: catálogo de 8 itens, 4 filtros, carrinho persistido, tema persistido e 15 testes automatizados aprovados.

---

## 2. Público-alvo e personas

As personas abaixo são hipóteses de produto usadas para justificar decisões de interface; não representam dados de pesquisa coletados.

### Persona A — Cliente recorrente

Conhece os cafés e quer repetir um pedido rapidamente. Precisa ver preços, quantidades e o total sem sair do catálogo. Beneficia-se do resumo lateral em telas grandes e do badge de itens no cabeçalho.

### Persona B — Cliente em primeira compra

Ainda está decidindo qual café escolher. Usa os filtros de categoria, lê descrições e tags e confere a regra de entrega grátis antes de finalizar. Beneficia-se das mensagens de validação do formulário.

### Persona C — Usuário em dispositivo móvel

Navega com uma mão, em telas estreitas. Precisa que os cards se reorganizem, que o carrinho abra em um painel sobreposto e que o formulário seja preenchido em uma coluna.

---

## 3. Escopo

### 3.1 Escopo incluído (entregue)

1. Catálogo com 8 cafés cadastrados em código e filtros por categoria: `Todos`, `Expresso`, `Cremoso` e `Gelado`.
2. Cards com ilustração vetorial, tags, nome, descrição, preço e controle de quantidade.
3. Carrinho com adicionar, incrementar, decrementar, remover e limpar.
4. Resumo do carrinho em aside no catálogo (desktop) e dentro do checkout.
5. Drawer do carrinho aberto pelo cabeçalho, com backdrop, botão de fechar e tecla Escape.
6. Persistência do carrinho, do tema e do último pedido em `localStorage`.
7. Tema claro/escuro com preferência do sistema como fallback.
8. Formulário de checkout com endereço e forma de pagamento, validado por Zod.
9. Criação de pedido fictício com número, data, itens e valores consolidados.
10. Página de confirmação com dados do último pedido.
11. Rotas `/`, `/checkout`, `/sucesso` e redirecionamento de rotas desconhecidas para a home.
12. Layout responsivo, acessibilidade básica e textos em pt-BR.

### 3.2 Fora de escopo (não implementado)

- API, backend, banco de dados ou autenticação.
- Cobrança real, gateway de pagamento, PIX ou boleto.
- Consulta de CEP em serviço externo; o CEP é apenas validado e formatado localmente.
- Rastreamento de entrega real. Os textos "Entrega rápida e rastreada" e "20 a 40 minutos após a confirmação" são **textos informativos estáticos** da interface, não funcionalidades de rastreio ou prazo calculado.
- Controle de estoque, cupons, descontos, frete por região ou múltiplos endereços.
- Histórico de pedidos: apenas o último pedido é mantido em `localStorage`.
- Cadastro de usuário, conta, favoritos ou lista de desejos.
- Testes end-to-end em navegador real (os testes automatizados usam jsdom).

---

## 4. Requisitos funcionais

| ID | Requisito | Prioridade | Evidência no código |
| --- | --- | --- | --- |
| RF-01 | Exibir catálogo com os 8 cafés cadastrados, nome, descrição, tags, preço e ilustração. | Alta | `src/data/coffees.ts`, `src/pages/HomePage.tsx`, `src/components/CoffeeCard.tsx` |
| RF-02 | Oferecer filtros `Todos`, `Expresso`, `Cremoso` e `Gelado`, com estado visual de seleção. | Alta | `src/data/coffees.ts`, `src/pages/HomePage.tsx` |
| RF-03 | Adicionar um café ao carrinho a partir do card. | Alta | `src/components/CoffeeCard.tsx`, `src/contexts/CartContext.tsx` |
| RF-04 | Incrementar e decrementar quantidade no card e no carrinho; ao chegar a zero, o item sai do carrinho. | Alta | `src/components/QuantityStepper.tsx`, `src/contexts/cartReducer.ts` |
| RF-05 | Remover um item do carrinho pelo botão de lixeira. | Alta | `src/components/CartPanel.tsx` |
| RF-06 | Mostrar a quantidade total de itens em badge no cabeçalho; ocultar o badge quando vazio. | Alta | `src/components/Header.tsx` |
| RF-07 | Abrir o carrinho em drawer sobreposto pelo cabeçalho, fechável por backdrop, botão ou Escape. | Alta | `src/components/CartDrawer.tsx`, `src/contexts/UiContext.tsx` |
| RF-08 | Exibir itens, subtotal, entrega, total e dica de entrega grátis no resumo do carrinho. | Alta | `src/components/CartPanel.tsx` |
| RF-09 | Exibir o resumo do carrinho em aside no catálogo em desktop e no checkout. No checkout, o resumo é renderizado com `showCheckoutButton={false}`: o único botão de envio é "Confirmar pedido". | Alta | `src/pages/HomePage.tsx`, `src/pages/CheckoutPage.tsx`, `src/components/CartPanel.tsx` |
| RF-10 | Persistir o carrinho em `localStorage` e restaurá-lo ao carregar a aplicação, descartando dados inválidos. | Alta | `src/contexts/CartContext.tsx` |
| RF-11 | Alternar entre tema claro e escuro e persistir a escolha; usar a preferência do sistema quando não houver escolha salva. | Média | `src/contexts/ThemeContext.tsx` |
| RF-12 | Oferecer formulário de endereço com CEP, rua, número, complemento opcional, bairro, cidade e UF. | Alta | `src/pages/CheckoutPage.tsx` |
| RF-13 | Aplicar máscara de CEP e converter UF para maiúsculas durante o preenchimento. | Média | `src/lib/format.ts`, `src/pages/CheckoutPage.tsx` |
| RF-14 | Validar o formulário com Zod e exibir mensagens de erro por campo e `aria-invalid`. | Alta | `src/lib/checkoutSchema.ts`, `src/pages/CheckoutPage.tsx` |
| RF-15 | Oferecer três formas de pagamento: cartão de crédito, cartão de débito e dinheiro, com seleção obrigatória. | Alta | `src/pages/CheckoutPage.tsx`, `src/lib/checkoutSchema.ts` |
| RF-16 | Impedir a finalização com carrinho vazio, exibindo link para o catálogo. | Alta | `src/pages/CheckoutPage.tsx` |
| RF-17 | Ao confirmar o pedido: criar pedido, salvar como último pedido, limpar carrinho, fechar drawer e navegar para `/sucesso`. | Alta | `src/pages/CheckoutPage.tsx`, `src/contexts/OrderContext.tsx` |
| RF-18 | Exibir na página de sucesso número do pedido, endereço, forma de pagamento, itens e total pago. | Alta | `src/pages/SuccessPage.tsx` |
| RF-19 | Redirecionar para a home quando não há último pedido ao acessar `/sucesso`. | Média | `src/pages/SuccessPage.tsx` |
| RF-20 | Redirecionar rotas desconhecidas para a home e voltar ao topo ao trocar de rota. | Média | `src/App.tsx`, `src/components/Layout.tsx` |

---

## 5. Requisitos não funcionais

| ID | Requisito | Descrição |
| --- | --- | --- |
| RNF-01 | Idioma | Interface, mensagens de erro e documentação em português brasileiro; documento HTML com `lang="pt-BR"`. |
| RNF-02 | Responsividade | Layout adaptado nos breakpoints de 1024 px, 720 px e 420 px (`src/styles/global.css`). |
| RNF-03 | Acessibilidade | Rótulos acessíveis em botões e ícones, `aria-pressed` nos filtros, `aria-invalid` nos campos, `aria-live` na quantidade, `role="dialog"`/`aria-modal` no drawer e fechamento por Escape. |
| RNF-04 | Movimento reduzido | Regra `@media (prefers-reduced-motion: reduce)` reduz animações e transições. |
| RNF-05 | Resiliência de armazenamento | Leituras e escritas em `localStorage` são protegidas por `try/catch`; se o armazenamento falhar, a aplicação continua funcionando em memória. |
| RNF-06 | Tipagem | TypeScript em modo estrito, sem variáveis e parâmetros não utilizados (`tsconfig.app.json`). |
| RNF-07 | Testabilidade | Providers de teste com `MemoryRouter`, ambiente jsdom e limpeza de `localStorage` entre testes. |
| RNF-08 | Simplicidade operacional | Aplicação estática, sem serviços externos obrigatórios para execução; pode ser servida como arquivos estáticos após build. |
| RNF-09 | Identidade visual | Logo original criada pelo aluno em `public/logo.png` (PNG) e ilustrações SVG reutilizáveis em `CoffeeIllustration.tsx`; paleta marrom/caramelo via variáveis CSS. |
| RNF-10 | Qualidade do código | Build com `tsc -b && vite build` e suíte de 15 testes automatizados aprovada no estado entregue. |
| RNF-11 | Evidências visuais | Capturas já presentes em `docs/evidence/`; as versões mobile podem ser regeneradas com `npm run evidence`, script opcional que depende de Chrome instalado e não participa do build nem dos testes. |

> Não foram definidos requisitos de desempenho numérico (por exemplo, metas de LCP) nem de compatibilidade com navegadores específicos além do uso de recursos web padrão suportados por navegadores modernos.

---

## 6. Regras de negócio

| ID | Regra | Origem / efeito |
| --- | --- | --- |
| RN-01 | Todos os 8 cafés custam R$ 9,90. | Campo `price` em `src/data/coffees.ts`. |
| RN-02 | A taxa de entrega é R$ 5,00 quando o subtotal é maior que zero e menor que R$ 50,00. | `calculateDeliveryFee` em `src/lib/format.ts`. |
| RN-03 | A entrega é grátis quando o subtotal é maior ou igual a R$ 50,00 **ou** quando o carrinho está vazio (subtotal zero). | `calculateDeliveryFee`; na interface, "Grátis" aparece no resumo. |
| RN-04 | O total é `subtotal + taxa de entrega`. | `CartContext` e `OrderContext`. |
| RN-05 | Um pedido não pode ser finalizado com carrinho vazio. | `CheckoutPage` renderiza estado vazio e não apresenta formulário. |
| RN-06 | Forma de pagamento é obrigatória; valores aceitos: `credit`, `debit`, `cash`. | `checkoutSchema`. |
| RN-07 | CEP obrigatório no formato `00000-000`, com hífen opcional; máscara aplicada no digitamento. | `checkoutSchema`, `formatCep`. |
| RN-08 | Rua (mín. 3 caracteres), número (mín. 1), bairro (mín. 2), cidade (mín. 2) e UF (exatamente 2 letras) são obrigatórios. | `checkoutSchema`. |
| RN-09 | Complemento é opcional e limitado a 80 caracteres. | `checkoutSchema`. |
| RN-10 | Cada item do pedido congela `name` e `unitPrice` no momento da criação do pedido. | `getOrderItems` e `createOrder`. |
| RN-11 | O identificador do pedido segue o formato `CD-AAAAMMDD-NNNN`, com NNNN aleatório entre 1000 e 9999. | `formatOrderId`. |
| RN-12 | `createdAt` é registrado em ISO 8601 no momento da confirmação. | `OrderContext`. |
| RN-13 | Apenas o último pedido é conservado; um novo pedido substitui o anterior no armazenamento. | `coffee-delivery:last-order:v1`. |
| RN-14 | Nenhum valor é cobrado: o pagamento é fictício e não há integração com gateway. | Escopo do produto. |

### 6.1 Exemplos de cálculo

| Situação | Subtotal | Entrega | Total |
| --- | --- | --- | --- |
| 1 café | R$ 9,90 | R$ 5,00 | R$ 14,90 |
| 5 cafés | R$ 49,50 | R$ 5,00 | R$ 54,50 |
| 6 cafés | R$ 59,40 | Grátis | R$ 59,40 |
| Carrinho vazio | R$ 0,00 | Grátis | R$ 0,00 |

---

## 7. Critérios de aceite

### CA-01 — Catálogo e filtros

- **Dado** que o usuário está na rota `/`,
- **Quando** a página carrega,
- **Então** devem ser exibidos os 8 cafés do catálogo e os filtros `Todos`, `Expresso`, `Cremoso` e `Gelado`.
- **E** o filtro `Todos` deve estar visualmente e semanticamente selecionado (`aria-pressed="true"`).

- **Dado** que o filtro `Gelado` está disponível,
- **Quando** o usuário o seleciona,
- **Então** apenas cafés com categoria `gelado` devem ser exibidos e o botão correspondente deve passar a `aria-pressed="true"`.

### CA-02 — Adicionar e ajustar quantidade

- **Dado** que o café `Latte` não está no carrinho,
- **Quando** o usuário clica em "Adicionar Latte ao carrinho",
- **Então** o badge do cabeçalho deve indicar `1 item` e o card deve passar a exibir o controle de quantidade.
- **Quando** o usuário aumenta a quantidade,
- **Então** o badge deve indicar `2 itens` e o carrinho salvo em `coffee-delivery:cart:v1` deve conter `latte` com quantidade `2`.
- **Quando** o usuário diminui até zero,
- **Então** o item deve desaparecer do carrinho e o badge deve ser ocultado.

### CA-03 — Drawer do carrinho

- **Dado** que o usuário está em qualquer rota,
- **Quando** clica no botão "Abrir carrinho",
- **Então** um dialog modal com `aria-label="Carrinho de compras"` deve ser exibido sobre a página.
- **Quando** pressiona Escape, clica no backdrop ou clica no botão "Fechar",
- **Então** o drawer deve ser fechado e o scroll do corpo restaurado.

### CA-04 — Regras de entrega

- **Dado** um carrinho com 5 cafés (subtotal R$ 49,50),
- **Quando** o resumo é exibido,
- **Então** a entrega deve aparecer como R$ 5,00, o total como R$ 54,50 e a dica deve informar R$ 0,50 para entrega grátis.

- **Dado** um carrinho com 6 cafés (subtotal R$ 59,40),
- **Quando** o resumo é exibido,
- **Então** a entrega deve aparecer como "Grátis" e o total como R$ 59,40.

### CA-05 — Persistência do carrinho

- **Dado** que há itens no carrinho,
- **Quando** a página é recarregada,
- **Então** os mesmos cafés e quantidades devem ser exibidos.
- **Dado** que o valor salvo contém itens com `coffeeId` desconhecido ou quantidade inválida,
- **Quando** a aplicação carrega,
- **Então** esses itens devem ser descartados.

### CA-06 — Tema

- **Dado** que não há tema salvo e o sistema prefere modo escuro,
- **Quando** a aplicação carrega,
- **Então** `data-theme="dark"` deve ser aplicado ao elemento raiz.
- **Quando** o usuário alterna o tema,
- **Então** `coffee-delivery:theme:v1` passa a conter `dark` ou `light` conforme a escolha.

### CA-07 — Carrinho vazio no checkout

- **Dado** que o carrinho está vazio,
- **Quando** o usuário acessa `/checkout`,
- **Então** deve ver "Seu carrinho está vazio" e um link "Ver catálogo", sem formulário de pedido.

### CA-08 — Validação do checkout

- **Dado** que o carrinho contém ao menos um café,
- **Quando** o usuário envia o formulário com CEP `123`, UF `SPP` e sem forma de pagamento,
- **Então** mensagens específicas devem ser exibidas para CEP, UF e pagamento, e os campos inválidos devem ter `aria-invalid="true"`.
- **Quando** o usuário informa CEP `01310100`, demais campos válidos e complemento vazio,
- **Então** o envio deve ser aceito; o CEP é exibido como `01310-100`.

### CA-09 — Confirmação do pedido

- **Dado** que o formulário é válido e o carrinho não está vazio,
- **Quando** o usuário clica em "Confirmar pedido",
- **Então** um pedido com `id`, itens, endereço, pagamento, subtotal, taxa, total e `createdAt` deve ser salvo em `coffee-delivery:last-order:v1`, o carrinho deve ser limpo e a aplicação deve navegar para `/sucesso`.

### CA-10 — Página de sucesso

- **Dado** que existe um último pedido,
- **Quando** a página `/sucesso` carrega,
- **Então** devem ser exibidos o número do pedido, os itens com quantidades, o endereço, a forma de pagamento e o total pago.
- **Dado** que não existe último pedido,
- **Quando** o usuário acessa `/sucesso`,
- **Então** ele deve ser redirecionado para `/`.

### CA-11 — Rotas e navegação

- **Dado** que o usuário acessa uma rota não cadastrada,
- **Quando** a aplicação resolve o roteamento,
- **Então** a home deve ser exibida.
- **Quando** o usuário troca de rota,
- **Então** a página deve rolar para o topo.

---

## 8. Fluxo principal

1. O usuário abre `/` e visualiza os cafés e benefícios textuais.
2. Opcionalmente filtra por categoria.
3. Adiciona um ou mais cafés e ajusta as quantidades nos cards ou no carrinho.
4. Confere subtotal, taxa de entrega e total no resumo lateral (desktop) ou no drawer.
5. Abre o drawer pelo cabeçalho ou usa o botão "Finalizar pedido" no resumo.
6. É levado a `/checkout`, onde informa endereço e escolhe a forma de pagamento.
7. Confirma o pedido; o formulário é validado antes do envio.
8. O pedido fictício é criado e salvo, o carrinho é limpo e a aplicação abre `/sucesso`.
9. O usuário vê a confirmação e pode voltar para a loja.

---

## 9. Fluxos alternativos

| Fluxo | Comportamento |
| --- | --- |
| Carrinho esvaziado antes do checkout | A rota `/checkout` mostra o estado vazio com link de volta ao catálogo. |
| Campos inválidos | O envio é bloqueado e mensagens de erro aparecem sob os campos; o campo de pagamento exibe erro abaixo das opções. |
| Falha inesperada ao criar pedido | `CheckoutPage` exibe "Não foi possível finalizar o pedido. Tente novamente." e não navega. |
| Usuário fecha o drawer | Backdrop, botão "Fechar" ou Escape encerram a interação; ao usar "Finalizar pedido", o drawer também é fechado antes da navegação. |
| Acesso direto a `/sucesso` sem pedido | Redirecionamento para `/`. |
| Rota inexistente | Redirecionamento para `/` via rota curinga. |
| `localStorage` indisponível | Carrinho e tema seguem funcionando em memória durante a sessão; o último pedido permanece disponível em memória enquanto a aplicação estiver aberta. |

---

## 10. Glossário

| Termo | Definição |
| --- | --- |
| Subtotal | Soma de `preço × quantidade` dos itens do carrinho. |
| Taxa de entrega | R$ 5,00 abaixo de R$ 50,00 de subtotal; zero nos demais casos definidos em RN-02 e RN-03. |
| Pedido | Registro fictício com itens, endereço, pagamento e valores, guardado localmente. |
| Drawer | Painel lateral sobreposto que apresenta o carrinho. |
| Provider | Componente React que expõe estado e ações por Context API. |
