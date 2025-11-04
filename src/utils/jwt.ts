import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'danis-tampan';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 604800;

export interface JwtPayload {
  id: number;
  role: string;
}

// generate token
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: Number(JWT_EXPIRES_IN) };
  return jwt.sign(payload, JWT_SECRET, options);
};

// verify token
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
