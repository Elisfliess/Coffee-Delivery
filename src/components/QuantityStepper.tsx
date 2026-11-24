import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  label: string
  compact?: boolean
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  label,
  compact = false,
}: QuantityStepperProps) {
  return (
    <div className={`quantity-stepper${compact ? ' quantity-stepper--compact' : ''}`} aria-label={label}>
      <button type="button" onClick={onDecrement} aria-label={`Diminuir quantidade de ${label}`}>
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={onIncrement} aria-label={`Aumentar quantidade de ${label}`}>
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}
