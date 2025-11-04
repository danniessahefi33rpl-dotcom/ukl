Sistem Analisis Kehadiran

Sebuah proyek Node.js untuk manajemen user, role, kategori, serta pencatatan dan analisis kehadiran. Dibangun menggunakan TypeScript, Prisma, dan MySQL.

Daftar Isi

Fitur

Teknologi

Persiapan & Instalasi

Struktur Proyek

Endpoint API

Skema Database

Penggunaan

Kontribusi

Lisensi

Fitur

Manajemen user dengan role dan kategori

Pencatatan kehadiran per user

Analisis kehadiran berdasarkan rentang tanggal

Analisis tergrup berdasarkan kategori atau role

Statistik kehadiran (Hadir, Izin, Sakit, Alpha)

RESTful API untuk CRUD user dan analisis

Teknologi

Backend: Node.js, TypeScript, Express.js

ORM: Prisma

Database: MySQL

Autentikasi: bcrypt (hash password)

Penanganan Tanggal: JavaScript bawaan

Persiapan & Instalasi
Prasyarat

Node.js >= 18

Database MySQL

npm atau yarn

Instalasi

Clone repositori:

git clone https://github.com/username/proyek-kehadiran.git
cd proyek-kehadiran


Install dependencies:

npm install
# atau
yarn


Buat file .env:

DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000


Jalankan migrasi Prisma:

npx prisma migrate dev --name init
npx prisma generate


Jalankan server:

npm run dev
# atau
yarn dev


Server akan berjalan di: http://localhost:3000

Struktur Proyek
src/
├── controllers/      # Controller API
├── services/         # Logika bisnis & helper
├── routes/           # Route Express
├── prisma/           # Prisma client & schema
├── utils/            # Fungsi utilitas
└── index.ts          # Entry point

Endpoint API
Users

GET /users – Daftar semua user

POST /users – Tambah user

GET /users/:id – Ambil user berdasarkan ID

PUT /users/:id – Update user

DELETE /users/:id – Hapus user

Attendance

GET /attendance/:userId – Ambil attendance user

POST /attendance – Tambah record attendance

Analisis

POST /attendance-analysis – Ambil analisis kehadiran tergrup

Contoh Request:

{
  "start_date": "2025-11-01",
  "end_date": "2025-11-07",
  "category": "RPL-5",
  "role": "siswa"
}

Skema Database
User
Field	Tipe
id	Int (PK)
name	String
username	String
password	String
role	String
category	String
created_at	DateTime
updated_at	DateTime
Attendance
Field	Tipe
id	Int (PK)
userId	Int (FK)
date	DateTime
status	Enum: hadir, izin, sakit, alpha
created_at	DateTime
updated_at	DateTime
Penggunaan

Tambahkan user dan record attendance di database.

Gunakan endpoint /attendance-analysis untuk mendapatkan analisis:

{
  "start_date": "2025-11-01",
  "end_date": "2025-11-07",
  "category": "RPL-5"
}


Contoh response:

{
  "data": {
    "analysis_period": {
      "start_date": "2025-11-01",
      "end_date": "2025-11-07"
    },
    "grouped_analysis": [
      {
        "group": "RPL-5",
        "total_users": 5,
        "total_attendance": {
          "hadir": 15,
          "izin": 2,
          "sakit": 1,
          "alpha": 0
        },
        "attendance_rate": {
          "hadir_percentage": 83.33,
          "izin_percentage": 11.11,
          "sakit_percentage": 5.56,
          "alpha_percentage": 0
        }
      }
    ]
  }
}