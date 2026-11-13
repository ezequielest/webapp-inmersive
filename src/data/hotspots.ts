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
      initialPoint: [9.037, -0.062, -1.223],
      positionCamera: [-0.982, -0.609, 0.002],
      latLong: [-37.99961504592734, -57.549098190740935],
      target: [5.408, 0, -1.202],
      duration: 2500,
    },
    category: 'closeness',
    visible: true,
  },
    {
    id: 'guemes',
    selected: false,
    info: { label: 'Güemes', address: '', description: '' },
    navigation: {
      initialPoint: [3.843, -0.264, -5.871],
      positionCamera: [-1.215, -0.921, 0.958],
      latLong: [-38.018325, -57.543933],
      target: [3.843, -0.264, -5.871],
      duration: 2500,
    },
    category: 'closeness',
    visible: true,
  },
  {
    id: 'itaim',
    info: { label: 'Itaim II', address: 'Quintana e Independencia' },
    navigation: {
      initialPoint: [-0.013, -0.239, 0.005],
      positionCamera: [-0.426, -0.44, 0.366],
      latLong: [-38.01244604983709, -57.56531571638238],
      target: [0, -0.062, 0],
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
      initialPoint: [-0.507, -0.067, 0.524],
      positionCamera: [-0.672, -0.443, -0.22],
      target: [-0.502, -0.046, 0.545],
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
      initialPoint: [4.715, -0.179, 0.602],
      positionCamera: [-0.573, -0.383, -0.007],
      target: [4.715, -0.179, 0.602],
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
      positionCamera: [-0.573, -0.383, -0.007],
      target: [3.913, -0.2, 0.55],
      duration: 2500,
      latLong: [-38.00652615069442, -57.56146873494703],
    },
    category: 'restaurants',
    selected: false,
    visible: false,
  },
  {
    id: 'sushiPop',
    info: { label: 'Sushi Pop', address: '' },
    navigation: {
      initialPoint: [2.22, -0.046, 0.451],
      positionCamera: [-0.74, -0.378, 0.123],
      target: [2.22, -0.046, 0.451],
      duration: 2500,
      latLong: [-38.009775, -57.563997],
    },
    category: 'restaurants',
    selected: false,
    visible: false,
  },
  {
    id: 'galicia',
    info: { label: 'Galicia', address: 'Av. Independencia 3156' },
    navigation: {
      initialPoint: [2.994, -0.038, 0.185],
      positionCamera: [-0.491, -0.257, 0.096],
      target: [2.994, -0.038, 0.185],
      duration: 2500,
      latLong: [-38.00806040663503, -57.56214157295088],
    },
    category: 'bank',
    selected: false,
    visible: false,
  },
  {
    id: 'palkin',
    info: { label: 'Palkin', address: 'Av. Independencia 3501' },
    navigation: {
      initialPoint: [1.351, 0, 0.503],
      positionCamera: [-0.493, -0.313, -0.001],
      target: [1.351, 0, 0.503],
      duration: 2500,
      latLong: [-38.010767, -57.564876],
    },
    category: 'pharmacy',
    selected: false,
    visible: false,
  },
  {
    id: 'ypf',
    info: { label: 'YPF', address: 'Independencia y Quintana' },
    navigation: {
      initialPoint: [0.035, -0.099, 0.553],
      positionCamera: [-0.595, -0.263, 0.127],
      target: [0.035, -0.099, 0.553],
      duration: 2500,
      latLong: [-38.012027714759164, -57.565793669996644],
    },
    category: 'serviceStation',
    selected: false,
    visible: false,
  },
  {
    id: 'shell',
    info: { label: 'Shell', address: 'Av. Independencia 3315' },
    navigation: {
      initialPoint: [2.81, -0.018, 0.514],
      positionCamera: [-0.58, -0.3, 0.071],
      target: [2.81, -0.018, 0.514],
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
      initialPoint: [0.527, 0, 0.596],
      positionCamera: [-0.263, -0.356, -0.092],
      target: [0.527, 0, 0.596],
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
      positionCamera: [-0.507, -0.298, 0.082],
      target: [3.403, -0.05, 0.55],
      duration: 2500,
      latLong: [-38.008408743462574, -57.56297452110692],
    },
    category: 'bank',
    selected: false,
    visible: false,
  },
  {
    id: 'alberEinstein',
    info: { label: 'Instituto Albert Einstein', address: 'La Rioja 3601' },
    navigation: {
      initialPoint: [0.078, -0.053, -1.121],
      positionCamera: [-0.725, -0.641, 0.496],
      target: [0.078, -0.053, -1.121],
      duration: 2500,
      latLong: [-38.013030586430204, -57.563663590163095],
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
