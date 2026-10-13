"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ListaPruebas from "@/components/ListaPruebas";
import PanelHorarios from "@/components/PanelHorarios";
import { getPruebas } from "@/lib/api";
import { LAB } from "@/lib/laboratorio";
import type { Prueba } from "@/types/prueba";

const INDICACIONES = [
  { titulo: "Ayuno", marca: <>8–12 h</>, texto: "No comas ni bebas nada, salvo agua, durante 8 a 12 horas antes de tu toma." },
  { titulo: "Muestras", marca: <>Orina<br />Heces</>, texto: "Orina: recolecta el primer chorro. Heces: lleva una muestra fresca." },
  { titulo: "Documentos", marca: <>ID +<br />Orden</>, texto: "Preséntate con tu documento de identidad y la orden médica." },
];

export default function PaginaPrincipal() {
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getPruebas(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setPruebas(data);
        setCargando(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.error("No se pudieron cargar las pruebas:", err);
        setError(true);
        setCargando(false);
      });
    return () => controller.abort();
  }, [intento]);

  function reintentar() {
    setError(false);
    setCargando(true);
    setIntento((actual) => actual + 1);
  }

  const telefonoHref = `tel:${LAB.telefono.replace(/[^\d+]/g, "")}`;

  return (
    <div className="lab-theme min-h-screen w-full bg-lab-bg pb-8 text-lab-fg">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 px-[clamp(16px,4vw,56px)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-lab-line py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-white p-2">
              <Image src="/logocallao.png" width={4806} height={2801} priority alt="Gobierno Regional del Callao" sizes="83px" className="h-12 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <b className="block font-lab-display text-[17px] leading-[1.1] font-extrabold tracking-[.01em]">{LAB.establecimiento}</b>
              <span className="text-xs tracking-[.08em] text-lab-muted uppercase">{LAB.nombre}</span>
            </div>
          </div>
          <a href={telefonoHref} className="rounded-full border-[1.5px] border-lab-brand px-3.5 py-[9px] font-lab-mono text-sm font-semibold whitespace-nowrap text-lab-brand">{LAB.telefono}</a>
        </header>

        <main className="flex flex-col gap-7">
          <section aria-labelledby="titulo" className="grid grid-cols-1 gap-5 min-[1024px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[1024px]:gap-8">
            <div className="flex min-w-0 flex-col justify-center gap-3">
              <p className="text-xs font-semibold tracking-[.12em] text-lab-brand uppercase">Información para pacientes</p>
              <h1 id="titulo" className="font-lab-display text-[clamp(30px,7vw,48px)] leading-[1.12] font-extrabold tracking-[-.015em] text-balance">Indicaciones antes de tus pruebas de laboratorio</h1>
              <p className="max-w-[46ch] text-[17px] text-lab-muted">Revisa qué estudios realizamos, cómo prepararte y a qué hora llegar para tu toma de muestras.</p>
            </div>
            <PanelHorarios />
          </section>

          <section aria-label="Buscar prueba" className="flex flex-col gap-2">
            <label htmlFor="buscar-prueba" className="text-sm font-semibold">¿Buscas una prueba?</label>
            <input id="buscar-prueba" type="search" autoComplete="off" placeholder="Escribe, por ejemplo: glucosa, orina, PSA" value={consulta} onChange={(event) => setConsulta(event.target.value)} className="w-full rounded-xl border-[1.5px] border-lab-line bg-lab-surface px-3.5 py-[13px] text-lab-fg placeholder:text-lab-muted focus:border-lab-brand" />
          </section>

          <section aria-label="Áreas y pruebas" aria-live="polite" aria-busy={cargando}>
            {cargando ? <>
              <p className="sr-only">Cargando pruebas…</p>
              <div aria-hidden="true" className="grid grid-cols-1 gap-3.5 min-[640px]:grid-cols-2 min-[1280px]:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex min-h-[240px] animate-pulse flex-col gap-5 rounded-[18px] border border-lab-line border-t-[5px] bg-lab-surface p-[18px] motion-reduce:animate-none">
                  <div className="h-[46px] rounded-xl bg-lab-track" /><div className="h-5 w-3/4 rounded bg-lab-track" /><div className="h-5 rounded bg-lab-track" /><div className="mt-auto h-10 rounded-xl bg-lab-track" />
                </div>)}
              </div>
            </> : error ? <div className="rounded-[14px] border border-dashed border-lab-line bg-lab-surface p-5 text-center">
              <p className="text-lab-muted">No pudimos cargar las pruebas. Revisa tu conexión e inténtalo de nuevo.</p>
              <button type="button" onClick={reintentar} className="mt-3 cursor-pointer rounded-[10px] bg-lab-brand px-4 py-2 font-semibold text-lab-brand-ink">Reintentar</button>
            </div> : <>
              {pruebas.length === 0 && <p className="mb-3.5 rounded-[14px] border border-dashed border-lab-line bg-lab-surface p-5 text-center text-lab-muted">Aún no hay pruebas registradas.</p>}
              <ListaPruebas pruebas={pruebas} consulta={consulta} />
            </>}
          </section>

          <section aria-labelledby="indicaciones-generales">
            <h2 id="indicaciones-generales" className="mb-3.5 font-lab-display text-[clamp(22px,5vw,30px)] leading-[1.12] font-extrabold text-balance">Indicaciones generales</h2>
            <div className="grid grid-cols-1 gap-3 min-[1024px]:grid-cols-3">
              {INDICACIONES.map((indicacion) => <article key={indicacion.titulo} className="flex min-w-0 items-start gap-3.5 rounded-2xl border border-lab-line bg-lab-surface p-4 min-[1024px]:flex-col">
                <div className="min-w-[54px] shrink-0 rounded-[10px] bg-lab-brand px-[9px] py-1.5 text-center font-lab-mono text-[15px] leading-[1.2] font-semibold text-lab-brand-ink">{indicacion.marca}</div>
                <div className="min-w-0">
                  <h3 className="mb-0.5 font-lab-display text-[17px] leading-[1.12] font-bold">{indicacion.titulo}</h3>
                  <p className="text-[15px] text-lab-muted">{indicacion.texto}</p>
                </div>
              </article>)}
            </div>
          </section>
        </main>

        <footer className="grid grid-cols-1 gap-3.5 border-t border-lab-line pt-5 text-[15px] min-[1024px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div><b className="mb-0.5 block text-xs font-semibold tracking-[.1em] text-lab-muted uppercase">Dirección</b>{LAB.direccion}</div>
          <div><b className="mb-0.5 block text-xs font-semibold tracking-[.1em] text-lab-muted uppercase">Citas</b><a href={telefonoHref} className="rounded font-lab-mono font-medium">{LAB.telefono}</a></div>
          <div><b className="mb-0.5 block text-xs font-semibold tracking-[.1em] text-lab-muted uppercase">Horario</b>Toma de muestras<br /><span className="font-lab-mono font-medium">{LAB.toma.etiqueta}</span></div>
        </footer>
      </div>
    </div>
  );
}
