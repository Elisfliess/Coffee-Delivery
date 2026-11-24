export type CoffeeCategory = 'expresso' | 'coado' | 'cremoso' | 'gelado'

export interface Coffee {
  id: string
  name: string
  description: string
  price: number
  tags: string[]
  category: CoffeeCategory
  /** Cor principal da ilustração da embalagem. */
  color: string
  /** Cor do rótulo da embalagem. */
  accent: string
}

export interface CartItem {
  coffeeId: string
  quantity: number
}

export type PaymentMethod = 'credit' | 'debit' | 'cash'

export interface Address {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface OrderItem extends CartItem {
  name: string
  unitPrice: number
}

export interface Order {
  id: string
  items: OrderItem[]
  address: Address
  paymentMethod: PaymentMethod
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
}

export type Theme = 'light' | 'dark'
