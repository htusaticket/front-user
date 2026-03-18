/**
 * Verifica si una clase está disponible para unirse.
 * El link de Join está disponible durante todo el día de la clase,
 * desde el inicio del día hasta 1 hora después de que termine.
 * Solo aplica para clases de HOY.
 */
export function isClassStartingSoon(timeString: string, dayString?: string): boolean {
  // Solo mostrar "Join" para clases de hoy
  if (dayString && dayString !== "Today") {
    return false;
  }

  // El timeString viene en formato "18:00 - 19:00" del backend
  const parts = timeString.split(" - ");
  const endTimeStr = parts[1] || parts[0];
  
  if (!endTimeStr) return false;

  // Crear un Date object para hoy con la hora de fin de la clase
  const now = new Date();
  const [hours, minutes] = endTimeStr.split(":").map(Number);
  
  if (hours === undefined || minutes === undefined) return false;

  const classEndTime = new Date();
  classEndTime.setHours(hours, minutes, 0, 0);

  // Disponible todo el día de hoy, hasta 1 hora después de que termine
  const diffMs = classEndTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  // Disponible si aún no ha pasado 1 hora desde el fin de la clase
  return diffMinutes >= -60;
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
 * Calcula si una cancelación es tardía (menos de 24 horas)
 * Usado para determinar si se debe mostrar la advertencia de strike
 */
export function isLateCancellation(day: string, timeString: string): boolean {
  const now = new Date();
  
  // Si es "Today", verificar la hora
  if (day === "Today") {
    const startTimeStr = timeString.split(" - ")[0];
    if (!startTimeStr) return false;
    
    const [hours, minutes] = startTimeStr.split(":").map(Number);
    if (hours === undefined || minutes === undefined) return false;
    
    const classTime = new Date();
    classTime.setHours(hours, minutes, 0, 0);
    
    const hoursUntilClass = (classTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilClass < 24;
  }
  
  // Si es "Tomorrow", siempre es menos de 24 horas
  if (day === "Tomorrow") {
    return true;
  }
  
  // Para otros días de la semana, necesitamos calcular
  // Por simplicidad, asumimos que si no es Today, puede ser más de 24h
  return false;
}

/**
 * Obtiene el ícono apropiado según el tipo de notificación
 */
export function getNotificationIcon(_type: string): React.ReactNode {
  // Este helper será usado en el componente, importando los íconos allí
  return null;
}
