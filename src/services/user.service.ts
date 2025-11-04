import bcrypt from 'bcryptjs';
import { prisma } from "../server";

export class UserService {
  async createUser(data: any) {
    const { username, password, name, role, category } = data;

    // Cek apakah username sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
        category,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        category: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async updateUser(id: number, data: any) {
    // Cek apakah user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error('User tidak ditemukan');
    }

    // Jika ada perubahan username, cek duplikasi
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: data.username },
      });

      if (usernameExists) {
        throw new Error('Username sudah digunakan');
      }
    }

    // Hash password jika ada perubahan
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        category: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        category: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    return user;
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        category: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }

  async deleteUser(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    await prisma.user.delete({
      where: { id },
    });

    return { message: 'User berhasil dihapus' };
  }
}