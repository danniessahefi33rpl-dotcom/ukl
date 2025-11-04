import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    // pastikan authHeader adalah string
    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: false,
        message: 'Token tidak ditemukan',
      });
      return;
    }

    const token = authHeader.substring(7); // aman sekarang
    const decoded = verifyToken(token);

    // bisa simpan di local property sementara tanpa extend Request
    (req as any).decoded = decoded;

    next();
  } catch (error: any) {
    console.error(error);
    res.status(401).json({
      status: false,
      message: 'Token tidak valid atau sudah kadaluarsa',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const decoded = (req as any).decoded;

    if (!decoded) {
      res.status(401).json({
        status: false,
        message: 'Unauthorized: token tidak ditemukan',
      });
      return;
    }

    if (!roles.includes(decoded.role)) {
      res.status(403).json({
        status: false,
        message: 'Forbidden: Anda tidak memiliki akses',
      });
      return;
    }

    next();
  };
};
