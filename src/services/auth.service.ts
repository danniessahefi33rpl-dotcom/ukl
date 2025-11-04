import bcrypt from 'bcryptjs';
import { prisma } from "../server";
import { generateToken } from '../utils/jwt';

export class AuthService {
  async login(data:any) {
    const { username, password } = data;
    console.log(username);
    

    // Cari user berdasarkan username
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      throw new Error('Username atau password salah');
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Username atau password salah');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        category: user.category || undefined,
      },
    };
  }
}
