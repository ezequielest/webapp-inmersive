import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import styles from './SidePanel.module.scss'

type SidePanelProps = {
  title?: string
  onClose: () => void
  children: ReactNode
}

/** Contenedor del panel derecho. Montarlo dentro de <AnimatePresence> para animar la salida. */
export function SidePanel({ title, onClose, children }: SidePanelProps) {
  return (
    <motion.aside
      className={styles.panel}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <button aria-label="Cerrar panel" className={styles.close} onClick={onClose}>
        <X />
      </button>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </motion.aside>
  )
}
