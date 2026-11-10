// Genera public/geo/mar-del-plata.geojson a partir de los hotspots del splat.
// Uso: npm run geo:generate
// Después podés editar a mano las coordenadas de cualquier feature del GeoJSON.
import { mkdirSync, writeFileSync } from 'node:fs'
import { hotspots, categoryLabels } from '../src/data/hotspots.ts'
import { ITAIM_LNG_LAT, splatToLngLat } from '../src/lib/geo.ts'

const features = hotspots.map((h) => ({
  type: 'Feature',
  properties: {
    id: h.id,
    label: h.info.label,
    address: h.info.address ?? '',
    category: h.category,
    categoryLabel: categoryLabels[h.category],
  },
  geometry: {
    type: 'Point',
    // El edificio queda exactamente en la coordenada real.
    //coordinates: h.category === 'building' ? ITAIM_LNG_LAT : splatToLngLat(h.navigation.initialPoint),
    coordinates: [hotspots[0],hotspots[1]]
  },
}))

const geojson = { type: 'FeatureCollection', features }

mkdirSync('public/geo', { recursive: true })
writeFileSync('public/geo/mar-del-plata.geojson', JSON.stringify(geojson, null, 2) + '\n')
console.log(`public/geo/mar-del-plata.geojson (${features.length} features)`)
