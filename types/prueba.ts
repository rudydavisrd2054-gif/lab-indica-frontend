export interface Prueba {
  id: number;
  nombre: string;
  estado?: "DISPONIBLE" | "SIN_REACTIVO" | "SUSPENDIDA";
  nota?: string | null;
  area?: "bioquimica" | "inmunologia" | "hematologia" | "microbiologia" | null;
  descripcion?: string | null;
  cuando_hacerlo?: string | null;
  interpretacion?: string | null;
  tipo_muestra?: string | null;
  preparacion?: string | null;
  indicaciones: string | null;
  tiempo_ayunas: string | null;
}
