# Perpustakaan Ceria — Situs Admin

Situs untuk petugas perpustakaan: melihat ringkasan, mengelola buku, mengurus peminjaman, dan menerbitkan pengumuman. Dibuat dengan HTML, CSS, dan JavaScript murni (vanilla), tanpa framework atau proses build.

Situs untuk pengunjung ada di file terpisah: `publik.html`. Keduanya tersambung lewat data bersama (lihat bagian Cara kerja data).

## Daftar file

```
admin.html    Halaman (HTML)
admin.css     Gaya dan animasi (CSS)
admin.js      Logika (JavaScript murni)
README-admin.md
```

Keempat file harus berada dalam **satu folder yang sama**, tanpa subfolder.

## Cara menjalankan

1. Simpan keempat file dalam satu folder, lalu buka `admin.html` di browser (klik dua kali).
2. Atau jalankan server lokal dari dalam folder, misalnya `python3 -m http.server 8000`, lalu buka `http://localhost:8000/admin.html`.

Huruf (Fredoka, Nunito, Space Mono) dimuat dari Google Fonts, jadi butuh internet. Tanpa internet, tampilan memakai huruf bawaan browser.

## Fitur

- **Ringkasan:** jumlah buku, buku yang dipinjam, isi rak per tema, pinjaman yang terlambat atau hampir jatuh tempo, dan aktivitas terbaru.
- **Kelola Buku:** tambah, ubah, dan hapus buku.
- **Peminjaman:** perpanjang masa pinjam atau terima pengembalian.
- **Pengumuman:** terbitkan dan hapus pengumuman.

## Kata sandi

Kata sandi diatur di bagian paling atas `admin.js` (konstanta `ADMIN_PASSWORD`). Ganti nilainya sesuai kebutuhan.

## Keamanan

Login ini hanya prototipe. Kata sandi dicek di browser dan tertulis di dalam `admin.js`, jadi siapa pun yang membuka kode sumber bisa melihatnya. Jangan dipakai untuk data sungguhan sebelum login dipindah ke server.

## Menjalankan bersama situs admin

Situs admin dan situs publik tersambung lewat `localStorage`, dan penyimpanan itu hanya dibagi antar halaman yang berasal dari satu alamat (domain dan port yang sama). Karena itu **jangan membuka file dengan klik dua kali**. Jalankan dari server lokal:

1. Simpan kedelapan file (`publik.html`, `publik.css`, `publik.js`, `admin.html`, `admin.css`, `admin.js`, dan kedua README) dalam satu folder.
2. Dari folder itu, jalankan `python3 -m http.server 8000`.
3. Buka `http://localhost:8000/publik.html` dan `http://localhost:8000/admin.html` di browser yang sama.

## Cara kerja data

- Data buku dan pengumuman disimpan di `localStorage` dengan kunci `pc-shared`. Kunci yang sama dipakai situs publik.
- Buku dan pengumuman yang kamu kelola di sini muncul di situs publik. Peminjaman, pengembalian, dan perpanjangan oleh anggota di situs publik muncul di Ringkasan, Peminjaman, dan aktivitas terbaru di sini.
- Kalau kedua situs terbuka di tab berbeda, perubahan langsung terlihat tanpa memuat ulang.
- Datanya hanya ada di satu browser dan satu perangkat. Ini sambungan untuk demo, bukan database sungguhan.
- Data awal (`CAT` dan `ANN` di `admin.js`) dipakai hanya bila penyimpanan masih kosong.

## Animasi

Panel, kartu, dan baris tabel muncul bergantian, angka ringkasan menghitung naik, dan bilah rak tumbuh dari kiri. Semua animasi mati otomatis bagi pengguna yang mengaktifkan pengaturan "kurangi gerakan". Gayanya ada di bagian paling bawah `admin.css`.

## Langkah pengembangan berikutnya

1. Pasang database dan login sungguhan di server (misalnya Supabase atau Firebase, atau server sendiri).
2. Ganti `CAT` dan `ANN` serta `localStorage` dengan pemanggilan `fetch` ke API.
3. Ganti penyimpanan bersama di browser dengan database yang dipakai kedua situs.

## Menyesuaikan

- Warna dan huruf: variabel di bagian `:root` pada `admin.css`.
- Tema rak dan warnanya: `TH` di `admin.js`. Kapasitas rak: `CAP`.
