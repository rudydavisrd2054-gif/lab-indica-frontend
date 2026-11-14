"use client";

import { useSyncExternalStore } from "react";
import { LAB, minutos } from "@/lib/laboratorio";

const relojLima = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function suscribirReloj(actualizar: () => void) {
  const intervalo = window.setInterval(actualizar, 1000);
  window.addEventListener("focus", actualizar);
  document.addEventListener("visibilitychange", actualizar);
  return () => {
    window.clearInterval(intervalo);
    window.removeEventListener("focus", actualizar);
    document.removeEventListener("visibilitychange", actualizar);
  };
}

const leerReloj = () => Math.floor(Date.now() / 1000);
const relojServidor = () => null;

export default function PanelHorarios() {
  const ahora = useSyncExternalStore(suscribirReloj, leerReloj, relojServidor);
  const hora = ahora === null ? null : relojLima.format(new Date(ahora * 1000));
  const [horas, minuto, segundo] = hora?.split(":").map(Number) ?? [0, 0, 0];
  const minutoActual = horas * 60 + minuto + segundo / 60;
  const inicio = minutos(LAB.atencion.desde);
  const duracion = minutos(LAB.atencion.hasta) - inicio;
  const izquierda = ((minutos(LAB.toma.desde) - inicio) / duracion) * 100;
  const ancho = ((minutos(LAB.toma.hasta) - minutos(LAB.toma.desde)) / duracion) * 100;
  const progreso = ahora === null ? 0 : Math.max(0, Math.min(100, ((minutoActual - inicio) / duracion) * 100));
  const terminoToma = minutoActual >= minutos(LAB.toma.hasta);
  const estado = ahora === null ? "Consultando hora de Lima…" : minutoActual < inicio
    ? "La atención comienza a las 7:30 a. m."
    : minutoActual >= minutos(LAB.atencion.hasta) ? "Atención finalizada por hoy."
    : terminoToma ? "Toma de muestras finalizada · Atención del laboratorio en curso."
    : "Toma y recepción de muestras en curso.";

  return (
    <aside aria-label="Horarios" className="@container flex min-w-0 flex-col gap-2 rounded-[18px] border border-lab-line bg-lab-surface p-5">
      <h2 className="font-lab-display text-[15px] leading-[1.12] font-bold tracking-[.02em] text-lab-muted uppercase">Horarios del laboratorio</h2>
      <div className="grid grid-cols-1 gap-3 min-[640px]:grid-cols-2">
        {[{ ...LAB.toma, titulo: "Toma y recepción de muestras", clave: true }, { ...LAB.atencion, titulo: "Atención del laboratorio", clave: false }].map((horario) => (
          <div key={horario.titulo} className="flex min-w-0 flex-col gap-1">
            <small className="text-[13px] leading-[1.3] text-lab-muted">{horario.titulo}</small>
            <strong className={`font-lab-mono text-[clamp(15px,3.2cqw,22px)] leading-[1.2] font-semibold ${horario.clave ? "text-lab-hl" : ""}`}>{horario.etiqueta}</strong>
          </div>
        ))}
      </div>
      <div className="relative mt-5 mb-4 shrink-0 rounded-full" style={{ height: 16, minHeight: 16, background: "#e2e5ed", boxShadow: "0 0 0 3px #f0f1f7, inset 0 1px 2px rgb(30 41 59 / 8%)" }} role="progressbar" aria-label="Tiempo transcurrido del horario de atención" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progreso)} aria-valuetext={`${hora ?? "Hora pendiente"}, hora de Lima. ${estado}`}>
        <span className="absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-1000 ease-linear motion-reduce:transition-none" style={{ width: `${progreso}%`, backgroundColor: "#0047AB" }} />
        <span className="absolute -top-1 h-1 w-px bg-lab-hl" style={{ left: `${izquierda + ancho}%` }} />
        {ahora !== null && <span aria-hidden="true" className="absolute inset-y-0 w-[18%] rounded-full transition-[left] duration-1000 ease-linear motion-reduce:transition-none" style={{ left: `clamp(0%, calc(${progreso}% - 9%), 82%)`, background: "#0047AB", boxShadow: "none" }} />}
        <span className="absolute top-[18px] left-0 font-lab-mono text-[11px] font-medium text-lab-muted">{LAB.atencion.desde}</span>
        <span className="absolute -top-5 -translate-x-1/2 font-lab-mono text-[11px] font-semibold text-lab-hl" style={{ left: `${izquierda + ancho}%` }}>{LAB.toma.hasta}</span>
        <span className="absolute top-[18px] right-0 font-lab-mono text-[11px] font-medium text-lab-muted">{LAB.atencion.hasta}</span>
      </div>
      <div className="text-[11px] leading-tight text-lab-muted">
        <p className="font-lab-mono tabular-nums">{hora ? `${hora} · Hora de Lima` : "Consultando hora de Lima…"}</p>
        <p className="mt-0.5">{estado}</p>
      </div>
      <p className="text-[13px] text-lab-muted">Llega antes de las {LAB.toma.hasta} a.m. si tu estudio requiere toma de muestra.</p>
    </aside>
  );
}
