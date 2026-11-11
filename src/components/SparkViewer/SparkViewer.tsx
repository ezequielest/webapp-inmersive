import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { SparkRenderer, SplatMesh, dyno } from '@sparkjsdev/spark'
import { Callout } from '@/components/Callout/Callout'
import { getHotspot, type Hotspot } from '@/data/hotspots'
import { DebugPanel } from './DebugPanel'
import { createDebugTools, type DebugTools } from './debugTools'
import styles from './SparkViewer.module.scss'

/**
 * Convención de ejes del splat. Los hotspots y cámaras de itaim-ii.sog están medidos
 * con "Y hacia abajo" (y negativo = arriba), por eso la cámara usa up = (0, -1, 0).
 * Si el modelo se viera de cabeza, ponerlo en `false` (rota el splat 180° en X).
 */
const Y_DOWN = true;

const REVEAL_MS = 6000 // duración total del efecto

const FOCUS_AT = 0.15 // fracción del efecto (0 a 1) en la que arranca el acercamiento

/** Id del hotspot principal (el único donde se permite orbitar). Ajustalo al de tus datos. */
const MAIN_HOTSPOT_ID = 'itaim'

/** Vista inicial de la cámara (antes del efecto y del primer acercamiento). */
const INITIAL_VIEW = {
  positionCamera: [-3.351, -2.81, 3.644] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
}

/** Se puede orbitar si está el principal seleccionado, o si todavía no hay ninguno. */
const canOrbit = (id: string | null) => id === null || id === MAIN_HOTSPOT_ID

type Navigation = Hotspot['navigation']

type ViewerApi = {
  focus: (nav: Navigation, animate: boolean) => void
  setActive: (active: boolean) => void
  setOrbit: (enabled: boolean) => void
  debug?: DebugTools
}

