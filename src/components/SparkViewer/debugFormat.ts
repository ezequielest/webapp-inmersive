import type { DebugSnapshot } from './debugTools'

/** [0.619, -0.052, 0.55] — mismo formato que usan los hotspots en data/hotspots.ts. */
export const formatVec3 = (v: readonly number[]) => `[${v.join(', ')}]`

/** Bloque `navigation` listo para pegar dentro de un hotspot. */
export function formatNavigation(snapshot: DebugSnapshot, duration = 2500) {
  return [
    'navigation: {',
    `  initialPoint: ${formatVec3(snapshot.cube)},`,
    `  positionCamera: ${formatVec3(snapshot.camera.position)},`,
    `  target: ${formatVec3(snapshot.camera.target)},`,
    `  duration: ${duration},`,
    '},',
  ].join('\n')
}
