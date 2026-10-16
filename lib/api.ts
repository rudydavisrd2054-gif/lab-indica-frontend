import type { Prueba } from "@/types/prueba";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getPruebas(signal?: AbortSignal): Promise<Prueba[]> {
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/api/pruebas`, { signal });
    if (!res.ok) throw new Error(`No se pudieron obtener las pruebas (HTTP ${res.status}).`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error("La respuesta de pruebas debe ser un arreglo.");
    if (!data.every((item: unknown): item is Prueba => typeof item === "object" && item !== null &&
      "id" in item && typeof item.id === "number" &&
      "nombre" in item && typeof item.nombre === "string" &&
      "indicaciones" in item && (item.indicaciones === null || typeof item.indicaciones === "string") &&
      "tiempo_ayunas" in item &&
      (item.tiempo_ayunas === null || typeof item.tiempo_ayunas === "string"))) {
      throw new Error("La respuesta contiene pruebas con campos inválidos.");
    }
    return data;
  } catch (error) {
    if (signal?.aborted) throw error;
    const detalle = error instanceof Error ? error.message : "Error desconocido.";
    throw new Error(`No se pudieron cargar las pruebas: ${detalle}`);
  }
}
