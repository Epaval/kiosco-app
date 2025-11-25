// components/LogoIcon.tsx
export function LogoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="64" height="64">
      {/* Fondo circular con gradiente */}
      <circle cx="100" cy="100" r="90" fill="url(#gradient)" />

      {/* Gradiente */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF8A34"/>
          <stop offset="100%" stop-color="#E63946"/>
        </linearGradient>
      </defs>

      {/* Pan superior */}
      <rect x="60" y="50" width="80" height="12" fill="#C87D2F" rx="4"/>
      {/* Carne */}
      <rect x="70" y="65" width="60" height="8" fill="#A52A2A" rx="2"/>
      {/* Queso */}
      <rect x="75" y="75" width="50" height="6" fill="#FFD700" rx="2"/>
      {/* Lechuga */}
      <rect x="80" y="83" width="40" height="6" fill="#5F9E6E" rx="2"/>
      {/* Pan inferior */}
      <rect x="65" y="91" width="70" height="10" fill="#C87D2F" rx="4"/>

      {/* Sombra suave debajo del ícono */}
      <ellipse cx="100" cy="180" rx="60" ry="6" fill="black" opacity="0.1"/>
    </svg>
  );
}