import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import styles from './BottomSheet.module.scss'

type BottomSheetProps = {
  title?: string
  onClose?: () => void
  children: ReactNode
  className?: string
}

/** Panel inferior animado. Montarlo dentro de <AnimatePresence> para animar la salida. */
export function BottomSheet({ title, onClose, children, className }: BottomSheetProps) {
  return (
    <motion.section
      className={clsx(styles.sheet, className)}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 32, stiffness: 320 }}
    >
      <div className={styles.handle} />
      {(title || onClose) && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {onClose && (
            <button aria-label="Cerrar" className={styles.close} onClick={onClose}>
              <X />
            </button>
          )}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </motion.section>
  )
}
