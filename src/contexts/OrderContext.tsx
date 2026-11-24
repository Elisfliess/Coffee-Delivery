import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { calculateDeliveryFee, formatOrderId } from '../lib/format'
import type { Address, Order, OrderItem, PaymentMethod } from '../types'

const STORAGE_KEY = 'coffee-delivery:last-order:v1'

interface OrderContextValue {
  lastOrder: Order | null
  createOrder: (items: OrderItem[], address: Address, paymentMethod: PaymentMethod) => Order
}

const OrderContext = createContext<OrderContextValue | null>(null)

function readStoredOrder(): Order | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Order) : null
  } catch {
    return null
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lastOrder, setLastOrder] = useState<Order | null>(readStoredOrder)

  const createOrder = useCallback((items: OrderItem[], address: Address, paymentMethod: PaymentMethod) => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const order: Order = {
      id: formatOrderId(new Date()),
      items,
      address,
      paymentMethod,
      subtotal,
      deliveryFee: calculateDeliveryFee(subtotal),
      total: subtotal + calculateDeliveryFee(subtotal),
      createdAt: new Date().toISOString(),
    }
    setLastOrder(order)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
    } catch {
      // armazenamento indisponível
    }
    return order
  }, [])

  const value = useMemo(() => ({ lastOrder, createOrder }), [lastOrder, createOrder])
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder(): OrderContextValue {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrder deve ser usado dentro de OrderProvider')
  return context
}
