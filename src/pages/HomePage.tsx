import { useMemo, useState } from 'react'
import { Clock3, Coffee, Package, ShoppingBag } from 'lucide-react'
import { CartPanel } from '../components/CartPanel'
import { CoffeeCard } from '../components/CoffeeCard'
import { CoffeeIllustration } from '../components/CoffeeIllustration'
import { categories, coffees } from '../data/coffees'

type CategoryFilter = (typeof categories)[number]['id']

const benefits = [
  { icon: ShoppingBag, color: '#c47a2f', text: 'Compra simples e segura' },
  { icon: Package, color: '#b07a4a', text: 'Embalagem mantém o café intacto' },
  { icon: Clock3, color: '#e8a764', text: 'Entrega rápida e rastreada' },
  { icon: Coffee, color: '#8a4f27', text: 'O café chega fresquinho até você' },
]

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const visibleCoffees = useMemo(
    () =>
      activeCategory === 'all'
        ? coffees
        : coffees.filter((coffee) => coffee.category === activeCategory),
    [activeCategory],
  )

  return (
    <>
      <section className="hero container">
        <div className="hero__content">
          <h1>Encontre o café perfeito para qualquer hora do dia</h1>
          <p>
            Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora. Escolha seu
            favorito e nós cuidamos do resto.
          </p>
          <ul className="benefits">
            {benefits.map(({ icon: Icon, color, text }) => (
              <li key={text}>
                <span className="benefits__icon" style={{ backgroundColor: color }}>
                  <Icon size={15} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__art" aria-hidden="true">
          <div className="hero__glow" />
          <CoffeeIllustration coffee={coffees[0]} className="hero__coffee" />
          <span className="hero__beans">☕</span>
        </div>
      </section>

      <section className="catalog container" id="catalogo">
        <div className="catalog__heading">
          <h2>Nossos cafés</h2>
          <div className="filters" role="group" aria-label="Filtrar cafés por categoria">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`filter-chip${activeCategory === category.id ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog__layout">
          <div className="coffee-grid">
            {visibleCoffees.length === 0 && (
              <p className="catalog__empty">Nenhum café encontrado nesta categoria.</p>
            )}
            {visibleCoffees.map((coffee) => (
              <CoffeeCard key={coffee.id} coffee={coffee} />
            ))}
          </div>
          <aside className="catalog__cart" aria-label="Resumo do carrinho">
            <CartPanel />
          </aside>
        </div>
      </section>
    </>
  )
}
