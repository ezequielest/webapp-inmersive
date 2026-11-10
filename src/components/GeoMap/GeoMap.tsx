import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// Por defecto MapLibre busca el worker junto a su propio archivo, pero Vite pre-empaqueta la
// librería en dev (.vite/deps) y ahí no existe ("Worker failed to load"). Se le pasa la URL explícita.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { Callout } from '@/components/Callout/Callout'
import type { Hotspot } from '@/data/hotspots'
import { ITAIM_LNG_LAT } from '@/lib/geo'
import styles from './GeoMap.module.scss'

maplibregl.setWorkerUrl(workerUrl)

// Base cartográfica open source (OpenStreetMap vía OpenFreeMap). Se oscurece con CSS.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'
// GeoJSON local con la posición de cada hotspot (se regenera con `npm run geo:generate`).
const GEOJSON_URL = `${import.meta.env.BASE_URL}geo/mar-del-plata.geojson`

type PointFeature = {
  type: 'Feature'
  properties: { id: string; category: string }
  geometry: { type: 'Point'; coordinates: [number, number] }
}
type PointCollection = { type: 'FeatureCollection'; features: PointFeature[] }

type GeoMapProps = {
  hotspots: Hotspot[]
  selectedId: string | null
  /** Si es false el mapa queda oculto y no vuela a la selección. */
  active: boolean
  onHotspotClick: (hotspot: Hotspot) => void
}

export default function GeoMap({ hotspots, selectedId, active, onHotspotClick }: GeoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const coordsRef = useRef<Record<string, [number, number]>>({})
  const [markerEls, setMarkerEls] = useState<Record<string, HTMLDivElement>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    const markers: maplibregl.Marker[] = []

    const map = new maplibregl.Map({
      container,
      style: STYLE_URL,
      center: ITAIM_LNG_LAT,
      zoom: 16,
      pitch: 50,
      bearing: -15,
      attributionControl: { compact: true },
    })
    mapRef.current = map

    map.on('load', async () => {
      try {
        const res = await fetch(GEOJSON_URL)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = (await res.json()) as PointCollection
        if (cancelled) return

        map.addSource('hotspots', { type: 'geojson', data })
        // Halo alrededor del edificio.
        map.addLayer({
          id: 'building-halo',
          type: 'circle',
          source: 'hotspots',
          filter: ['==', ['get', 'category'], 'building'],
          paint: {
            'circle-radius': 28,
            'circle-color': '#2f6bff',
            'circle-opacity': 0.28,
            'circle-blur': 0.7,
          },
        })

        const els: Record<string, HTMLDivElement> = {}
        for (const feature of data.features) {
          const { id } = feature.properties
          const el = document.createElement('div')
          el.className = styles.marker
          markers.push(
            new maplibregl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat(feature.geometry.coordinates)
              .addTo(map),
          )
          els[id] = el
          coordsRef.current[id] = feature.geometry.coordinates
        }
        setMarkerEls(els)
      } catch (err) {
        console.error('geojson error', err)
        if (!cancelled) setError(`No se pudo cargar ${GEOJSON_URL}`)
      }
    })

    return () => {
      cancelled = true
      markers.forEach((m) => m.remove())
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Al mostrarse (o al cambiar la selección) el mapa vuela al hotspot.
  const markersReady = Object.keys(markerEls).length > 0
  useEffect(() => {
    const map = mapRef.current
    if (!map || !active || !selectedId || !markersReady) return
    const center = coordsRef.current[selectedId]
    if (!center) return
    map.resize()
    map.flyTo({ center, zoom: 17, pitch: 55, duration: 1800, essential: true })
  }, [active, selectedId, markersReady])

  return (
    <div className={styles.wrapper}>
      <div className={styles.map} ref={containerRef} />

      {hotspots.map((hotspot) => {
        const el = markerEls[hotspot.id]
        if (!el) return null
        return createPortal(
          <Callout
            label={hotspot.info.label}
            category={hotspot.category}
            selected={hotspot.id === selectedId}
            onClick={() => onHotspotClick(hotspot)}
          />,
          el,
          hotspot.id,
        )
      })}

      {error && (
        <div className={styles.status} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
