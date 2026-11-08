// Rayos de fondo del hero y del encabezado de cada mundo
const PUNTAS = 14;

const puntos = Array.from({ length: PUNTAS * 2 }, (_, indice) => {
  const angulo = (indice / (PUNTAS * 2)) * Math.PI * 2;
  const radio = indice % 2 === 0 ? 900 : 260;
  return `${(600 + Math.cos(angulo) * radio).toFixed(1)},${(300 + Math.sin(angulo) * radio).toFixed(1)}`;
}).join(" ");

export default function Explosion({ className, color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <polygon points={puntos} fill={color} />
    </svg>
  );
}
