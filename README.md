# Project Setup Guide **Codon *Chronicles***

**DNA/RNA Sequence Analysis**: *Codon Usage Analysis Across Taxonomic Group Using Machine Learning Techniques.*

## Prerequisites

Pastikan Anda telah menginstall:
- **Node.js** (versi 16 atau lebih baru)
- **Python** (versi 3.8 atau lebih baru)
- **npm** atau **yarn**

## Setup dan Instalasi

### 1. Frontend Setup

Navigasi ke direktori frontend dan install dependencies:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000` (atau port yang ditentukan).

### 2. Backend Setup

#### Step 1: Navigasi ke direktori backend
```bash
cd backend/app
```

#### Step 2: Buat dan aktifkan virtual environment

**Membuat virtual environment:**
```bash
python -m venv venv
```

**Mengaktifkan virtual environment:**

- **Mac/Linux:**
  ```bash
  source venv/bin/activate
  ```

- **Windows Command Prompt:**
  ```cmd
  venv\Scripts\activate
  ```

- **Windows PowerShell:**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```

#### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Jalankan server
```bash
python -m uvicorn main:app --reload
```

Backend API akan berjalan di `http://localhost:8000`.

## Menjalankan Aplikasi

1. **Jalankan Backend terlebih dahulu:**
   - Pastikan virtual environment sudah aktif
   - Server backend harus running di port 8000

2. **Jalankan Frontend:**
   - Buka terminal baru
   - Jalankan development server frontend

3. **Akses Aplikasi:**
    - Development:
        - Frontend: http://localhost:3000
        - Backend API: http://localhost:8000
        - API Documentation: http://localhost:8000/docs
    - Production:
        - Frontend: https://ml-codon-analysis.vercel.app/
        - Backend API: https://ml-codonanalysis.onrender.com
        - API Documentation: https://ml-codonanalysis.onrender.com/docs







## Troubleshooting

### Masalah Umum:

1. **Port sudah digunakan:**
   - Ganti port dengan menambahkan `--port XXXX` pada command uvicorn
   - Untuk frontend, biasanya akan otomatis mencari port yang tersedia

2. **Module tidak ditemukan:**
   - Pastikan virtual environment sudah aktif
   - Jalankan ulang `pip install -r requirements.txt`

3. **CORS Error:**
   - Pastikan backend sudah running sebelum mengakses frontend
   - Periksa konfigurasi CORS di backend

## Environment Variables

Jika diperlukan, buat file `.env` di root direktori dengan konfigurasi:

```env
# Backend
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## Development Notes

- Backend menggunakan **FastAPI** dengan auto-reload
- Frontend menggunakan **React/Next.js** (sesuaikan dengan framework yang digunakan)
- Perubahan kode akan otomatis ter-reload saat development

## Deployment

🚀 **Aplikasi ini telah di-deploy dan dapat diakses secara online:**

### Production URLs:
- **Frontend (Live App):** https://ml-codon-analysis.vercel.app/
- **Backend API:** https://ml-codonanalysis.onrender.com
- **API Documentation:** https://ml-codonanalysis.onrender.com/docs

### Akses Aplikasi:
1. **Untuk menggunakan aplikasi:** Kunjungi link frontend di atas
2. **Untuk development/testing API:** Gunakan link backend atau dokumentasi API

> **Catatan:** Deployment backend menggunakan Render.com (free tier) yang mungkin membutuhkan waktu startup ~30 detik jika tidak ada aktivitas dalam beberapa waktu.

## Link Laporan

📋 **Link Hasil Laporan:** [Proposal Penelitian](https://docs.google.com/document/d/1pKiH44rwDghlDjN_oEQVv_MOj1ibHL-K/edit?usp=sharing&ouid=112908507478678229014&rtpof=true&sd=true)

## Anggota Tim

| Nama | NIM |
|------|-----|
| Jihan Aurelia | 18222001 |
| Nasywaa Anggun Athiefah | 18222021 |
| Thalita Zahra Sutejo | 18222023 |

## Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

---