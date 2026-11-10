/**
 * Configuración del proyecto / sitio.
 * Todo lo que cambia entre proyectos inmobiliarios vive acá.
 */
export const SITE = {
  name: 'Itaim II',

  /** Splat del edificio. Colocar el archivo en public/splats/. */
  splatUrl: '/splats/itaim-ii.sog',

  /** GeoJSON local (public/geo/) con el footprint del edificio y la posición de los hotspots. */
  geoJsonUrl: '/geo/hotspots.geojson',

  /**
   * Centro del mapa en [lng, lat].
   * ⚠️ VALOR PROVISORIO (zona La Perla, Mar del Plata): reemplazar por la coordenada real
   * de Quintana e Independencia. Debe coincidir con el punto del edificio en hotspots.geojson.
   */
  center: [-57.5537, -37.9947] as [number, number],
  zoom: 16,

  /** Estilo base vectorial de OpenFreeMap (open source, sin API key). */
  mapStyleUrl: 'https://tiles.openfreemap.org/styles/positron',
} as const
