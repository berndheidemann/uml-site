interface Props {
  current: number
  max: number
  label?: string
  className?: string
  showText?: boolean
}

export function ProgressBar({ current, max, label, className, showText = true }: Props) {
  const percentage = max === 0 ? 0 : Math.round((current / max) * 100)

  const getColor = () => {
    if (percentage >= 100) return 'bg-success'
    if (percentage >= 50) return 'bg-primary'
    if (percentage > 0) return 'bg-warning'
    return 'bg-border'
  }

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-light">{label}</span>
          {showText && <span className="text-text-light">{current}/{max}</span>}
        </div>
      )}
      <div
        className="h-2 bg-surface-dark rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `${current} von ${max}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
