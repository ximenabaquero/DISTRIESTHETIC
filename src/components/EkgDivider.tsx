/**
 * Separador visual estilo electrocardiograma (EKG).
 * Funciona sobre fondos oscuros. Animación de dibujo al montar.
 */
export default function EkgDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden pointer-events-none ${className}`} style={{ height: "44px" }}>
      <svg
        viewBox="0 0 1440 44"
        preserveAspectRatio="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ekgDivGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="12%"  stopColor="#1a6cf6" stopOpacity="0.45" />
            <stop offset="50%"  stopColor="#00c8a0" stopOpacity="0.70" />
            <stop offset="88%"  stopColor="#1a6cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,22 L360,22 L400,22 L418,5 L432,39 L448,2 L462,39 L478,22 L520,22 L1440,22"
          stroke="url(#ekgDivGrad)"
          strokeWidth="1.5"
          fill="none"
          className="ekg-line"
        />
      </svg>
    </div>
  );
}
