import { Response,Request } from 'express';
import { AttendanceService } from '../services/attendance.service';

const attendanceService = new AttendanceService();

export class AttendanceController {
  async createAttendance(req: Request, res: Response): Promise<void> {
    try {
      const result = await attendanceService.createAttendance(req.body);

      res.status(201).json({
        status: true,
        message: 'Presensi berhasil dicatat',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal mencatat presensi',
      });
    }
  }

  async updateAttendance(req: Request, res: Response): Promise<void> {
    try {
      const attendanceId = parseInt(req.params.id);
      const result = await attendanceService.updateAttendance(attendanceId, req.body);

      res.status(200).json({
        status: true,
        message: 'Presensi berhasil diupdate',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal mengupdate presensi',
      });
    }
  }

  async getAttendanceHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.user_id);
      const { start_date, end_date } = req.query;

      const result = await attendanceService.getAttendanceHistory(
        userId,
        start_date as string,
        end_date as string
      );

      res.status(200).json({
        status: true,
        message: 'Riwayat presensi berhasil diambil',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal mengambil riwayat presensi',
      });
    }
  }

  async getMonthlySummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.user_id);
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
      const year = parseInt(req.query.year as string) || new Date().getFullYear();

      const result = await attendanceService.getMonthlySummary(userId, month, year);

      res.status(200).json({
        status: true,
        message: 'Rekap kehadiran bulanan berhasil diambil',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal mengambil rekap kehadiran',
      });
    }
  }

  async getAttendanceAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const result = await attendanceService.getAttendanceAnalysis(req.body);

      res.status(200).json({
        status: true,
        message: 'Analisis kehadiran berhasil diambil',
        data: result.data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message || 'Gagal melakukan analisis kehadiran',
      });
    }
  }

  async getAttendanceById(req: Request, res: Response): Promise<void> {
    try {
      const attendanceId = parseInt(req.params.id);
      const result = await attendanceService.getAttendanceById(attendanceId);

      res.status(200).json({
        status: true,
        message: 'Data presensi berhasil diambil',
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        status: false,
        message: error.message || 'Presensi tidak ditemukan',
      });
    }
  }
}