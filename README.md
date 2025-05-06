# Lab Manager - Client (Frontend)

Aplikasi web manajemen laboratorium berbasis React, dengan antarmuka modern, responsif, dan profesional. Mendukung fitur manajemen laboratorium, peralatan, pengguna, peminjaman, serta laporan statistik lengkap untuk admin, teknisi, dan user.

---

## 🚀 Fitur Utama

- **Manajemen Laboratorium**: Tambah, edit, hapus, dan lihat detail laboratorium.
- **Manajemen Peralatan**: CRUD peralatan, detail lengkap, filter, ekspor CSV, dan tampilan modal modern.
- **Manajemen Pengguna**: Kelola user, admin, teknisi, dengan role-based access control.
- **Manajemen Peminjaman**: Proses peminjaman, approval, pengembalian, dan riwayat.
- **Laporan & Statistik**: Visualisasi data (Chart.js), ekspor laporan, dan tab laporan interaktif.
- **Profil Admin**: Edit profil, ganti password, dan avatar dinamis.
- **UI/UX Modern**: Desain konsisten, animasi halus, warna kontras, dan aksesibilitas optimal.

---

## 🛠️ Teknologi & Library

- **React 19**
- **Redux Toolkit** (state management)
- **React Router v7** (routing)
- **Tailwind CSS** (utility-first styling)
- **Chart.js & react-chartjs-2** (visualisasi data)
- **Axios** (HTTP client)
- **Framer Motion** (animasi tambahan)
- **Date-fns** (manipulasi tanggal)

---

## 📁 Struktur Folder Utama

```
client/
├── public/           # Static files (index.html, favicon, manifest, logo)
├── src/
│   ├── api/          # API service (axios)
│   ├── components/   # Reusable UI components (PageHeader, Modal, IconButton, etc)
│   ├── layouts/      # Layout components (DashboardLayout)
│   ├── pages/        # Halaman aplikasi (admin, user, technician, auth)
│   ├── store/        # Redux store & slices
│   ├── styles/       # Custom CSS (animations, overrides)
│   ├── utils/        # Helper & utility functions
│   └── App.jsx       # Root app & routing
├── package.json      # Dependencies & scripts
└── README.md         # Dokumentasi ini
```

---

## ⚡️ Cara Menjalankan

### 1. Clone Repository

Jika Anda bekerja dalam tim, pastikan untuk melakukan clone repository utama:

```bash
# Ganti URL sesuai repo Anda
git clone https://github.com/febss20/SIMPEL-Lab-Frontend.git
cd SIMPEL-Lab-Frontend
```

### 2. Install Dependencies

Jalankan perintah berikut untuk menginstall semua dependencies:

```bash
npm install
```

### 3. Setup Environment (Opsional)

Jika ada file `.env` (misal untuk konfigurasi API endpoint), copy dari contoh:

```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

### 4. Jalankan Aplikasi

```bash
npm start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### 5. Build untuk Produksi

```bash
npm run build
```

---

### 👥 Kolaborasi Tim

- **Gunakan branch** untuk fitur/bugfix baru:  
  `git checkout -b fitur/nama-fitur-anda`
- **Pull request** ke branch utama (`main`/`master`) untuk review kode.
- **Selalu lakukan pull** sebelum mulai kerja:
  ```bash
  git pull origin main
  ```
- **Commit message** yang jelas dan deskriptif.
- **Resolusi konflik**: Jika ada konflik merge, diskusikan dan selesaikan bersama tim.

### 🛠️ Troubleshooting

- Jika ada error dependency, coba hapus `node_modules` dan `package-lock.json`, lalu jalankan `npm install` ulang.
- Pastikan backend (server) juga berjalan jika aplikasi membutuhkan API.
- Untuk masalah linting/formatting, gunakan perintah:
  ```bash
  npm run lint
  # atau
  npm run format
  ```

---

## 🖥️ Halaman Admin

- **Dashboard**: Ringkasan statistik, chart, dan quick actions
- **Manajemen Lab**: CRUD laboratorium
- **Manajemen Peralatan**: CRUD, detail, filter, ekspor CSV
- **Manajemen Pengguna**: CRUD user/admin/teknisi
- **Manajemen Peminjaman**: Approval, pengembalian, detail
- **Laporan**: Statistik visual, ekspor laporan
- **Profil Admin**: Edit profil, ganti password

## 🎨 UI/UX

- Komponen header modern (`PageHeader`) di semua halaman
- Modal detail & form dengan animasi smooth
- Warna kontras, aksesibilitas tinggi
- Layout responsif (desktop & mobile)

## 🔒 Autentikasi & Role

- Login, register, dan proteksi route berbasis role (Admin, User, Technician)
- Komponen `RoleRoute` untuk akses halaman sesuai role

## 📦 Ekspor Data

- Ekspor data ke CSV di halaman manajemen dan laporan

## 🧩 Komponen Penting

- `PageHeader`: Header halaman modern dengan animasi & ikon
- `Modal`: Modal dialog serbaguna
- `IconButton`: Tombol aksi dengan ikon & tooltip

---

## 📚 Pengembangan Lanjutan

- Tambahkan fitur notifikasi
- Integrasi dengan backend (lihat folder `server`)
- Penambahan test unit & e2e

---

## Lisensi

MIT
