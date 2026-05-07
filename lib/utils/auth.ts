import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export interface AuthUser {
  userId: string;
  role: 'user' | 'admin' | 'seller';
}

/**
 * Verifies the JWT token from the Authorization header
 * @returns AuthUser or null if invalid
 */
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if the user has the required role
 */
export function hasRole(user: AuthUser | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
