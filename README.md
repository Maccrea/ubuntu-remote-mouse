# 🖱️ Ubuntu Remote Mouse

Aplikasi *remote mouse* dan *keyboard* khusus untuk OS Ubuntu. Proyek ini memungkinkan kamu mengontrol kursor dan mengetik di laptop Ubuntu langsung dari layar *smartphone* menggunakan jaringan Wi-Fi lokal. 

Terdiri dari dua bagian utama:
*   **Server (Python)**: Berjalan di latar belakang Ubuntu untuk mengeksekusi perintah pergerakan kursor dan *keyboard* di tingkat sistem operasi (OS).
*   **Mobile Client (React Native/Expo)**: Aplikasi *controller* di HP yang mengirimkan data sensor dan *input* sentuhan secara *real-time* via WebSocket.

## ✨ Fitur Utama
- **🖱️ Trackpad Mode**: Geser layar HP untuk menggerakkan kursor, lengkap dengan tombol klik kiri dan kanan.
- **🪄 Air Mouse (Sensor Udara)**: Manfaatkan sensor Gyroscope di HP-mu. Gerakkan HP di udara layaknya *laser pointer* ajaib untuk mengarahkan kursor.
- **⌨️ Custom Live Keyboard**: Ketik huruf, spasi, enter, atau hapus teks langsung dari HP dan akan muncul seketika di layar Ubuntu.
- **⚙️ Adjustable DPI**: Atur sensitivitas pergerakan kursor secara *real-time* langsung dari aplikasi.

## 📂 Struktur Proyek
```text
ubuntu-remote-mouse/
├── mobile-client/       # Aplikasi frontend (React Native, Expo, expo-sensors)
│   ├── src/
│   │   ├── app/         # Entry point aplikasi (Expo Router)
│   │   └── components/  # Modular UI (Header, MouseMode, KeyboardMode)
│   └── ...
└── server/              # Backend server (FastAPI, pynput, websockets)
    ├── main.py          # Logika utama server dan WebSocket
    ├── venv/            # Virtual environment Python
    └── ...
```

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan laptop Ubuntu dan HP kamu terhubung ke **jaringan Wi-Fi yang sama**.

### Langkah 1: Jalankan Server (Ubuntu)
Buka terminal di laptop Ubuntu kamu, lalu jalankan perintah berikut secara berurutan:
```bash
# Masuk ke folder server
cd server

# Aktifkan virtual environment
source venv/bin/activate

# Jalankan server menggunakan Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Pastikan muncul tulisan `Application startup complete` di terminal.*

### Langkah 2: Konfigurasi IP Lokal
Aplikasi *mobile* harus tahu alamat IP laptopmu agar bisa terhubung.
1. Buka tab terminal baru di Ubuntu, ketik perintah:
   ```bash
   ip a
   ```
2. Cari alamat IP yang berformat `192.168.x.x` atau `10.x.x.x` (biasanya di bagian `wlo1` atau `wlan0`).
3. Buka file `mobile-client/src/app/index.tsx` di *code editor* kamu.
4. Ubah nilai variabel `SERVER_IP` sesuai dengan IP yang kamu dapatkan.
   ```javascript
   const SERVER_IP = '192.168.xx.xx'; // Ganti dengan IP laptopmu
   ```

### Langkah 3: Jalankan Mobile Client (HP)
1. Buka tab terminal baru, lalu arahkan ke folder *client*:
   ```bash
   cd mobile-client
   ```
2. Mulai server pengembangan Expo:
   ```bash
   npx expo start
   ```
3. Buka aplikasi **Expo Go** di HP kamu (bisa diunduh di Play Store/App Store).
4. *Scan* QR Code yang muncul di terminal Ubuntu menggunakan aplikasi Expo Go.
5. Selesai! Indikator di HP akan berubah menjadi "🟢 Terhubung".

---

## ⚠️ Catatan Penting
- **IP Berubah Berubah**: Jika kamu berganti jaringan Wi-Fi atau *router* melakukan *restart*, alamat IP lokal laptopmu mungkin akan berubah. Jika aplikasi di HP bertuliskan "🔴 Terputus", ulangi **Langkah 2** untuk memperbarui IP.
- **Izin Wayland**: Jika kursor tidak bergerak di Ubuntu versi terbaru (yang menggunakan Wayland secara *default*), kamu mungkin perlu beralih ke sesi **X11** saat *login* ke desktop.