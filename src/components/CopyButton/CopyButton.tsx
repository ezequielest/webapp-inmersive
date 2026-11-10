import { useEffect, useRef, useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import clsx from 'clsx'
import styles from './CopyButton.module.scss'

type Status = 'idle' | 'copied' | 'error'

type CopyButtonProps = {
  /** Se llama al hacer clic, así siempre se copia el valor más reciente. */
  getText: () => string
  label: string
  /** `icon`: solo el ícono. `block`: botón ancho con texto. */
  variant?: 'icon' | 'block'
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Plan B para páginas sin HTTPS (por ejemplo, probando por IP en la red local).
  }
  const area = document.createElement('textarea')
  area.value = text
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    area.remove()
  }
}

export function CopyButton({ getText, label, variant = 'icon' }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleClick = async () => {
    const text = getText()
    const ok = text !== '' && (await copyToClipboard(text))
    setStatus(ok ? 'copied' : 'error')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), 1200)
  }

  const Icon = status === 'copied' ? Check : status === 'error' ? X : Copy
  const text = status === 'copied' ? 'Copiado' : status === 'error' ? 'No se pudo copiar' : label

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        styles.button,
        styles[variant],
        status === 'copied' && styles.copied,
        status === 'error' && styles.error,
      )}
      onClick={handleClick}
    >
      <Icon />
      {variant === 'block' && text}
    </button>
  )
}
