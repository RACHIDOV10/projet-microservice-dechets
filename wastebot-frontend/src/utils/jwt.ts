// JWT token decoder utility
export interface DecodedToken {
  sub?: string; // user ID
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

/**
 * Decodes a JWT token without verification (client-side only)
 * Note: In production, token verification should be done server-side
 */
export function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Gets admin ID from JWT token
 */
export function getAdminIdFromToken(token: string | null): string | null {
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.sub || decoded?.id || null;
}

/**
 * Gets admin name from JWT token
 */
export function getAdminNameFromToken(token: string | null): string | null {
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.name || decoded?.email || 'Admin';
}

