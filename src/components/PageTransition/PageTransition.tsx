import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import clsx from 'clsx'
import styles from './PageTransition.module.scss'

export type NavDirection = 1 | -1

type PageTransitionProps = {
  /** 1 = avanzar (push), -1 = volver (pop) */
  direction: NavDirection
  /** Sin fondo ni sombra: deja ver el visor persistente que está debajo. */
  transparent?: boolean
  children: ReactNode
}

// Estilo iOS: la pantalla nueva entra desde la derecha y la anterior se desplaza
// levemente hacia la izquierda. Al volver ocurre lo inverso.
const variants: Variants = {
  enter: (dir: NavDirection) => ({
    x: dir > 0 ? '100%' : '-28%',
    opacity: dir > 0 ? 1 : 0.6,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: NavDirection) => ({
    x: dir > 0 ? '-28%' : '100%',
    opacity: dir > 0 ? 0.6 : 1,
  }),
}

export function PageTransition({ direction, transparent, children }: PageTransitionProps) {
  return (
    <motion.div
      className={clsx(styles.page, transparent && styles.transparent)}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
