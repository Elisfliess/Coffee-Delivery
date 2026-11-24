import { z } from 'zod'

export const paymentMethods = ['credit', 'debit', 'cash'] as const

export const checkoutSchema = z.object({
  cep: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, 'Informe um CEP válido (00000-000)'),
  street: z.string().trim().min(3, 'Informe a rua ou avenida'),
  number: z.string().trim().min(1, 'Informe o número'),
  complement: z.string().trim().max(80, 'Máximo de 80 caracteres').optional(),
  neighborhood: z.string().trim().min(2, 'Informe o bairro'),
  city: z.string().trim().min(2, 'Informe a cidade'),
  state: z
    .string()
    .trim()
    .length(2, 'Use a sigla do estado (UF)')
    .regex(/^[A-Za-z]{2}$/, 'Use a sigla do estado (UF)'),
  paymentMethod: z.enum(paymentMethods, {
    errorMap: () => ({ message: 'Selecione uma forma de pagamento' }),
  }),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
