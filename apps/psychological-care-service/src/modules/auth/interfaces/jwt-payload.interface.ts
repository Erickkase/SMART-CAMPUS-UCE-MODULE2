// Defines the JWT claims expected from a future centralized Auth Service or API Gateway.
export interface JwtPayload {
  sub: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}
