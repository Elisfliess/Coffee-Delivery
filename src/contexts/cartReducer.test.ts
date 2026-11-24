import { describe, expect, it } from 'vitest'
import { cartReducer, initialCartState } from './cartReducer'

describe('cartReducer', () => {
  it('adiciona um novo café com quantidade 1', () => {
    expect(cartReducer(initialCartState, { type: 'add', coffeeId: 'latte' })).toEqual([
      { coffeeId: 'latte', quantity: 1 },
    ])
  })

  it('incrementa a quantidade de um café já presente', () => {
    const state = [{ coffeeId: 'latte', quantity: 2 }]
    expect(cartReducer(state, { type: 'add', coffeeId: 'latte' })).toEqual([
      { coffeeId: 'latte', quantity: 3 },
    ])
  })

  it('decrementa e remove o item quando a quantidade chega a zero', () => {
    const state = [
      { coffeeId: 'latte', quantity: 1 },
      { coffeeId: 'cappuccino', quantity: 2 },
    ]
    expect(cartReducer(state, { type: 'decrement', coffeeId: 'latte' })).toEqual([
      { coffeeId: 'cappuccino', quantity: 2 },
    ])
  })

  it('remove um item specific e limpa o carrinho', () => {
    const state = [
      { coffeeId: 'latte', quantity: 1 },
      { coffeeId: 'cappuccino', quantity: 2 },
    ]
    expect(cartReducer(state, { type: 'remove', coffeeId: 'latte' })).toEqual([
      { coffeeId: 'cappuccino', quantity: 2 },
    ])
    expect(cartReducer(state, { type: 'clear' })).toEqual([])
  })

  it('ao hidratar, descarta itens duplicados e quantidades inválidas', () => {
    const items = [
      { coffeeId: 'latte', quantity: 2 },
      { coffeeId: 'latte', quantity: 3 },
      { coffeeId: 'cappuccino', quantity: 0 },
    ]
    expect(cartReducer([], { type: 'hydrate', items })).toEqual([{ coffeeId: 'latte', quantity: 2 }])
  })
})
