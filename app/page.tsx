"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe, Camera, Play, MapPin, Phone, Clock } from "lucide-react";
import ListaPruebas from "@/components/ListaPruebas";
import PanelHorarios from "@/components/PanelHorarios";
import { LAB } from "@/lib/laboratorio";
import { getPruebas } from "@/lib/api";
import type { Prueba } from "@/types/prueba";

export default function PaginaPrincipal() {
  const [consulta, setConsulta] = useState("");
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getPruebas(controller.signal)
      .then((datos) => {
        if (controller.signal.aborted) return;
        setPruebas(datos);
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
            <div className="shrink-0 rounded-xl bg-lab-bg p-2">
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
            <div id="horarios" className="min-w-0 scroll-mt-6"><PanelHorarios /></div>
          </section>

          <section aria-label="Buscar prueba" className="flex flex-col gap-2">
            <label htmlFor="buscar-prueba" className="text-sm font-semibold">¿Buscas una prueba?</label>
            <input id="buscar-prueba" type="search" autoComplete="off" placeholder="Escribe, por ejemplo: glucosa, orina, PSA" value={consulta} onChange={(event) => setConsulta(event.target.value)} className="w-full rounded-xl border-[1.5px] border-lab-line bg-lab-surface px-3.5 py-[13px] text-lab-fg placeholder:text-lab-muted focus:border-lab-brand" />
          </section>

          <section aria-label="Áreas y pruebas" aria-live="polite" aria-busy={cargando}>
            {cargando ? (
              <p role="status" className="rounded-2xl border border-lab-line bg-lab-surface p-5 text-center text-lab-muted">Cargando pruebas…</p>
            ) : error ? (
              <div className="rounded-2xl border border-lab-line bg-lab-surface p-5 text-center">
                <p className="text-lab-muted">No pudimos cargar las pruebas. Verifica que el backend esté encendido e inténtalo de nuevo.</p>
                <button type="button" onClick={reintentar} className="mt-3 cursor-pointer rounded-xl bg-lab-brand px-4 py-2 font-semibold text-lab-brand-ink">Reintentar</button>
              </div>
            ) : pruebas.length === 0 ? (
              <p className="rounded-2xl border border-lab-line bg-lab-surface p-5 text-center text-lab-muted">Aún no hay pruebas disponibles.</p>
            ) : (
              <ListaPruebas pruebas={pruebas} consulta={consulta} />
            )}
          </section>

        </main>

        <footer className="mt-3 rounded-[24px] border border-lab-line bg-lab-surface px-5 pt-8 pb-5 text-[15px] min-[640px]:px-8">
          <div className="grid grid-cols-1 gap-8 min-[640px]:grid-cols-2 min-[1280px]:grid-cols-[1.2fr_1fr_1.2fr_1fr]">
            <div className="flex flex-col items-start gap-4">
              <Image src="/logocallao.png" width={4806} height={2801} alt="Gobierno Regional del Callao" sizes="110px" className="h-16 w-auto object-contain" />
              <div>
                <p className="font-lab-display text-xl font-extrabold text-lab-brand">Laboratorio Acapulco</p>
                <p className="mt-1 text-sm text-lab-muted">{LAB.establecimiento}</p>
              </div>
            </div>

            <nav aria-labelledby="footer-enlaces">
              <h2 id="footer-enlaces" className="mb-3 font-lab-display text-lg font-bold">Enlaces rápidos</h2>
              <ul className="flex flex-col items-start text-lab-muted">
                <li><a href="#titulo" className="rounded hover:text-lab-brand hover:underline">Inicio</a></li>
                <li><a href="#buscar-prueba" className="rounded hover:text-lab-brand hover:underline">Pruebas de laboratorio</a></li>
                <li><a href="#horarios" className="rounded hover:text-lab-brand hover:underline">Horarios de atención</a></li>
                <li><a href="#contacto" className="rounded hover:text-lab-brand hover:underline">Contacto</a></li>
              </ul>
            </nav>

            <section id="contacto" aria-labelledby="footer-contacto" className="scroll-mt-6">
              <h2 id="footer-contacto" className="mb-3 font-lab-display text-lg font-bold">Contacto</h2>
              <ul className="space-y-3 text-lab-muted">
                <li><a href={telefonoHref} className="gap-3 rounded hover:text-lab-brand"><Phone size={19} aria-hidden="true" className="shrink-0 text-lab-brand" /><span className="font-lab-mono">{LAB.telefono}</span></a></li>
                <li className="flex items-start gap-3"><MapPin size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-lab-brand" /><span>{LAB.direccion}</span></li>
                <li className="flex items-start gap-3"><Clock size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-lab-brand" /><span>Toma de muestras<br /><span className="font-lab-mono text-sm">{LAB.toma.etiqueta}</span></span></li>
                <li className="flex items-start gap-3"><Clock size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-lab-brand" /><span>Atención del laboratorio<br /><strong className="font-lab-mono text-sm font-semibold">{LAB.atencion.etiqueta}</strong></span></li>
              </ul>
            </section>

            <section aria-labelledby="footer-redes">
              <h2 id="footer-redes" className="mb-4 font-lab-display text-lg font-bold">Redes sociales</h2>
              <ul className="flex flex-wrap gap-3">
                {[{ nombre: "Facebook", icono: Globe }, { nombre: "Instagram", icono: Camera }, { nombre: "YouTube", icono: Play }].map(({ nombre, icono: Icono }) => (
                  <li key={nombre}><span aria-label={`${nombre}: próximamente`} title={`${nombre}: próximamente`} className="grid size-11 place-items-center rounded-full bg-lab-bg text-lab-brand"><Icono size={21} aria-hidden="true" /></span></li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-lab-muted">Próximamente</p>
            </section>
          </div>

          <div className="mt-8 border-t border-lab-line pt-5 text-center text-sm leading-6 text-lab-muted">
            <p>© 2026 Laboratorio Clínico Acapulco. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
