import clsx from 'clsx'
import styles from './SegmentedControl.module.scss'

type Option<T extends string> = { value: T; label: string }

type SegmentedControlProps<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div role="tablist" className={clsx(styles.control, styles[size], className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={opt.value === value}
          className={clsx(styles.option, opt.value === value && styles.active)}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
