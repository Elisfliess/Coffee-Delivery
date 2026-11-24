import { zodResolver } from '@hookform/resolvers/zod'
import { Banknote, CreditCard, MapPin, MoveLeft, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { CartPanel } from '../components/CartPanel'
import { useCart } from '../contexts/CartContext'
import { useOrder } from '../contexts/OrderContext'
import { useUi } from '../contexts/UiContext'
import { checkoutSchema, type CheckoutFormValues } from '../lib/checkoutSchema'
import { formatCep } from '../lib/format'
import type { PaymentMethod } from '../types'

const paymentOptions: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: 'credit', label: 'Cartão de crédito', icon: CreditCard },
  { id: 'debit', label: 'Cartão de débito', icon: Wallet },
  { id: 'cash', label: 'Dinheiro', icon: Banknote },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { closeCart } = useUi()
  const { items, getOrderItems, clear } = useCart()
  const { createOrder } = useOrder()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      paymentMethod: undefined,
    },
  })

  const selectedPayment = watch('paymentMethod')

  if (items.length === 0) {
    return (
      <section className="container empty-checkout">
        <h1>Seu carrinho está vazio</h1>
        <p>Adicione cafés ao carrinho para finalizar um pedido.</p>
        <Link to="/" className="button button--primary">
          Ver catálogo
        </Link>
      </section>
    )
  }

  const onSubmit = handleSubmit((values) => {
    setSubmitError('')
    try {
      createOrder(getOrderItems(), values, values.paymentMethod)
      clear()
      closeCart()
      navigate('/sucesso', { replace: true })
    } catch {
      setSubmitError('Não foi possível finalizar o pedido. Tente novamente.')
    }
  })

  return (
    <section className="container checkout">
      <Link to="/" className="back-link">
        <MoveLeft size={16} /> Voltar para o catálogo
      </Link>
      <form className="checkout__layout" onSubmit={onSubmit} noValidate>
        <div className="checkout__form-column">
          <h1>Complete seu pedido</h1>

          <fieldset className="form-card">
            <legend className="form-card__heading">
              <MapPin size={20} />
              <span>
                <strong>Endereço de entrega</strong>
                <small>Informe o endereço onde deseja receber seu pedido</small>
              </span>
            </legend>

            <div className="form-grid">
              <label className="field field--cep">
                <span>CEP</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00000-000"
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.cep)}
                  {...register('cep', {
                    onChange: (event) => setValue('cep', formatCep(event.target.value)),
                  })}
                />
                {errors.cep && <small className="field__error">{errors.cep.message}</small>}
              </label>

              <label className="field field--full">
                <span>Rua / Avenida</span>
                <input
                  type="text"
                  placeholder="Rua das Flores"
                  autoComplete="street-address"
                  aria-invalid={Boolean(errors.street)}
                  {...register('street')}
                />
                {errors.street && <small className="field__error">{errors.street.message}</small>}
              </label>

              <label className="field">
                <span>Número</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="120"
                  aria-invalid={Boolean(errors.number)}
                  {...register('number')}
                />
                {errors.number && <small className="field__error">{errors.number.message}</small>}
              </label>

              <label className="field field--optional">
                <span>Complemento <em>Opcional</em></span>
                <input type="text" placeholder="Apartamento, bloco..." {...register('complement')} />
                {errors.complement && (
                  <small className="field__error">{errors.complement.message}</small>
                )}
              </label>

              <label className="field">
                <span>Bairro</span>
                <input
                  type="text"
                  placeholder="Centro"
                  aria-invalid={Boolean(errors.neighborhood)}
                  {...register('neighborhood')}
                />
                {errors.neighborhood && (
                  <small className="field__error">{errors.neighborhood.message}</small>
                )}
              </label>

              <label className="field field--city">
                <span>Cidade</span>
                <input
                  type="text"
                  placeholder="São Paulo"
                  autoComplete="address-level2"
                  aria-invalid={Boolean(errors.city)}
                  {...register('city')}
                />
                {errors.city && <small className="field__error">{errors.city.message}</small>}
              </label>

              <label className="field field--state">
                <span>UF</span>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="SP"
                  autoComplete="address-level1"
                  aria-invalid={Boolean(errors.state)}
                  {...register('state', {
                    onChange: (event) => setValue('state', event.target.value.toUpperCase()),
                  })}
                />
                {errors.state && <small className="field__error">{errors.state.message}</small>}
              </label>
            </div>
          </fieldset>

          <fieldset className="form-card">
            <legend className="form-card__heading">
              <Banknote size={20} />
              <span>
                <strong>Forma de pagamento</strong>
                <small>Escolha como deseja pagar seu pedido</small>
              </span>
            </legend>
            <div className="payment-options">
              {paymentOptions.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`payment-option${selectedPayment === id ? ' is-selected' : ''}`}
                >
                  <input type="radio" value={id} {...register('paymentMethod')} />
                  <Icon size={18} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <small className="field__error">{errors.paymentMethod.message}</small>
            )}
          </fieldset>
          {submitError && <p className="field__error">{submitError}</p>}
        </div>

        <aside className="checkout__summary">
          <h2>Cafés selecionados</h2>
          <div className="checkout__summary-card">
            <CartPanel showCheckoutButton={false} />
            <button type="submit" className="button button--primary button--full">
              Confirmar pedido
            </button>
          </div>
        </aside>
      </form>
    </section>
  )
}
