# Mini POS Kantin

## Identitas
- Nama Lengkap : Settiani Simanjuntak
- NIM          : 124140055
- Kelas        : Pengembangan Aplikasi Web RA

## Deskripsi Aplikasi
Aplikasi web kasir sederhana untuk kantin atau toko kampus. Kasir memasukkan barang ke keranjang, lalu aplikasi menghitung subtotal, total belanja, diskon, dan kembalian secara otomatis. Isi keranjang disimpan di `localStorage` sehingga tidak hilang saat halaman di-refresh.

## Panduan Menjalankan
1. Pastikan `index.html`, `style.css`, dan `script.js` berada dalam satu folder.
2. Buka folder proyek di VS Code dan pasang ekstensi **Live Server**.
3. Klik kanan `index.html`, pilih **Open with Live Server**. Aplikasi juga bisa dibuka dengan mengklik dua kali `index.html` setelah folder diekstrak.

## Daftar Fitur
- [x] Validasi nama barang (min. 3 karakter), harga (min. Rp 500), dan qty (bilangan bulat min. 1)
- [x] Pesan error merah di bawah input yang salah, form di-reset setelah berhasil
- [x] Subtotal = harga x qty dan total belanja otomatis
- [x] Diskon 10% jika total belanja min. Rp 50.000
- [x] Uang bayar dan kembalian otomatis, dengan pesan jika uang kurang
- [x] Tabel keranjang dengan tombol Hapus per item
- [x] Penyimpanan `localStorage` (`JSON.stringify` / `JSON.parse`)
- [x] Tombol Transaksi baru untuk mengosongkan keranjang dan localStorage

## Tangkapan Layar
**Form input utama**

![Form input utama](screenshots/form.png)

**Validasi error**

![Validasi error](screenshots/error.png)

**Tabel keranjang dan hasil perhitungan**

![Tabel dan perhitungan](screenshots/hasil.png)

## Penjelasan Teknis Singkat
- **Validasi**: `validasiForm()` memeriksa tiap input. Jika salah, `setError()` menampilkan pesan merah dan proses submit dihentikan sebelum barang masuk keranjang.
- **Kalkulator**: `hitungTotal()` menjumlahkan harga x qty seluruh item, `hitungDiskon()` memberi 10% bila total >= 50.000, dan `hitungKembalian()` menghitung uang bayar dikurangi total akhir.
- **localStorage**: `simpanKeranjang()` mengubah array menjadi teks dengan `JSON.stringify()`, dan `muatKeranjang()` membacanya kembali dengan `JSON.parse()` saat halaman dibuka. Setiap tambah, hapus, atau reset memanggil fungsi simpan lalu `render()`.
