import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        status: true,
        message: 'Login berhasil',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        status: false,
        message: error.message || 'Login gagal',
      });
    }
  }
}
