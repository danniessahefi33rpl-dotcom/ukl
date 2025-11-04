<div align="center">

# 📊 Sistem Analisis Kehadiran

### Platform Manajemen Kehadiran Modern & Analitik

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

Sebuah proyek Node.js untuk manajemen user, role, kategori, serta pencatatan dan analisis kehadiran yang dibangun dengan teknologi modern dan arsitektur yang scalable.

[Fitur](#-fitur) •
[Instalasi](#-instalasi) •
[API Docs](#-api-endpoints) •
[Struktur](#-struktur-proyek) •
[Kontribusi](#-kontribusi)

</div>

---

## ✨ Fitur

<table>
<tr>
<td width="50%">

### 👥 Manajemen User
- ✅ CRUD user lengkap
- ✅ Sistem role & kategori
- ✅ Hash password dengan bcrypt
- ✅ Validasi data

</td>
<td width="50%">

### 📈 Analisis Kehadiran
- ✅ Pencatatan kehadiran real-time
- ✅ Analisis berdasarkan periode
- ✅ Grouping by kategori/role
- ✅ Statistik komprehensif

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Keamanan
- ✅ Password encryption
- ✅ Input validation
- ✅ Type-safe dengan TypeScript

</td>
<td width="50%">

### 📊 Reporting
- ✅ Persentase kehadiran
- ✅ Export data
- ✅ RESTful API

</td>
</tr>
</table>

---

## 🚀 Teknologi

<div align="center">

| Kategori | Teknologi |
|----------|-----------|
| **Backend** | Node.js, TypeScript, Express.js |
| **Database** | MySQL 8.0+ |
| **ORM** | Prisma |
| **Security** | bcrypt |
| **Validation** | Built-in validators |

</div>

---

## 📦 Instalasi

### Prasyarat

Pastikan Anda telah menginstall:
- 📌 Node.js versi 18 atau lebih tinggi
- 📌 MySQL Server
- 📌 npm atau yarn package manager

### Langkah Instalasi

1️⃣ **Clone repositori**
```bash
git clone https://github.com/username/proyek-kehadiran.git
cd proyek-kehadiran
```

2️⃣ **Install dependencies**
```bash
npm install
# atau
yarn install
```

3️⃣ **Setup environment variables**

Buat file `.env` di root project:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
```

4️⃣ **Jalankan migrasi database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5️⃣ **Jalankan server development**
```bash
npm run dev
# atau
yarn dev
```

✅ Server akan berjalan di: `http://localhost:3000`

---

## 📁 Struktur Proyek

```
src/
├── 📂 controllers/      # Controller layer untuk handling request
├── 📂 services/         # Business logic & helper functions
├── 📂 routes/           # Express route definitions
├── 📂 prisma/           # Prisma client & database schema
├── 📂 utils/            # Utility functions & helpers
└── 📄 index.ts          # Application entry point
```

---

## 🔌 API Endpoints

### 👤 User Management

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/users` | Mendapatkan semua user |
| `POST` | `/users` | Menambah user baru |
| `GET` | `/users/:id` | Mendapatkan user berdasarkan ID |
| `PUT` | `/users/:id` | Update data user |
| `DELETE` | `/users/:id` | Hapus user |

### 📅 Attendance

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/attendance/:userId` | Mendapatkan kehadiran user |
| `POST` | `/attendance` | Menambah record kehadiran |

### 📊 Analysis

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/attendance-analysis` | Analisis kehadiran tergrup |

#### Contoh Request Analysis

```json
{
  "start_date": "2025-11-01",
  "end_date": "2025-11-07",
  "category": "RPL-5",
  "role": "siswa"
}
```

#### Contoh Response

```json
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
```

---

## 🗄️ Skema Database

### 📋 Tabel User

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | Int | Primary Key |
| `name` | String | Nama user |
| `username` | String | Username (unique) |
| `password` | String | Hashed password |
| `role` | String | Role user |
| `category` | String | Kategori user |
| `created_at` | DateTime | Waktu dibuat |
| `updated_at` | DateTime | Waktu update |

### 📝 Tabel Attendance

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | Int | Primary Key |
| `userId` | Int | Foreign Key ke User |
| `date` | DateTime | Tanggal kehadiran |
| `status` | Enum | `hadir`, `izin`, `sakit`, `alpha` |
| `created_at` | DateTime | Waktu dibuat |
| `updated_at` | DateTime | Waktu update |

---

## 💡 Penggunaan

### Quick Start

1. **Tambahkan user** melalui endpoint `/users`
2. **Catat kehadiran** melalui endpoint `/attendance`
3. **Dapatkan analisis** melalui endpoint `/attendance-analysis`

### Contoh Flow

```bash
# 1. Tambah user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "password": "secure123",
    "role": "siswa",
    "category": "RPL-5"
  }'

# 2. Catat kehadiran
curl -X POST http://localhost:3000/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "date": "2025-11-04",
    "status": "hadir"
  }'

# 3. Analisis kehadiran
curl -X POST http://localhost:3000/attendance-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2025-11-01",
    "end_date": "2025-11-07",
    "category": "RPL-5"
  }'
```

---

<div align="center">

### ⭐ Jangan lupa berikan star jika project ini membantu!

**Made with ❤️ using TypeScript & Prisma**

</div>