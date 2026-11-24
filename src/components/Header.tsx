import { Link } from 'react-router-dom'
import { MapPin, Moon, ShoppingCart, Sun } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'
import { useUi } from '../contexts/UiContext'

export function Header() {
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { openCart } = useUi()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Coffee Delivery - página inicial">
          <img src="/logo.svg" alt="" className="brand__logo" width={40} height={40} />
          <span className="brand__text">
            <strong>Coffee Delivery</strong>
            <small>café especial na sua porta</small>
          </span>
        </Link>

        <div className="site-header__actions">
          <span className="location" title="Entregamos em todo o Brasil">
            <MapPin size={18} />
            <span>
              <small>Entregar em</small>
              <strong>Brasil</strong>
            </span>
          </span>

          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            type="button"
            className="cart-button"
            onClick={openCart}
            aria-label={`Abrir carrinho com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && <span className="cart-button__badge">{itemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
