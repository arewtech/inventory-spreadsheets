# Inventory Master CRUD (HTML + Tailwind + JS)

Aplikasi sederhana CRUD master data inventory dengan:

- List table (`index.html`)
- Page tambah data (`add.html`)
- Detail/Edit via modal + delete (di `index.html`)
- `fetch` + `try...catch`

## API

Secara default API diset di `assets/js/api.js`:

```js
const API_URL = "https://script.google.com/macros/s/myapi";
```

Jika URL production kamu berbeda (misalnya perlu `/exec`), ubah nilai `API_URL`.

## Menjalankan Lokal

Karena menggunakan ES Module (`type="module"`), jalankan lewat web server sederhana:

- VS Code Live Server, atau
- Python:

```bash
python3 -m http.server 5500
```

Buka:

- `http://localhost:5500/index.html`

## Deploy ke GitHub Pages

1. Push project ini ke repo GitHub.
2. Buka `Settings` -> `Pages`.
3. Pada `Build and deployment`, pilih:
   - Source: `Deploy from a branch`
   - Branch: `main` (atau branch kamu), folder `/ (root)`
4. Save, tunggu proses deploy selesai.
5. Akses URL GitHub Pages yang diberikan.

## Catatan Penting CORS

Agar request dari GitHub Pages berhasil, endpoint Google Apps Script harus mengizinkan akses dari origin GitHub Pages kamu.

Jika ada error fetch/CORS, cek konfigurasi deploy Google Apps Script Web App dan izin aksesnya.
