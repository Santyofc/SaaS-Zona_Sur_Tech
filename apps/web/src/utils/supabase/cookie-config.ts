/**
 * Retorna el dominio base para las cookies basado en el entorno.
 * Permite que las cookies sean compartidas entre el dominio principal y subdominios.
 */
export function getCookieDomain(host: string | null) {
  if (!host) return undefined;

  // Si es localhost o una IP, no usamos dominio con wildcard
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.match(/^\d+\.\d+\.\d+\.\d+/)) {
    return undefined;
  }

  // Para producción, usamos el wildcard de segundo nivel
  if (host.includes("zonasurtech.online")) {
    return ".zonasurtech.online";
  }

  return undefined;
}
