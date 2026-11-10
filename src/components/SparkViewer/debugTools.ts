import * as THREE from 'three'
import type { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import type { Vec3 } from '@/data/hotspots'

/**
 * Herramientas de debug del visor (solo se crean con `?debug` en la URL).
 * - Un cubo que se mueve con un gizmo, para leer coordenadas del splat.
 * - Lectura de la cámara (posición y target) en cualquier momento.
 */

// Tamaño del cubo en unidades del splat. Tus cámaras están a ~0.6 del objetivo, así que 1 sería enorme.
const CUBE_SIZE = 0.03

const round3 = (n: number) => Math.round(n * 1000) / 1000
const toVec3 = (v: THREE.Vector3): Vec3 => [round3(v.x), round3(v.y), round3(v.z)]

export type DebugSnapshot = {
  /** Posición del cubo → se pega como `initialPoint` de un hotspot. */
  cube: Vec3
  camera: {
    /** Dónde está la cámara → `positionCamera`. */
    position: Vec3
    /** Hacia dónde mira (centro de giro de los controles) → `target`. */
    target: Vec3
  }
}

export type DebugTools = {
  getSnapshot: () => DebugSnapshot
  dispose: () => void
}

type Params = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  domElement: HTMLElement
  controls: MapControls
}

export function createDebugTools({ scene, camera, domElement, controls }: Params): DebugTools {
  // El cubo se dibuja siempre encima (depthTest: false), aunque quede "adentro" del splat.
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
    new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.85, depthTest: false }),
  )
  cube.renderOrder = 999
  cube.position.copy(controls.target) // arranca donde mira la cámara
  scene.add(cube)

  // Gizmo con flechas para mover el cubo (solo traslación: para un hotspot alcanza con la posición).
  const transform = new TransformControls(camera, domElement)
  transform.setMode('translate')
  transform.setSize(0.8)
  transform.attach(cube)
  const helper = transform.getHelper()
  scene.add(helper)

  // Mientras arrastrás el gizmo se bloquea la cámara (si no, se mueven las dos cosas a la vez).
  transform.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value
  })

  return {
    getSnapshot: () => ({
      cube: toVec3(cube.position),
      camera: { position: toVec3(camera.position), target: toVec3(controls.target) },
    }),
    dispose: () => {
      controls.enabled = true
      transform.detach()
      scene.remove(helper)
      transform.dispose()
      scene.remove(cube)
      cube.geometry.dispose()
      ;(cube.material as THREE.Material).dispose()
    },
  }
}
