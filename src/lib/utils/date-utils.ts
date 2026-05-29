const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface ClassScheduleDisplay {
  /** "Today", "Tomorrow" o el día de la semana, en la zona local del usuario */
  day: string;
  /** "May 28" en la zona local del usuario */
  date: string;
  /** "13:30 - 14:30" en la zona local del usuario */
  time: string;
  /** Etiqueta de la zona detectada del navegador, ej. "GMT-5" */
  timeZone: string;
}

/**
 * Etiqueta corta de la zona horaria del navegador para una fecha dada (ej. "GMT-5").
 */
function getTimeZoneLabel(date: Date): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

/**
 * Convierte los timestamps ISO (UTC) de una clase a strings formateados
 * en la zona horaria local del navegador del usuario.
 *
 * Reemplaza los strings day/date/time que el backend formateaba en una zona fija.
 */
export function formatClassSchedule(
  startISO: string,
  endISO?: string,
  fallback?: { day: string; date: string; time: string },
): ClassScheduleDisplay {
  const start = new Date(startISO);

  // Si el backend todavía no envía los timestamps ISO (o son inválidos),
  // degradamos a los strings de zona fija que ya manda, en vez de mostrar
  // "Invalid Date". La conversión a zona local recién aplica con ISO válido.
  if (!startISO || Number.isNaN(start.getTime())) {
    return {
      day: fallback?.day ?? "",
      date: fallback?.date ?? "",
      time: fallback?.time ?? "",
      timeZone: "",
    };
  }

  const end = endISO ? new Date(endISO) : null;

  // Día relativo, comparando el día calendario LOCAL (no UTC)
  const now = new Date();
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    (startMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24),
  );

  let day: string;
  if (diffDays === 0) day = "Today";
  else if (diffDays === 1) day = "Tomorrow";
  else day = WEEKDAYS[start.getDay()]!;

  const date = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const formatTime = (d: Date): string =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const time = end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start);

  return { day, date, time, timeZone: getTimeZoneLabel(start) };
}

/**
 * Verifica si una clase está disponible para unirse.
 * El link de Join está disponible durante todo el día de la clase (zona local),
 * hasta 1 hora después de que termine.
 */
export function isClassStartingSoon(startISO: string, endISO?: string): boolean {
  if (!startISO) return false;

  const start = new Date(startISO);
  const now = new Date();

  // Solo para clases de hoy, según el día calendario local del usuario
  if (start.toDateString() !== now.toDateString()) return false;

  const end = endISO ? new Date(endISO) : start;
  const cutoff = end.getTime() + 60 * 60 * 1000; // 1 hora después del fin

  return now.getTime() <= cutoff;
}

/**
 * Formatea una fecha ISO a tiempo relativo ("Just now", "5 minutes ago", etc.)
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Calcula si una cancelación es tardía (menos de 24 horas antes del inicio).
 * Usa el instante absoluto de inicio (ISO), por lo que es correcto en cualquier zona.
 */
export function isLateCancellation(startISO: string): boolean {
  if (!startISO) return false;
  const hoursUntilClass = (new Date(startISO).getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilClass < 24;
}

/**
 * Obtiene el ícono apropiado según el tipo de notificación
 */
export function getNotificationIcon(_type: string): React.ReactNode {
  // Este helper será usado en el componente, importando los íconos allí
  return null;
}
