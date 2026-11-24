import { CheckCircle2, Clock3, MapPin, MoveLeft } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useOrder } from '../contexts/OrderContext'
import { formatCurrency } from '../lib/format'
import type { PaymentMethod } from '../types'

const paymentLabels: Record<PaymentMethod, string> = {
  credit: 'Cartão de crédito',
  debit: 'Cartão de débito',
  cash: 'Dinheiro',
}

export function SuccessPage() {
  const { lastOrder } = useOrder()

  if (!lastOrder) return <Navigate to="/" replace />

  return (
    <section className="container success">
      <div className="success__headline">
        <CheckCircle2 size={52} strokeWidth={1.6} />
        <h1>Pedido confirmado!</h1>
        <p>
          Seu pedido <strong>{lastOrder.id}</strong> foi recebido e já está sendo preparado.
        </p>
      </div>

      <div className="success__card">
        <div className="success__delivery">
          <div>
            <Clock3 size={22} />
            <span>
              <strong>Prazo estimado</strong>
              <small>20 a 40 minutos após a confirmação</small>
            </span>
          </div>
          <div>
            <MapPin size={22} />
            <span>
              <strong>Entrega</strong>
              <small>
                {lastOrder.address.street}, {lastOrder.address.number}
                {lastOrder.address.complement ? ` - ${lastOrder.address.complement}` : ''} ·{' '}
                {lastOrder.address.neighborhood}, {lastOrder.address.city} -{' '}
                {lastOrder.address.state}
              </small>
            </span>
          </div>
          <div>
            <strong>Pagamento</strong>
            <small>{paymentLabels[lastOrder.paymentMethod]}</small>
          </div>
        </div>

        <ul className="success__items">
          {lastOrder.items.map((item) => (
            <li key={item.coffeeId}>
              <span>
                {item.quantity}× {item.name}
              </span>
              <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
            </li>
          ))}
        </ul>

        <div className="success__total">
          <span>Total pago</span>
          <strong>{formatCurrency(lastOrder.total)}</strong>
        </div>
      </div>

      <Link to="/" className="button button--primary">
        <MoveLeft size={16} /> Voltar para a loja
      </Link>
    </section>
  )
}
