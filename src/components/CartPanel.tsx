import { ShoppingBag, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useUi } from '../contexts/UiContext'
import { coffeeById } from '../data/coffees'
import { formatCurrency, FREE_DELIVERY_THRESHOLD } from '../lib/format'
import { CoffeeIllustration } from './CoffeeIllustration'
import { QuantityStepper } from './QuantityStepper'

interface CartPanelProps {
  showCheckoutButton?: boolean
}

export function CartPanel({ showCheckoutButton = true }: CartPanelProps) {
  const navigate = useNavigate()
  const { closeCart } = useUi()
  const { items, subtotal, deliveryFee, total, increment, decrement, remove } = useCart()

  function goToCheckout() {
    closeCart()
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="cart-panel">
        <h2 className="cart-panel__title">Seu carrinho</h2>
        <div className="cart-empty">
          <ShoppingBag size={44} strokeWidth={1.5} />
          <p>Seu carrinho está vazio.</p>
          <span>Escolha um café delicioso para começar.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-panel">
      <h2 className="cart-panel__title">Seu carrinho</h2>
      <ul className="cart-list">
        {items.map((item) => {
          const coffee = coffeeById.get(item.coffeeId)
          if (!coffee) return null
          return (
            <li key={item.coffeeId} className="cart-item">
              <CoffeeIllustration coffee={coffee} className="cart-item__image" />
              <div className="cart-item__info">
                <strong>{coffee.name}</strong>
                <span>{formatCurrency(coffee.price * item.quantity)}</span>
                <div className="cart-item__actions">
                  <QuantityStepper
                    value={item.quantity}
                    label={coffee.name}
                    compact
                    onIncrement={() => increment(item.coffeeId)}
                    onDecrement={() => decrement(item.coffeeId)}
                  />
                  <button
                    type="button"
                    className="icon-button icon-button--danger"
                    onClick={() => remove(item.coffeeId)}
                    aria-label={`Remover ${coffee.name} do carrinho`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <dl className="cart-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd>{deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}</dd>
        </div>
        <div className="cart-totals__grand">
          <dt>Total</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>
      {deliveryFee > 0 && (
        <p className="cart-hint">
          Faltam {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} para entrega grátis.
        </p>
      )}
      {showCheckoutButton && (
        <button type="button" className="button button--primary button--full" onClick={goToCheckout}>
          Finalizar pedido
        </button>
      )}
    </div>
  )
}
