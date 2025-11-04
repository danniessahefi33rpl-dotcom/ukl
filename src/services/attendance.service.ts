import { prisma } from "../server";
import { Status, Role } from '@prisma/client';

interface AttendanceAnalysisResponse {
  data: {
    analysis_period: {
      start_date: string;
      end_date: string;
    };
    grouped_analysis: {
      group: string; // kategori / role
      total_users: number;
      attendance_rate: {
        hadir_percentage: number;
        izin_percentage: number;
        sakit_percentage: number;
        alpha_percentage: number;
      };
      total_attendance: {
        hadir: number;
        izin: number;
        sakit: number;
        alpha: number;
      };
    }[];
  };
}

export class AttendanceService {
  async createAttendance(data: any) {
    const { user_id, date, check_in_time, status, notes } = data;

    // Cek apakah user exists
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Parse tanggal
    const attendanceDate = new Date(date);
    const checkInDateTime = new Date(check_in_time);

    // Cek apakah sudah ada presensi di tanggal yang sama
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        user_id,
        date: attendanceDate,
      },
    });

    if (existingAttendance) {
      throw new Error('Presensi untuk tanggal ini sudah ada');
    }

    // Buat attendance baru
    const attendance = await prisma.attendance.create({
      data: {
        user_id,
        date: attendanceDate,
        check_in_time: checkInDateTime,
        status,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            category: true,
          },
        },
      },
    });

    return attendance;
  }

  async updateAttendance(id: number, data: any) {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new Error('Presensi tidak ditemukan');
    }

    const updateData: any = {};

    if (data.check_out_time) {
      updateData.check_out_time = new Date(data.check_out_time);
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            category: true,
          },
        },
      },
    });

    return updatedAttendance;
  }

  async getAttendanceHistory(userId: number, startDate?: string, endDate?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    const whereClause: any = {
      user_id: userId,
    };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            category: true,
          },
        },
      },
    });

    return attendances;
  }

  async getMonthlySummary(userId: number, month: number, year: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendances = await prisma.attendance.findMany({
      where: {
        user_id: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Hitung summary
    const summary = {
      user_id: userId,
      name: user.name,
      month,
      year,
      total_days: attendances.length,
      hadir: attendances.filter((a) => a.status === Status.hadir).length,
      terlambat: attendances.filter((a) => a.status === Status.terlambat).length,
      izin: attendances.filter((a) => a.status === Status.izin).length,
      sakit: attendances.filter((a) => a.status === Status.sakit).length,
      alpha: attendances.filter((a) => a.status === Status.alpha).length,
      attendance_percentage: attendances.length > 0
        ? ((attendances.filter((a) => a.status === Status.hadir || a.status === Status.terlambat).length / attendances.length) * 100).toFixed(2)
        : '0.00',
    };

    return summary;
  }


  async getAttendanceAnalysis (data: any): Promise<AttendanceAnalysisResponse> {
    const { start_date, end_date, category, role } = data;
    const startDate = new Date(start_date);
    startDate.setHours(0, 0, 0, 0); // jam 00:00:00.000

    const endDate = new Date(end_date);
    endDate.setHours(23, 59, 59, 999); // jam 23:59:59.999

    // Filter users
    const userWhere: any = {};
    if (category) userWhere.category = category;
    if (role) userWhere.role = role;

    
    const users = await prisma.user.findMany({
      where: userWhere,
      include: {
        attendance: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    // Group berdasarkan category atau role
    const grouped: Record<string, any[]> = {};
    users.forEach((user) => {
      const key = category ? user.category || 'Uncategorized' : user.role;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(user);
    });

    const groupedAnalysis = Object.entries(grouped).map(([group, groupUsers]) => {
      const totalUsers = groupUsers.length;

      // total per status
      let hadir = 0, izin = 0, sakit = 0, alpha = 0;
      groupUsers.forEach((u) => {
        console.log(u);
        
        u.attendance.forEach((a:any) => {
          switch (a.status) {
            case Status.hadir: hadir++; break;
            case Status.izin: izin++; break;
            case Status.sakit: sakit++; break;
            case Status.alpha: alpha++; break;
          }
        });
      });

      const totalAttendance = hadir + izin + sakit + alpha;

      const attendanceRate = totalAttendance > 0 ? {
        hadir_percentage: parseFloat(((hadir / totalAttendance) * 100).toFixed(2)),
        izin_percentage: parseFloat(((izin / totalAttendance) * 100).toFixed(2)),
        sakit_percentage: parseFloat(((sakit / totalAttendance) * 100).toFixed(2)),
        alpha_percentage: parseFloat(((alpha / totalAttendance) * 100).toFixed(2)),
      } : {
        hadir_percentage: 0,
        izin_percentage: 0,
        sakit_percentage: 0,
        alpha_percentage: 0,
      };

      return {
        group,
        total_users: totalUsers,
        attendance_rate: attendanceRate,
        total_attendance: { hadir, izin, sakit, alpha },
      };
    });

    return {      
      data: {
        analysis_period: { start_date, end_date },
        grouped_analysis: groupedAnalysis,
      },
    };
  };


  async getAttendanceById(id: number) {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            category: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new Error('Presensi tidak ditemukan');
    }

    return attendance;
  }
}
