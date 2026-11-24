import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { coffeeById } from '../data/coffees'
import { calculateDeliveryFee } from '../lib/format'
import type { CartItem, OrderItem } from '../types'
import { cartReducer, initialCartState } from './cartReducer'

const STORAGE_KEY = 'coffee-delivery:cart:v1'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  deliveryFee: number
  total: number
  addCoffee: (coffeeId: string) => void
  increment: (coffeeId: string) => void
  decrement: (coffeeId: string) => void
  remove: (coffeeId: string) => void
  clear: () => void
  getOrderItems: () => OrderItem[]
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialCartState
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return initialCartState
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).coffeeId === 'string' &&
        coffeeById.has((item as CartItem).coffeeId) &&
        Number.isInteger((item as CartItem).quantity) &&
        (item as CartItem).quantity > 0,
    )
  } catch {
    return initialCartState
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, initialCartState, readStoredCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Armazenamento indisponível (modo privado, por exemplo): o carrinho segue em memória.
    }
  }, [items])

  const addCoffee = useCallback((coffeeId: string) => {
    if (coffeeById.has(coffeeId)) dispatch({ type: 'add', coffeeId })
  }, [])
  const increment = useCallback((coffeeId: string) => dispatch({ type: 'increment', coffeeId }), [])
  const decrement = useCallback((coffeeId: string) => dispatch({ type: 'decrement', coffeeId }), [])
  const remove = useCallback((coffeeId: string) => dispatch({ type: 'remove', coffeeId }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => {
      const coffee = coffeeById.get(item.coffeeId)
      return coffee ? sum + coffee.price * item.quantity : sum
    }, 0)
    const deliveryFee = calculateDeliveryFee(subtotal)

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      addCoffee,
      increment,
      decrement,
      remove,
      clear,
      getOrderItems: () =>
        items.flatMap((item) => {
          const coffee = coffeeById.get(item.coffeeId)
          if (!coffee) return []
          return [{ ...item, name: coffee.name, unitPrice: coffee.price }]
        }),
    }
  }, [items, addCoffee, increment, decrement, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider')
  return context
}
