import { LAB, minutos } from "@/lib/laboratorio";

export default function PanelHorarios() {
  const inicio = minutos(LAB.atencion.desde);
  const duracion = minutos(LAB.atencion.hasta) - inicio;
  const izquierda = ((minutos(LAB.toma.desde) - inicio) / duracion) * 100;
  const ancho = ((minutos(LAB.toma.hasta) - minutos(LAB.toma.desde)) / duracion) * 100;

  return (
    <aside aria-label="Horarios" className="flex min-w-0 flex-col gap-4 rounded-[18px] border border-lab-line bg-lab-surface p-5">
      <h2 className="font-lab-display text-[15px] leading-[1.12] font-bold tracking-[.02em] text-lab-muted uppercase">Horarios del laboratorio</h2>
      <div className="grid grid-cols-1 gap-3 min-[640px]:grid-cols-2">
        {[{ ...LAB.toma, titulo: "Toma y recepción de muestras", clave: true }, { ...LAB.atencion, titulo: "Atención del laboratorio", clave: false }].map((horario) => (
          <div key={horario.titulo} className="flex min-w-0 flex-col gap-1">
            <small className="text-[13px] leading-[1.3] text-lab-muted">{horario.titulo}</small>
            <strong className={`font-lab-mono text-[clamp(17px,4.6vw,22px)] leading-[1.2] font-semibold ${horario.clave ? "text-lab-hl" : ""}`}>{horario.etiqueta}</strong>
          </div>
        ))}
      </div>
      <div className="relative mt-[22px] mb-2 h-3 rounded-full bg-lab-track" role="img" aria-label={`La toma de muestras, de ${LAB.toma.desde} a ${LAB.toma.hasta}, ocupa el primer tramo de la atención, de ${LAB.atencion.desde} a ${LAB.atencion.hasta}.`}>
        <span className="absolute inset-y-0 rounded-full bg-lab-hl" style={{ left: `${izquierda}%`, width: `${ancho}%` }} />
        <span className="absolute top-[18px] left-0 font-lab-mono text-[11px] font-medium text-lab-muted">{LAB.atencion.desde}</span>
        <span className="absolute -top-5 -translate-x-1/2 font-lab-mono text-[11px] font-semibold text-lab-hl" style={{ left: `${izquierda + ancho}%` }}>{LAB.toma.hasta}</span>
        <span className="absolute top-[18px] right-0 font-lab-mono text-[11px] font-medium text-lab-muted">{LAB.atencion.hasta}</span>
      </div>
      <p className="mt-2 text-[13px] text-lab-muted">Llega antes de las {LAB.toma.hasta} a.m. si tu estudio requiere toma de muestra.</p>
    </aside>
  );
}
