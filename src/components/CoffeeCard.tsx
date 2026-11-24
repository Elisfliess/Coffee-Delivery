import { Plus } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { formatCurrency } from '../lib/format'
import type { Coffee } from '../types'
import { CoffeeIllustration } from './CoffeeIllustration'
import { QuantityStepper } from './QuantityStepper'

interface CoffeeCardProps {
  coffee: Coffee
}

export function CoffeeCard({ coffee }: CoffeeCardProps) {
  const { items, addCoffee, increment, decrement } = useCart()
  const quantity = items.find((item) => item.coffeeId === coffee.id)?.quantity ?? 0

  return (
    <article className="coffee-card">
      <CoffeeIllustration coffee={coffee} className="coffee-card__image" />
      <div className="coffee-card__tags">
        {coffee.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <h3>{coffee.name}</h3>
      <p>{coffee.description}</p>
      <div className="coffee-card__footer">
        <strong>{formatCurrency(coffee.price)}</strong>
        {quantity === 0 ? (
          <button
            type="button"
            className="add-button"
            onClick={() => addCoffee(coffee.id)}
            aria-label={`Adicionar ${coffee.name} ao carrinho`}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        ) : (
          <QuantityStepper
            value={quantity}
            label={coffee.name}
            onIncrement={() => increment(coffee.id)}
            onDecrement={() => decrement(coffee.id)}
            compact
          />
        )}
      </div>
    </article>
  )
}
