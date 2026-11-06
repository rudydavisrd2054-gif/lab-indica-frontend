import type { Prueba } from "@/types/prueba";

export const LAB = {
  establecimiento: "Centro de Salud Acapulco",
  nombre: "Laboratorio clínico",
  telefono: "924 465 543",
  direccion: "Callao - Callao",
  toma: { desde: "7:30", hasta: "8:40", etiqueta: "7:30 – 8:40 a.m." },
  atencion: { desde: "7:30", hasta: "19:00", etiqueta: "7:30 a.m. – 7:00 p.m." },
} as const;

export function normalizar(texto: string): string {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ");
}

export interface ElementoCatalogo {
  nombre: string;
  detalle?: string;
  palabras: readonly string[];
}

export interface PruebaCatalogo {
  clave: string;
  nombre: string;
  detalle?: string;
  prueba?: Prueba;
}

export interface AreaCatalogo {
  id: string;
  nombre: string;
  color: string;
  items: PruebaCatalogo[];
}

export const AREAS: readonly {
  id: string;
  nombre: string;
  color: string;
  items: readonly ElementoCatalogo[];
}[] = [
  { id: "bioquimica", nombre: "Bioquímica", color: "1", items: [
    { nombre: "Glucosa", palabras: ["glucosa"] },
    { nombre: "Urea", palabras: ["urea"] },
    { nombre: "Creatinina", palabras: ["creatinina"] },
    { nombre: "Ácido úrico", palabras: ["acido urico"] },
    { nombre: "Perfil hepático", palabras: ["perfil hepatico"] },
    { nombre: "Perfil lipídico", palabras: ["perfil lipidico"] },
    { nombre: "Creatinina en orina", palabras: ["creatinina en orina"] },
    { nombre: "Proteína en orina", palabras: ["proteina en orina"] },
  ] },
  { id: "inmunologia", nombre: "Inmunología", color: "2", items: [
    { nombre: "PSA", detalle: "Antígeno prostático específico", palabras: ["psa", "antigeno prostatico"] },
    { nombre: "PCR", detalle: "Proteína C reactiva", palabras: ["pcr", "proteina c reactiva"] },
    { nombre: "RPR", palabras: ["rpr"] },
    { nombre: "Factor reumatoideo", palabras: ["factor reumatoideo", "factor reumatoide"] },
    { nombre: "Aglutinaciones", detalle: "Tifoidea y Malta", palabras: ["aglutinaciones", "aglutinacion", "widal"] },
    { nombre: "ASO", detalle: "Antiestreptolisina O", palabras: ["aso", "antiestreptolisina"] },
  ] },
  { id: "hematologia", nombre: "Hematología", color: "3", items: [
    { nombre: "Hemograma completo", palabras: ["hemograma"] },
    { nombre: "Grupo sanguíneo y factor Rh", palabras: ["grupo sanguineo"] },
    { nombre: "VSG", detalle: "Velocidad de sedimentación globular", palabras: ["vsg", "velocidad de sedimentacion"] },
    { nombre: "Hemoglobina glicosilada", detalle: "HbA1c", palabras: ["hemoglobina glicosilada", "hemoglobina glicada", "hba1c"] },
  ] },
  { id: "microbiologia", nombre: "Microbiología", color: "4", items: [
    { nombre: "Orina completa", palabras: ["orina completa", "examen general de orina", "examen de orina"] },
    { nombre: "Parásitos", detalle: "Coproparasitológico: 1, 2 y 3 muestras", palabras: ["parasito", "parasitos", "parasitologico", "coproparasitologico"] },
    { nombre: "Test de Graham", detalle: "Investigación de oxiuros", palabras: ["graham"] },
    { nombre: "Reacción inflamatoria en heces", palabras: ["reaccion inflamatoria"] },
    { nombre: "Test de Thevenon", detalle: "Sangre oculta en heces", palabras: ["thevenon", "sangre oculta"] },
  ] },
];

function coincide(nombre: string, palabra: string): boolean {
  const escapada = normalizar(palabra).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapada}($|[^\\p{L}\\p{N}])`, "u").test(nombre);
}

export function construirAreas(pruebas: Prueba[]): AreaCatalogo[] {
  const areas: AreaCatalogo[] = AREAS.map((area) => ({
    id: area.id, nombre: area.nombre, color: area.color,
    items: area.items.map((item, indice) => ({
      clave: `${area.id}-${indice}`, nombre: item.nombre, detalle: item.detalle,
    })),
  }));
  const otras: PruebaCatalogo[] = [];
  const nombresVisibles = new Set<string>();
  for (const [indice, prueba] of pruebas.entries()) {
    const nombre = normalizar(prueba.nombre);
    if (nombresVisibles.has(nombre)) continue;
    nombresVisibles.add(nombre);
    let mejor: { area: number; item: number; longitud: number } | undefined;
    AREAS.forEach((area, indiceArea) => area.items.forEach((item, indiceItem) => {
      if (prueba.area && prueba.area !== area.id) return;
      for (const palabra of item.palabras) {
        const longitud = normalizar(palabra).length;
        if (coincide(nombre, palabra) && (!mejor || longitud > mejor.longitud)) {
          mejor = { area: indiceArea, item: indiceItem, longitud };
        }
      }
    }));
    const destino = mejor ? areas[mejor.area].items[mejor.item] : undefined;
    if (destino && !destino.prueba) destino.prueba = prueba;
    else {
      const item = { clave: `api-${prueba.id}-${indice}`, nombre: prueba.nombre, prueba };
      const areaAsignada = areas.find((area) => area.id === prueba.area);
      if (areaAsignada) areaAsignada.items.push(item);
      else otras.push(item);
    }
  }
  if (otras.length) {
    areas.push({ id: "otras", nombre: "Otras pruebas", color: "5", items: otras });
    if (process.env.NODE_ENV !== "production") console.warn("Pruebas sin catálogo (Otras pruebas):", otras.map((item) => item.nombre));
  }
  return areas.map((area) => ({ ...area, items: area.items.filter((item) => item.prueba).sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base", numeric: true })) }))
    .filter((area) => area.items.length > 0);
}

export function filtrarAreas(areas: AreaCatalogo[], consulta: string): AreaCatalogo[] {
  const termino = normalizar(consulta);
  if (!termino) return areas;
  return areas.map((area) => ({
    ...area,
    items: area.items.filter((item) => normalizar(`${item.nombre} ${item.detalle ?? ""} ${item.prueba?.nombre ?? ""}`).includes(termino)),
  })).filter((area) => area.items.length > 0);
}

export function minutos(hora: string): number {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}
