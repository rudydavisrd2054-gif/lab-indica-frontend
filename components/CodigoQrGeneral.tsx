import Image from "next/image";
import { Download } from "lucide-react";

const nombreArchivo = "QR-Laboratorio-Clinico-Acapulco.png";
const rutaQr = `/${nombreArchivo}`;

export default function CodigoQrGeneral() {
  return (
    <div className="mt-3 flex items-start gap-2.5 border-t border-lab-brand/25 pt-3 sm:gap-3 min-[1280px]:mt-1.5 min-[1280px]:-mb-4 min-[1280px]:gap-2 min-[1280px]:pt-1.5">
      <Image
        src={rutaQr}
        alt="Código QR de la página pública de indicaciones del laboratorio"
        width={1024}
        height={1024}
        unoptimized
        className="h-auto w-[84px] shrink-0 sm:w-[92px] min-[1280px]:w-[84px]"
      />
      <div className="min-w-0">
        <h2 className="font-lab-display text-sm leading-tight font-bold text-lab-brand">
          Accede a tus indicaciones
        </h2>
        <p className="mt-1 text-xs leading-snug text-lab-muted min-[1280px]:mt-0.5 min-[1280px]:leading-[14px]">
          Escanea el código QR para consultar las indicaciones de tus pruebas de laboratorio
        </p>
        <a
          href={rutaQr}
          download={nombreArchivo}
          className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-lab-brand px-2 py-1 text-xs leading-tight font-semibold text-lab-brand-ink hover:bg-lab-brand/90 min-[1280px]:mt-1 min-[1280px]:min-h-7!"
        >
          <Download size={14} aria-hidden="true" className="shrink-0" />
          <span>Descargar código QR</span>
        </a>
      </div>
    </div>
  );
}
