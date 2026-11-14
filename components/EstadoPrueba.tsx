import type { Prueba } from "@/types/prueba";

export default function EstadoPrueba({ prueba }: { prueba?: Prueba }) {
  if (!prueba?.estado) return null;
  const estados = {
    DISPONIBLE: { texto: "Disponible", clase: "border-green-200 bg-green-50 text-green-800" },
    SIN_REACTIVO: { texto: "Sin reactivo", clase: "border-slate-300 bg-slate-100 text-slate-700" },
    SUSPENDIDA: { texto: "Suspendida", clase: "border-red-200 bg-red-50 text-red-800" },
  };
  const estado = estados[prueba.estado];
  if (!estado) return null;
  return <span className="mt-1.5 block text-xs font-normal">
    <span className={`inline-flex rounded-full border px-2 py-0.5 font-semibold ${estado.clase}`}>{estado.texto}</span>
    {prueba.estado !== "DISPONIBLE" && prueba.nota?.trim() && <span className="mt-1 block whitespace-pre-line text-slate-700">{prueba.nota}</span>}
  </span>;
}
