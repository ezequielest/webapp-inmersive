
import { hotspots } from '@/data/hotspots'
import type { FeatureCollection, Point } from 'geojson'

export const getHotspotsGeoJSON = (): FeatureCollection<
  Point,
  {
    id: string
    label: string
    address: string
    category: string
    categoryLabel: string
  }
> => {
  const features = hotspots
    .filter((hotspot) => {
      // Solo incluir hotspots visibles y con coordenadas válidas
      const [lat, lng] = hotspot.navigation.latLong

      return (
        hotspot.navigation.latLong.length === 2 &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat !== 0 &&
        lng !== 0
      )
    })
    .map((hotspot) => {
      const [lat, lng] = hotspot.navigation.latLong

      return {
        type: 'Feature' as const,

        properties: {
          id: hotspot.id,
          label: hotspot.info.label,
          address: hotspot.info.address ?? '',
          category: hotspot.category,
          categoryLabel: '',
        },

        geometry: {
          type: 'Point' as const,

          // GeoJSON requiere [LONGITUD, LATITUD]
          coordinates: [lng, lat] as [number, number],
        },
      }
    })

  return {
    type: 'FeatureCollection',
    features,
  }
}
