// Datos de ejemplo del edificio. Los hotspots reales están en data/hotspots.ts.
// Reemplazar por la API cuando exista.

export type Tipologia = {
  id: string
  name: string
  fromArea: number
  rooms: number
}

export type Unit = {
  id: string
  floor: number
  tipologiaId: string
  area: number
  dormitorios: number
  banos: number
  balcon: boolean
}

export type Amenity = {
  id: string
  name: string
  place: string
  description: string
  kind: 'pool' | 'room'
}

export const building = {
  name: 'Itaim II',
  nickname: 'Tu nuevo hogar',
  address: 'Quintana e Independencia',
  city: 'Mar del Plata',
  status: 'En construcción',
  summary:
    'Un proyecto moderno en el corazón de la ciudad. Diseño, confort y tecnología en una ubicación inmejorable.',
  floors: 10, // PB + P1..P10
}

export const tipologias: Tipologia[] = [
  { id: '2amb', name: '2 ambientes', fromArea: 45, rooms: 2},
  { id: '3amb', name: '3 ambientes', fromArea: 70, rooms: 3 },
  { id: '4amb', name: '4 ambientes', fromArea: 100, rooms: 4 },
]

const specsByTipologia: Record<string, Omit<Unit, 'id' | 'floor' | 'tipologiaId'>> = {
  '2amb': { area: 48, dormitorios: 1, banos: 1, balcon: true },
  '3amb': { area: 72, dormitorios: 2, banos: 2, balcon: true },
  '4amb': { area: 104, dormitorios: 3, banos: 2, balcon: true },
}

// 4 unidades por piso (01..04), rotando tipologías.
export const units: Unit[] = Array.from({ length: building.floors }, (_, i) => i + 1).flatMap(
  (floor) =>
    ['3amb', '2amb', '4amb', '3amb'].map((tipologiaId, idx) => ({
      id: `${floor}0${idx + 1}`,
      floor,
      tipologiaId,
      ...specsByTipologia[tipologiaId],
    })),
)

export const amenities: Amenity[] = [
  { id: 'piscina', name: 'Piscina', place: 'Rooftop', description: 'Disfrutá de la piscina con vista panorámica de la ciudad.', kind: 'pool' },
  { id: 'sum', name: 'SUM', place: 'Planta baja', description: 'Salón de usos múltiples con cocina y parrilla.', kind: 'sum' },
  { id: 'gym', name: 'Gimnasio', place: 'Piso 1', description: 'Equipado con cardio, pesas y zona funcional.', kind: 'gym' },
  { id: 'cowork', name: 'Coworking', place: 'Piso 2', description: 'Espacio de trabajo compartido con salas de reunión.', kind: 'cowork' },
  { id: 'quincho', name: 'Quincho', place: 'Piso 7', description: 'Quincho con parrilla.', kind: 'quincho' },
]

export const getTipologia = (id: string) => tipologias.find((t) => t.id === id)
export const getUnit = (id: string) => units.find((u) => u.id === id)
export const unitsByFloor = (floor: number) => units.filter((u) => u.floor === floor)
export const floorLabel = (floor: number) => (floor === 0 ? 'PB' : `P${floor}`)
