
export const EmptyStateGeometric = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
      {/* SVG del Cubo Isométrico Abstracto */}
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Cara superior */}
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        {/* Líneas verticales conectando */}
        <path d="M2 7v10M12 12v10M22 7v10" />
        {/* Un pequeño círculo flotando en medio para dar foco */}
        <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
      </svg>

      <p className="mt-4 text-sm font-mono tracking-wider">
        BUFFER_EMPTY
      </p>
      <p className="text-xs text-gray-600 mt-1">
        Copia algo para empezar...
      </p>
    </div>
  );
};

export const EmptyStateTesseractIsometric = () => {
  return (

    <div className="flex flex-col items-center justify-center h-full w-full text-gray-500 dark:text-gray-400 opacity-70 select-none pointer-events-none transition-colors duration-300">

      <svg
        width="160"
        height="160"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8" // Líneas finas para el estilo "plano técnico"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-4 animate-[spin_20s_linear_infinite]" // Animación de rotación muuuuy lenta (opcional)
      >
        {/* --- CUBO EXTERIOR (Más grande) --- */}
        {/* Cara superior */}
        <path d="M50 15 L85 35 L50 55 L15 35 Z" opacity="0.9"/>
        {/* Cara inferior (base) */}
        <path d="M50 85 L85 65 L50 45 L15 65 Z" opacity="0.5" strokeDasharray="2,2"/>
        {/* Aristas verticales */}
        <path d="M15 35 L15 65 M85 35 L85 65 M50 55 L50 85" opacity="0.9"/>
        {/* Arista trasera vertical (oculta, punteada) */}
        <path d="M50 15 L50 45" opacity="0.5" strokeDasharray="2,2"/>

        {/* --- CUBO INTERIOR (Más pequeño, centrado) --- */}
        {/* Cara superior */}
        <path d="M50 35 L65 43.5 L50 52 L35 43.5 Z" />
        {/* Cara inferior */}
        <path d="M50 65 L65 56.5 L50 48 L35 56.5 Z" />
        {/* Aristas verticales */}
        <path d="M35 43.5 L35 56.5 M65 43.5 L65 56.5 M50 52 L50 65"/>
        {/* Arista trasera vertical */}
        <path d="M50 35 L50 48" opacity="0.7"/>

        {/* --- CONEXIONES 4D (Vértice a Vértice) --- */}
        {/* Conectan las esquinas del cubo exterior con el interior */}
        <g opacity="0.4">
          {/* Superiores */}
          <path d="M15 35 L35 43.5 M85 35 L65 43.5 M50 15 L50 35 M50 55 L50 52" />
          {/* Inferiores */}
          <path d="M15 65 L35 56.5 M85 65 L65 56.5 M50 85 L50 65 M50 45 L50 48" />
        </g>

        {/* --- NÚCLEO CENTRAL --- */}
        {/* Pequeño punto pulsante en el centro geométrico */}
        <circle cx="50" cy="50" r="1.5" fill="currentColor" className="animate-pulse border-none" stroke="none" />

      </svg>

      {/* Textos de estado (Estilo consola/terminal) */}
      <h3 className="text-sm font-mono font-semibold tracking-[0.2em] uppercase mb-2 text-gray-600 dark:text-gray-300">
        // HYPERCUBE :: EMPTY
      </h3>
      <p className="text-xs opacity-80 font-mono font-light">
        Esperando entrada de datos...
      </p>
    </div>
  );
};

export const EmptyStateGhostTesseract = ({width, height,message}: {width: number, height: number,message:string}) => {

  return (
    <div className="flex flex-col items-center justify-center  w-full text-gray-500 dark:text-gray-400 opacity-60 select-none pointer-events-none">

      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"

        strokeDasharray="4 4"
        className={"mb-1 animate-[spin_100s_linear_infinite]"}
      >

        <path d="M50 15 L85 35 L50 55 L15 35 Z" />
        <path d="M50 85 L85 65 L50 45 L15 65 Z" />
        <path d="M15 35 L15 65 M85 35 L85 65 M50 55 L50 85" />

        <path d="M50 15 L50 45" strokeOpacity="0.3" />

        <path d="M50 35 L65 43.5 L50 52 L35 43.5 Z" />
        <path d="M50 65 L65 56.5 L50 48 L35 56.5 Z" />
        <path d="M35 43.5 L35 56.5 M65 43.5 L65 56.5 M50 52 L50 65"/>
        <path d="M50 35 L50 48" strokeOpacity="0.3"/>

        <g strokeOpacity="0.3">
          <path d="M15 35 L35 43.5 M85 35 L65 43.5 M50 15 L50 35 M50 55 L50 52" />
          <path d="M15 65 L35 56.5 M85 65 L65 56.5 M50 85 L50 65 M50 45 L50 48" />
        </g>

        <circle cx="50" cy="50" r="2" fill="currentColor" stroke="none" className="animate-pulse" />

      </svg>

      <h3 className="text-sm font-mono font-semibold tracking-[0.2em] uppercase mb-2 text-gray-600 dark:text-gray-300">
        NO_DATA_FOUND
      </h3>
      <p className="text-xs opacity-80 font-mono font-light text-center">
        {message}
      </p>
    </div>
  );
};
