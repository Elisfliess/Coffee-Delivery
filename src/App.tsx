import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CartProvider } from './contexts/CartContext'
import { OrderProvider } from './contexts/OrderContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UiProvider } from './contexts/UiContext'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { SuccessPage } from './pages/SuccessPage'

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <OrderProvider>
          <UiProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/sucesso" element={<SuccessPage />} />
                  <Route path="*" element={<HomePage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </UiProvider>
        </OrderProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
