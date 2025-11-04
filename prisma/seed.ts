import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123'; // ganti sesuai kebutuhan
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log('Admin sudah ada:', existingAdmin.username);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin berhasil dibuat:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
