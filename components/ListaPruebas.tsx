"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Info, TestTube, Droplet, FlaskConical, ListFilter, Microscope, ShieldCheck, X } from "lucide-react";
import { construirAreas, filtrarAreas, type AreaCatalogo, type PruebaCatalogo } from "@/lib/laboratorio";
import type { Prueba } from "@/types/prueba";

const ICONOS = { bioquimica: FlaskConical, inmunologia: ShieldCheck, hematologia: Droplet, microbiologia: Microscope, otras: ListFilter };

interface Seleccion {
  area: AreaCatalogo;
  item: PruebaCatalogo;
}

export default function ListaPruebas({ pruebas, consulta }: { pruebas: Prueba[]; consulta: string }) {
  const areas = useMemo(() => construirAreas(pruebas), [pruebas]);
  const visibles = filtrarAreas(areas, consulta);
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const ventana = dialogo.current;
    if (seleccion && ventana && !ventana.open) ventana.showModal();
  }, [seleccion]);

  function cerrar() {
    dialogo.current?.close();
  }

  const registro = seleccion?.item.prueba;
  const ayuno = registro?.tiempo_ayunas?.trim();

  return <>
    {visibles.length ? <div className="grid grid-cols-1 gap-3.5 min-[640px]:grid-cols-2 min-[1280px]:grid-cols-4">
      {visibles.map((area) => {
        const Icono = ICONOS[area.id as keyof typeof ICONOS];
        return <article key={area.id} data-area={area.color} className="flex min-w-0 flex-col gap-3.5 rounded-[18px] border border-lab-line border-t-[5px] border-t-[var(--area-color)] bg-lab-surface p-[18px]">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="grid size-[46px] shrink-0 place-items-center rounded-[14px] bg-[var(--area-soft)] text-[var(--area-color)]"><Icono size={26} strokeWidth={1.8} /></div>
            <div className="min-w-0">
              <h3 className="font-lab-display text-[19px] leading-[1.12] font-bold text-balance break-words">{area.nombre}</h3>
              <span className="text-xs text-lab-muted">{area.items.length} {area.items.length === 1 ? "prueba" : "pruebas"}</span>
            </div>
          </div>
          <ul className="flex flex-col">
            {area.items.map((item) => <li key={item.clave} className="border-b border-dashed border-lab-line last:border-0">
              <button type="button" aria-haspopup="dialog" onClick={() => setSeleccion({ area, item })} className="lab-test flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-1.5 py-2.5 text-left font-medium">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[var(--area-color)]" />
                <span className="lab-test-name min-w-0 flex-1 [overflow-wrap:anywhere]">
                  {item.nombre}
                  {item.detalle && <small className="block text-[13px] font-normal text-lab-muted">{item.detalle}</small>}
                  {item.prueba?.tiempo_ayunas?.trim() && <small className="block font-lab-mono text-xs font-medium text-[var(--area-color)]">Ayuno: {item.prueba.tiempo_ayunas}</small>}
                </span>
                <ChevronRight aria-hidden="true" size={18} strokeWidth={2.2} className="shrink-0 text-[var(--area-color)] opacity-70" />
              </button>
            </li>)}
          </ul>
        </article>;
      })}
    </div> : <p className="rounded-[14px] border border-dashed border-lab-line bg-lab-surface p-5 text-center text-lab-muted">No encontramos esa prueba. Prueba con otra palabra o consulta en el laboratorio.</p>}

    <dialog ref={dialogo} aria-labelledby="titulo-prueba" data-area={seleccion?.area.color} onClose={() => setSeleccion(null)}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cerrar();
      }}
      className="lab-dialog m-auto max-h-[min(82dvh,640px)] w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-[20px] border border-lab-line border-t-[5px] border-t-[var(--area-color)] bg-lab-surface p-0 text-lab-fg shadow-[0_30px_80px_rgba(8,25,50,.35)]">
      <div className="flex max-h-[calc(min(82dvh,640px)-6px)] flex-col">
        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <p className="mb-1 text-xs font-semibold tracking-[.1em] text-[var(--area-color)] uppercase">{seleccion?.area.nombre}</p>
            <h2 id="titulo-prueba" className="font-lab-display text-[clamp(22px,5vw,28px)] leading-[1.12] font-extrabold">{seleccion?.item.nombre ?? "Indicaciones de la prueba"}</h2>
            {seleccion?.item.detalle && <p className="mt-0.5 text-[15px] text-lab-muted">{seleccion.item.detalle}</p>}
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar ventana" className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-[var(--area-soft)] text-[var(--area-color)]"><X size={20} strokeWidth={2.2} /></button>
        </div>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain px-5 pt-2 pb-5 [overflow-wrap:anywhere]">
          <div key={seleccion?.item.clave} className="flex flex-col gap-3">
            {[
              { titulo: "¿Qué es?", icono: Info, contenido: "La descripción de esta prueba estará disponible próximamente." },
              { titulo: "Preparación para el examen", icono: Info, contenido: registro?.indicaciones?.trim() || "Las indicaciones de preparación aún no están registradas. Consulta en el laboratorio antes de tu toma." },
              { titulo: "Tipo de muestra", icono: TestTube, contenido: "El tipo de muestra aún no está registrado." },
              { titulo: "¿Cómo interpretar los resultados?", icono: Info, contenido: "La información de interpretación aún no está registrada. Consulta tus resultados con el profesional que solicitó la prueba." },
            ].map((seccion, indice) => {
              const Icono = seccion.icono;
              return <details key={seccion.titulo} name="detalle-prueba" open={indice === 0} className="group rounded-2xl border border-lab-line bg-lab-surface">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-2.5 rounded-2xl px-4 py-3.5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  <Icono aria-hidden="true" size={19} className="shrink-0 text-[var(--area-color)]" />
                  <span className="min-w-0 flex-1">{seccion.titulo}</span>
                  <ChevronDown aria-hidden="true" size={17} className="shrink-0 text-lab-muted group-open:rotate-180" />
                </summary>
                <div className="space-y-3 px-4 pt-1 pb-5 text-[15px] leading-7 text-lab-muted">
                  {indice === 1 && ayuno && <p className="inline-block rounded-lg bg-[var(--area-soft)] px-3 py-1 font-medium text-[var(--area-color)]">Ayuno: {ayuno}</p>}
                  <p className="whitespace-pre-line">{seccion.contenido}</p>
                </div>
              </details>;
            })}
          </div>
          {registro && <Link href={`/prueba/${registro.id}`} className="self-start rounded-md text-sm font-semibold text-[var(--area-color)] underline underline-offset-4">Ver página de esta prueba</Link>}
        </div>
        <div className="flex shrink-0 justify-end border-t border-lab-line px-5 pt-3 pb-5">
          <button type="button" onClick={cerrar} className="cursor-pointer rounded-xl bg-lab-brand px-[22px] py-[11px] text-[15px] font-semibold text-lab-brand-ink">Cerrar</button>
        </div>
      </div>
    </dialog>
  </>;
}
