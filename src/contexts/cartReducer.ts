import type { CartItem } from '../types'

export type CartAction =
  | { type: 'add'; coffeeId: string }
  | { type: 'increment'; coffeeId: string }
  | { type: 'decrement'; coffeeId: string }
  | { type: 'remove'; coffeeId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] }

export const initialCartState: CartItem[] = []

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'hydrate':
      return action.items.filter(
        (item, index, all) =>
          all.findIndex((candidate) => candidate.coffeeId === item.coffeeId) === index &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      )

    case 'add': {
      const existing = state.find((item) => item.coffeeId === action.coffeeId)
      if (existing) {
        return state.map((item) =>
          item.coffeeId === action.coffeeId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...state, { coffeeId: action.coffeeId, quantity: 1 }]
    }

    case 'increment':
      return state.map((item) =>
        item.coffeeId === action.coffeeId ? { ...item, quantity: item.quantity + 1 } : item,
      )

    case 'decrement':
      return state
        .map((item) =>
          item.coffeeId === action.coffeeId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0)

    case 'remove':
      return state.filter((item) => item.coffeeId !== action.coffeeId)

    case 'clear':
      return []

    default:
      return state
  }
}