type SparkViewerProps = {
  /** ej: "/splats/itaim-ii.sog" */
  url: string
  /** Hotspots a dibujar (ya filtrados). */
  hotspots: Hotspot[]
  selectedId: string | null
  /** Si es false se pausa el render (por ejemplo, cuando se muestra el mapa). */
  active: boolean
  onHotspotClick: (hotspot: Hotspot) => void
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function SparkViewer({
  url,
  hotspots,
  selectedId,
  active,
  onHotspotClick,
}: SparkViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const anchors = useRef(new Map<string, HTMLDivElement>())
  const apiRef = useRef<ViewerApi | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // Modo debug: se lee UNA vez al montar (no en cada render), así sigue activo aunque
  // la app navegue a otra ruta y `?debug` desaparezca de la URL.
  const [debug] = useState(() => new URLSearchParams(window.location.search).has('debug'))
  const getDebugSnapshot = useCallback(() => apiRef.current?.debug?.getSnapshot() ?? null, [])

  // El loop de render lee siempre los valores más recientes desde refs.
  const hotspotsRef = useRef(hotspots)
  const selectedRef = useRef(selectedId)
  const activeRef = useRef(active)
  useEffect(() => {
    hotspotsRef.current = hotspots
    selectedRef.current = selectedId
    activeRef.current = active
  }, [hotspots, selectedId, active])

  // Cámara → hotspot seleccionado.
  useEffect(() => {
    const hotspot = selectedId ? getHotspot(selectedId) : undefined
    if (hotspot) apiRef.current?.focus(hotspot.navigation, true)
  }, [selectedId])

  useEffect(() => {
    apiRef.current?.setOrbit(canOrbit(selectedId))
  }, [selectedId])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let started = false
    let cleanup: (() => void) | undefined

    const init = () => {
      const renderer = new THREE.WebGLRenderer({ antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setClearColor(0x070b14)
      container.prepend(renderer.domElement)
      const reveal = createReveal()
      const splat = new SplatMesh({ url, objectModifier: reveal.modifier })

      const scene = new THREE.Scene()
      const spark = new SparkRenderer({ renderer })
      scene.add(spark)

      const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.01,
        1000,
      )
      // `up` tiene que definirse antes de crear los controles.
      if (Y_DOWN) camera.up.set(0, -1, 0)
      camera.position.set(0, Y_DOWN ? -1 : 1, 10);

      let revealStart: number | null = null;
      let focusFired = false;

      const controls = new MapControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.minDistance = 0.5
      controls.maxDistance = 200
      controls.maxPolarAngle = Math.PI / 2.05
      
      // Anclado: nunca se desplaza el target, solo se orbita alrededor de él
      controls.enablePan = false
      controls.zoomToCursor = false
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_ROTATE,
      }
      
      // Solo se puede girar en el punto principal
      controls.enableRotate = canOrbit(selectedRef.current);

      camera.position.set(...INITIAL_VIEW.positionCamera)
      controls.target.set(...INITIAL_VIEW.target)
      controls.update()

      if (!Y_DOWN) splat.quaternion.set(1, 0, 0, 0)
      scene.add(splat)

      // Cubo + gizmo para leer coordenadas (solo con ?debug).
      const debugTools = debug
        ? createDebugTools({ scene, camera, domElement: renderer.domElement, controls })
        : null

      // --- Vuelo de cámara ---
      type Tween = {
        t0: number
        duration: number
        fromPos: THREE.Vector3
        toPos: THREE.Vector3
        fromTarget: THREE.Vector3
        toTarget: THREE.Vector3
      }
      let tween: Tween | null = null

      const focus = (nav: Navigation, animate: boolean) => {
        const toPos = new THREE.Vector3(...nav.positionCamera)
        const toTarget = new THREE.Vector3(...nav.target)
        if (!animate || nav.duration <= 0) {
          tween = null
          camera.position.copy(toPos)
          controls.target.copy(toTarget)
          controls.update()
          return
        }
        tween = {
          t0: performance.now(),
          duration: nav.duration,
          fromPos: camera.position.clone(),
          toPos,
          fromTarget: controls.target.clone(),
          toTarget,
        }
      }

      // Si el usuario toma el control, se cancela el vuelo.
      const cancelTween = () => {
        tween = null
      }
      controls.addEventListener('start', cancelTween)

      // --- Callouts: se proyecta cada punto 3D a pantalla ---
      const projected = new THREE.Vector3()
      const positionAnchors = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        for (const hotspot of hotspotsRef.current) {
          const el = anchors.current.get(hotspot.id)
          if (!el) continue
          projected.set(...hotspot.navigation.initialPoint).project(camera)
          const visible =
            projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 1.2 && Math.abs(projected.y) < 1.2
          el.style.visibility = visible ? 'visible' : 'hidden'
          if (!visible) continue
          const x = (projected.x * 0.5 + 0.5) * w
          const y = (-projected.y * 0.5 + 0.5) * h
          // El punto de anclaje del callout es el centro de su borde inferior.
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`
          // Los más cercanos a la cámara quedan por encima.
          el.style.zIndex = String(Math.round((1 - projected.z) * 1000))
        }
      }

      const tick = () => {
        if (tween) {
          const k = Math.min((performance.now() - tween.t0) / tween.duration, 1)
          const e = easeInOutCubic(k)
          camera.position.lerpVectors(tween.fromPos, tween.toPos, e)
          controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e)
          if (k >= 1) tween = null
        }

        if (revealStart !== null) {
          const k = Math.min((performance.now() - revealStart) / REVEAL_MS, 1)
          reveal.t.value = k
          splat.updateVersion()
        
          // El acercamiento arranca cuando el efecto llega a FOCUS_AT, sin esperar al final
          if (!focusFired && k >= FOCUS_AT) {
            focusFired = true
            const hotspot = selectedRef.current ? getHotspot(selectedRef.current) : undefined
            if (hotspot) focus(hotspot.navigation, true)
          }
        
          if (k >= 1) revealStart = null
        }

        controls.update()
        renderer.render(scene, camera)
        positionAnchors()
      }

      let running = false
      const setActive = (isActive: boolean) => {
        if (isActive && !running) {
          renderer.setAnimationLoop(tick)
          running = true
        } else if (!isActive && running) {
          renderer.setAnimationLoop(null)
          running = false
        }
      }

      apiRef.current = {
        focus,
        setActive,
        setOrbit: (enabled) => {
          controls.enableRotate = enabled
        },
        debug: debugTools ?? undefined,
      }
      setActive(activeRef.current)

      const ready = splat.initialized
      ready
        .then(() => {
          if (cancelled) return
          console.log('splat listo', splat.numSplats)
          setStatus('ready');
          const box = splat.getBoundingBox() // espacio local del objeto
          
          
          //efecto de inicio
          const c = box.getCenter(new THREE.Vector3())
          const s = box.getSize(new THREE.Vector3())
          const r = Math.max(s.x, s.y, s.z) / 2

          reveal.origin.value.copy(c)
          reveal.radius.value = r
          reveal.pointSize.value = r * 0.0003
          revealStart = performance.now()



          /*const initial = selectedRef.current ? getHotspot(selectedRef.current) : undefined 
          if (initial) {
            focus(initialPoint, false)
            focus(initial.navigation, true)
            revealStart = performance.now()
          }*/ 
            
        })
        .catch((err: unknown) => {
          if (cancelled) return
          console.error('splat error', err)
          setStatus('error')
        })

      const ro = new ResizeObserver(() => {
        const { clientWidth: w, clientHeight: h } = container
        if (!w || !h) return
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      })
      ro.observe(container)

      return () => {
        apiRef.current = null
        ro.disconnect()
        renderer.setAnimationLoop(null)
        controls.removeEventListener('start', cancelTween)
        debugTools?.dispose()
        controls.dispose()
        scene.remove(splat)
        // Esperar a que termine la carga antes de liberar el splat
        ready.catch(() => {}).finally(() => splat.dispose())
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
    }

    // No inicializar hasta que el contenedor tenga tamaño real
    const waitForSize = new ResizeObserver(() => {
      if (started || cancelled) return
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        started = true
        waitForSize.disconnect()
        cleanup = init()
      }
    })
    waitForSize.observe(container)

    return () => {
      cancelled = true
      waitForSize.disconnect()
      cleanup?.()
    }
  }, [url, debug])

  /**
 * Efecto "puntos → gaussians": cada splat pasa de tamaño de punto a su tamaño real,
 * empezando por el centro del modelo y expandiéndose hacia los bordes.
 */
  function createReveal() {
    const t = dyno.dynoFloat(0) // progreso 0 → 1
    const origin = dyno.dynoVec3(new THREE.Vector3())
    const radius = dyno.dynoFloat(1)
    const pointSize = dyno.dynoFloat(0.003)
    const appearBand = dyno.dynoFloat(0.15) // ancho de la zona donde aparecen los puntos
    const inflateBand = dyno.dynoFloat(0.35) // ancho de la zona donde se inflan a gaussian
    const glow = dyno.dynoFloat(0.6) // brillo del frente de la onda (0 = sin brillo)
  
    const modifier = dyno.dynoBlock(
      { gsplat: dyno.Gsplat },
      { gsplat: dyno.Gsplat },
      ({ gsplat }) => {
        const d = new dyno.Dyno({
          inTypes: {
            gsplat: dyno.Gsplat,
            t: 'float',
            origin: 'vec3',
            radius: 'float',
            pointSize: 'float',
            appearBand: 'float',
            inflateBand: 'float',
            glow: 'float',
          },
          outTypes: { gsplat: dyno.Gsplat },
          statements: ({ inputs, outputs }) =>
            dyno.unindentLines(`
              ${outputs.gsplat} = ${inputs.gsplat};
  
              // distancia normalizada al origen de la onda (0 = centro, 1 = borde)
              float dist = min(length(${inputs.gsplat}.center - ${inputs.origin}) / ${inputs.radius}, 1.0);
  
              // posición del frente de la onda: cuando t = 1 ya pasó por todo el modelo
              float front = ${inputs.t} * (1.0 + ${inputs.appearBand} + ${inputs.inflateBand});
              float behind = front - dist; // > 0 si el frente ya pasó por este splat
  
              // 1) aparece como punto al pasar el frente
              float appear = smoothstep(0.0, ${inputs.appearBand}, behind);
              // 2) después se infla hasta su tamaño real
              float inflate = smoothstep(0.0, ${inputs.inflateBand}, behind - ${inputs.appearBand});
  
              ${outputs.gsplat}.scales = mix(
                min(vec3(${inputs.pointSize}), ${inputs.gsplat}.scales),
                ${inputs.gsplat}.scales,
                inflate
              );
              ${outputs.gsplat}.rgba.a = ${inputs.gsplat}.rgba.a * appear;
  
              // anillo de brillo justo en el frente
              float half_band = ${inputs.appearBand} * 0.5;
              float ring = smoothstep(0.0, half_band, behind)
                         * (1.0 - smoothstep(half_band, half_band * 3.0, behind));
              ${outputs.gsplat}.rgba.rgb += ring * ${inputs.glow} * vec3(0.35, 0.6, 1.0);
            `),
        })
        return {
          gsplat: d.apply({
            gsplat, t, origin, radius, pointSize, appearBand, inflateBand, glow,
          }).gsplat,
        }
      },
    )
  
    return { modifier, t, origin, radius, pointSize }
  }

  return (
    <div className={styles.viewer} ref={containerRef}>
      <div className={styles.overlay}>
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={styles.anchor}
            ref={(el) => {
              if (el) anchors.current.set(hotspot.id, el)
              else anchors.current.delete(hotspot.id)
            }}
          >
            <Callout
              label={hotspot.info.label}
              category={hotspot.category}
              selected={hotspot.id === selectedId}
              onClick={() => {
                // Vuelve a volar aunque ya estuviera seleccionado.
                apiRef.current?.focus(hotspot.navigation, true)
                onHotspotClick(hotspot)
              }}
            />
          </div>
        ))}
      </div>

      {debug && <DebugPanel getSnapshot={getDebugSnapshot} />}

      {status !== 'ready' && (
        <div className={styles.status} role="status">
          {status === 'loading' ? (
            'Cargando splat…'
          ) : (
            <>
              No se pudo cargar <code>{url}</code>
              <small>Verificá que el archivo exista en public/splats.</small>
            </>
          )}
        </div>
      )}
    </div>
  )
}
