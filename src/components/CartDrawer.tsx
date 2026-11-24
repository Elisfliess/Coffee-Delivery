import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useUi } from '../contexts/UiContext'
import { CartPanel } from './CartPanel'

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUi()

  useEffect(() => {
    if (!isCartOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isCartOpen, closeCart])

  if (!isCartOpen) return null

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      <button
        type="button"
        className="drawer__backdrop"
        onClick={closeCart}
        aria-label="Fechar carrinho"
      />
      <aside className="drawer__panel">
        <button type="button" className="icon-button drawer__close" onClick={closeCart} aria-label="Fechar">
          <X size={20} />
        </button>
        <CartPanel />
      </aside>
    </div>
  )
}
