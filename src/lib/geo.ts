import type { Vec3 } from '@/data/hotspots'

/** Itaim II — [lng, lat] (formato MapLibre/GeoJSON). */
export const ITAIM_LNG_LAT: [number, number] = [-57.56533516443009, -38.012445162880326]

/**
 * Calibración splat → mapa. ⚠️ Valores provisorios: el splat no trae georreferencia.
 * - METERS_PER_UNIT: cuántos metros reales representa 1 unidad del splat.
 * - BEARING_DEG: rotación horizontal (en sentido horario) entre el eje del splat y el norte.
 * Ajustalos y corré `npm run geo:generate` para regenerar public/geo/mar-del-plata.geojson.
 */
export const METERS_PER_UNIT = 100
export const BEARING_DEG = 0

const METERS_PER_DEG_LAT = 111_320

/** Convierte un punto del splat (x = este, -z = norte, y = altura) a [lng, lat]. */
export function splatToLngLat([x, , z]: Vec3, origin = ITAIM_LNG_LAT): [number, number] {
  const east = x * METERS_PER_UNIT
  const north = -z * METERS_PER_UNIT

  const a = (BEARING_DEG * Math.PI) / 180
  const e = east * Math.cos(a) - north * Math.sin(a)
  const n = east * Math.sin(a) + north * Math.cos(a)

  const lat = origin[1] + n / METERS_PER_DEG_LAT
  const lng = origin[0] + e / (METERS_PER_DEG_LAT * Math.cos((origin[1] * Math.PI) / 180))
  return [lng, lat]
}
