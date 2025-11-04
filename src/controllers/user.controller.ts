import { Request, Response } from 'express';
import { UserService } from '../services/user.service';


const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.createUser(req.body);

      res.status(201).json({
        status: true,
        message: 'User berhasil dibuat',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal membuat user',
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const result = await userService.updateUser(userId, req.body);

      res.status(200).json({
        status: true,
        message: 'User berhasil diupdate',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal mengupdate user',
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const result = await userService.getUserById(userId);

      res.status(200).json({
        status: true,
        message: 'Data user berhasil diambil',
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        status: false,
        message: error.message || 'User tidak ditemukan',
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.getAllUsers();

      res.status(200).json({
        status: true,
        message: 'Data users berhasil diambil',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal mengambil data users',
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const result = await userService.deleteUser(userId);

      res.status(200).json({
        status: true,
        message: result.message,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal menghapus user',
      });
    }
  }
}