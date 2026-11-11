// Hotspots reales de itaim-ii.sog. Las coordenadas están en el espacio del splat.

export type HotspotCategory =
  | 'closeness'
  | 'building'
  | 'superMarket'
  | 'cafes'
  | 'restaurants'
  | 'pharmacy'
  | 'serviceStation'
  | 'bank'

export type Vec3 = [number, number, number]
export type Vec2 = [number, number]

export type Hotspot = {
  id: string
  selected?: boolean
  info: {
    label: string
    address?: string
    description?: string
  }
  navigation: {
    /** Posición del disparador flotante (donde se dibuja el callout). */
    initialPoint: Vec3
    positionCamera: Vec3
    target: Vec3
    /** ms */
    duration: number
    latLong: Vec2
  }
  category: HotspotCategory
  visible: boolean
}

/** Categorías que se pueden filtrar como "puntos de interés". */
export type PoiCategory = Exclude<HotspotCategory, 'closeness' | 'building'>

export const categoryLabels: Record<HotspotCategory, string> = {
  closeness: 'Cercanía',
  building: 'Edificio',
  superMarket: 'Supermercados',
  cafes: 'Cafés',
  restaurants: 'Restaurantes',
  pharmacy: 'Farmacias',
  serviceStation: 'Estaciones de servicio',
  bank: 'Bancos',
}

export const poiCategories: { id: PoiCategory; label: string }[] = [
  { id: 'superMarket', label: categoryLabels.superMarket },
  { id: 'cafes', label: categoryLabels.cafes },
  { id: 'restaurants', label: categoryLabels.restaurants },
  { id: 'pharmacy', label: categoryLabels.pharmacy },
  { id: 'serviceStation', label: categoryLabels.serviceStation },
  { id: 'bank', label: categoryLabels.bank },
]

export const hotspots: Hotspot[] = [
  {
    id: 'centro',
    selected: false,
    info: { label: 'Centro', address: '', description: '' },
    navigation: {
      initialPoint: [5, -0.2, -2],
      positionCamera: [-0.768, -0.629, 1.424],
      latLong: [-37.99961504592734, -57.549098190740935],
      target: [0, 0, 0],
      duration: 2500,
    },
    category: 'closeness',
    visible: true,
  },
  {
    id: 'itaim',
    info: { label: 'Itaim II', address: 'Quintana e Independencia' },
    navigation: {
      initialPoint: [-0.528, -0.404, 0.518],
      positionCamera: [-0.426, -0.44, 0.366],
      latLong: [-38.01244604983709, -57.56531571638238],
      target: [-0.027, 0, -0.051],
      duration: 2500,
    },
    category: 'building',
    selected: true,
    visible: true,
  },
  {
    id: 'vea',
    info: { label: 'Supermercado Vea', address: 'Quintana e Independencia' },
    navigation: {
      initialPoint: [-0.26, -0.1, 0.55],
      positionCamera: [-0.595, -0.263, 0.127],
      target: [-0.009, -0.026, 0.298],
      duration: 2500,
      latLong: [-38.012370300297334, -57.566218950037],
    },
    category: 'superMarket',
    selected: false,
    visible: false,
  },
  {
    id: 'starbucks',
    info: { label: 'Starbucks', address: '' },
    navigation: {
      initialPoint: [3.913, -0.05, 0.55],
      positionCamera: [-0.595, -0.255, 0.127],
      target: [0, 0, 0],
      duration: 2500,
      latLong: [-38.00629052709612, -57.56130484172976],
    },
    category: 'cafes',
    selected: false,
    visible: false,
  },
  {
    id: 'burgerKing',
    info: { label: 'Burger King', address: '' },
    navigation: {
      initialPoint: [3.913, -0.2, 0.55],
      positionCamera: [-0.595, -0.263, 0.127],
      target: [0, 0, 0],
      duration: 2500,
      latLong: [-38.00652615069442, -57.56146873494703],
    },
    category: 'restaurants',
    selected: false,
    visible: false,
  },
  {
    id: 'galicia',
    info: { label: 'Galicia', address: 'Av. Independencia 3156' },
    navigation: {
      initialPoint: [2.276, -0.2, 0.55],
      positionCamera: [-0.595, -0.263, 0.127],
      target: [0, 0, 0],
      duration: 2500,
      latLong: [-38.00806040663503, -57.56214157295088],
    },
    category: 'superMarket',
    selected: false,
    visible: false,
  },
  {
    id: 'palkin',
    info: { label: 'Palkin', address: 'Av. Independencia 3501' },
    navigation: {
      initialPoint: [0.276, -0.2, 0.55],
      positionCamera: [-0.595, -0.263, 0.127],
      target: [-0.009, -0.026, 0.298],
      duration: 2500,
      latLong: [-38.00629052709612, -57.56130484172976],
    },
    category: 'pharmacy',
    selected: false,
    visible: false,
  },
  {
    id: 'ypf',
    info: { label: 'YPF', address: 'Independencia y Quintana' },
    navigation: {
      initialPoint: [0.276, -0.2, 0.55],
      positionCamera: [-0.595, -0.263, 0.127],
      target: [-0.009, -0.026, 0.298],
      duration: 2500,
      latLong: [-38.00629052709612, -57.56130484172976],
    },
    category: 'serviceStation',
    selected: false,
    visible: false,
  },
  {
    id: 'shell',
    info: { label: 'Shell', address: 'Av. Independencia 3315' },
    navigation: {
      initialPoint: [2.629, -0.2, 0.55],
      positionCamera: [-1.124, -0.805, -0.879],
      target: [0.131, -0.162, -0.486],
      duration: 2500,
      latLong: [-38.009226685674655, -57.56361518917177],
    },
    category: 'serviceStation',
    selected: false,
    visible: false,
  },
  {
    id: 'bna',
    info: { label: 'BNA', address: 'Av. Independencia' },
    navigation: {
      initialPoint: [0.619, -0.052, 0.55],
      positionCamera: [-2.168, -0.957, -1.111],
      target: [0, 0, 0],
      duration: 2500,
      latLong: [-38.008408743462574, -57.56297452110692],
    },
    category: 'bank',
    selected: false,
    visible: false,
  },
  {
    id: 'provincia',
    info: { label: 'Provincia', address: 'Av Independencia 3205' },
    navigation: {
      initialPoint: [3.403, -0.05, 0.55],
      positionCamera: [-2.168, -0.957, -1.0],
      target: [0, 0, 0],
      duration: 2500,
      latLong: [-38.008408743462574, -57.56297452110692],
    },
    category: 'bank',
    selected: false,
    visible: false,
  },
]

export const buildingHotspot = hotspots.find((h) => h.category === 'building') ?? hotspots[0]
/** Alias usado por hooks/useHotspotExplorer.ts. */
export const homeHotspot = buildingHotspot

/** Hotspots que cuentan como "puntos de interés" (se listan y se filtran por categoría). */
export const isPoi = (h: Hotspot) => h.category !== 'building' && h.category !== 'closeness'

export const getHotspot = (id: string) => hotspots.find((h) => h.id === id)
