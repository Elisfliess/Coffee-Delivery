import { describe, expect, it } from 'vitest'
import { checkoutSchema } from './checkoutSchema'

const validAddress = {
  cep: '01310-100',
  street: 'Avenida Paulista',
  number: '1000',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  paymentMethod: 'credit' as const,
}

describe('checkoutSchema', () => {
  it('aceita um endereço completo', () => {
    expect(checkoutSchema.safeParse(validAddress).success).toBe(true)
  })

  it('rejeita CEP inválido', () => {
    const result = checkoutSchema.safeParse({ ...validAddress, cep: '123' })
    expect(result.success).toBe(false)
  })

  it('rejeita UF com mais de duas letras', () => {
    const result = checkoutSchema.safeParse({ ...validAddress, state: 'SPP' })
    expect(result.success).toBe(false)
  })

  it('rejeita forma de pagamento desconhecida', () => {
    const result = checkoutSchema.safeParse({ ...validAddress, paymentMethod: 'pix' })
    expect(result.success).toBe(false)
  })

  it('aceita CEP sem máscara e complemento opcional', () => {
    expect(
      checkoutSchema.safeParse({ ...validAddress, cep: '01310100', complement: 'Apto 12' }).success,
    ).toBe(true)
  })
})
