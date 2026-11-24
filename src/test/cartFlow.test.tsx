import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Header } from '../components/Header'
import { HomePage } from '../pages/HomePage'
import { renderWithProviders } from './utils'

describe('fluxo do carrinho', () => {
  it('adiciona, altera quantidade e persiste o carrinho no LocalStorage', async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(
      <>
        <Header />
        <HomePage />
      </>,
    )

    await user.click(screenGetAddButton())
    expect(screenGetCartButton()).toHaveAccessibleName(/1 item/)

    await user.click(screenGetCartButton())
    const incrementButtons = document.querySelectorAll(
      '[aria-label="Aumentar quantidade de Latte"]',
    )
    expect(incrementButtons.length).toBeGreaterThanOrEqual(1)
    await user.click(incrementButtons[incrementButtons.length - 1])

    expect(screenGetCartButton()).toHaveAccessibleName(/2 itens/)
    expect(JSON.parse(localStorage.getItem('coffee-delivery:cart:v1') ?? '[]')).toEqual([
      { coffeeId: 'latte', quantity: 2 },
    ])

    unmount()
  })

  it('alterna entre os temas claro e escuro', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Header />)

    const toggle = document.querySelector('[aria-label="Ativar modo escuro"]')
    expect(toggle).not.toBeNull()
    await user.click(toggle!)
    expect(localStorage.getItem('coffee-delivery:theme:v1')).toBe('dark')
  })
})

function screenGetAddButton() {
  const button = document.querySelector('[aria-label="Adicionar Latte ao carrinho"]')
  if (!button) throw new Error('Botão de adicionar Latte não encontrado')
  return button as HTMLButtonElement
}

function screenGetCartButton() {
  const button = document.querySelector('[aria-label^="Abrir carrinho"]')
  if (!button) throw new Error('Botão do carrinho não encontrado')
  return button as HTMLButtonElement
}
