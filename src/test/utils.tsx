import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../contexts/CartContext'
import { OrderProvider } from '../contexts/OrderContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { UiProvider } from '../contexts/UiContext'

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <OrderProvider>
          <UiProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </UiProvider>
        </OrderProvider>
      </CartProvider>
    </ThemeProvider>
  )
}

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options })
}
