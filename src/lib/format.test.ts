import { describe, expect, it } from 'vitest'
import { calculateDeliveryFee, formatCep, formatCurrency } from './format'

describe('utilitários de formatação', () => {
  it('formata valores em BRL', () => {
    expect(formatCurrency(9.9)).toBe('R$ 9,90')
  })

  it('cobra entrega abaixo de R$ 50 e isenta acima disso', () => {
    expect(calculateDeliveryFee(20)).toBe(5)
    expect(calculateDeliveryFee(50)).toBe(0)
    expect(calculateDeliveryFee(0)).toBe(0)
  })

  it('aplica a máscara do CEP', () => {
    expect(formatCep('01310100')).toBe('01310-100')
    expect(formatCep('01310')).toBe('01310')
  })
})
