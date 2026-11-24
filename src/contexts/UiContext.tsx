import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface UiContextValue {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const UiContext = createContext<UiContextValue | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const value = useMemo(() => ({ isCartOpen, openCart, closeCart }), [isCartOpen, openCart, closeCart])

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi(): UiContextValue {
  const context = useContext(UiContext)
  if (!context) throw new Error('useUi deve ser usado dentro de UiProvider')
  return context
}
