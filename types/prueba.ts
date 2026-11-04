export interface Prueba {
  id: number;
  nombre: string;
  estado?: "DISPONIBLE" | "SIN_REACTIVO" | "SUSPENDIDA";
  nota?: string | null;
  area?: "bioquimica" | "inmunologia" | "hematologia" | "microbiologia" | null;
  indicaciones: string | null;
  tiempo_ayunas: string | null;
}
