// ===== Konstanta & State =====
const STORAGE_KEY = "miniPosKeranjang";
const MIN_DISKON = 50000;
const PERSEN_DISKON = 0.1;
let keranjang = muatKeranjang();

// ===== Elemen DOM =====
const form = document.getElementById("formBarang");
const inNama = document.getElementById("nama");
const inHarga = document.getElementById("harga");
const inQty = document.getElementById("qty");
const inBayar = document.getElementById("bayar");
const tbody = document.getElementById("isiKeranjang");

// ===== Utilitas =====
function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function escapeHtml(teks) {
  const el = document.createElement("div");
  el.textContent = teks;
  return el.innerHTML;
}

// ===== LocalStorage =====
function simpanKeranjang() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
}

function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

// ===== Validasi =====
function setError(input, idPesan, pesan) {
  document.getElementById(idPesan).textContent = pesan;
  input.classList.toggle("invalid", pesan !== "");
  return pesan === "";
}

function validasiForm() {
  const nama = inNama.value.trim();
  const harga = inHarga.value.trim();
  const qty = inQty.value.trim();

  const okNama = setError(inNama, "errNama",
    nama.length < 3 ? "Nama barang wajib diisi, minimal 3 karakter." : "");

  const hargaNum = Number(harga);
  const okHarga = setError(inHarga, "errHarga",
    harga === "" || isNaN(hargaNum) || hargaNum < 500
      ? "Harga wajib angka dan minimal Rp 500." : "");

  const qtyNum = Number(qty);
  const okQty = setError(inQty, "errQty",
    qty === "" || !Number.isInteger(qtyNum) || qtyNum < 1
      ? "Jumlah wajib bilangan bulat minimal 1." : "");

  return okNama && okHarga && okQty;
}

// ===== Perhitungan =====
function hitungTotal() {
  return keranjang.reduce((jumlah, b) => jumlah + b.harga * b.qty, 0);
}

function hitungDiskon(total) {
  return total >= MIN_DISKON ? total * PERSEN_DISKON : 0;
}

function hitungKembalian() {
  const total = hitungTotal();
  const totalAkhir = total - hitungDiskon(total);
  const el = document.getElementById("kembalian");
  if (inBayar.value.trim() === "") {
    el.textContent = "Kembalian: Rp 0";
    el.classList.remove("kurang");
    return;
  }
  const selisih = Number(inBayar.value) - totalAkhir;
  if (selisih < 0) {
    el.textContent = "Uang belum mencukupi, kurang " + formatRupiah(-selisih) + ".";
    el.classList.add("kurang");
  } else {
    el.textContent = "Kembalian: " + formatRupiah(selisih);
    el.classList.remove("kurang");
  }
}

// ===== Tampilan =====
function render() {
  if (keranjang.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="kosong">Keranjang masih kosong. Tambahkan barang lewat form.</td></tr>';
  } else {
    tbody.innerHTML = keranjang.map((b, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(b.nama)}</td>
        <td class="num">${formatRupiah(b.harga)}</td>
        <td class="num">${b.qty}</td>
        <td class="num">${formatRupiah(b.harga * b.qty)}</td>
        <td><button type="button" class="hapus" data-index="${i}">Hapus</button></td>
      </tr>`).join("");
  }
  const total = hitungTotal();
  const diskon = hitungDiskon(total);
  document.getElementById("total").textContent = formatRupiah(total);
  document.getElementById("diskon").textContent = formatRupiah(diskon);
  document.getElementById("totalAkhir").textContent = formatRupiah(total - diskon);
  hitungKembalian();
}

// ===== Event =====
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validasiForm()) return;
  keranjang.push({
    nama: inNama.value.trim(),
    harga: Number(inHarga.value),
    qty: Number(inQty.value)
  });
  simpanKeranjang();
  form.reset();
  render();
  inNama.focus();
});

tbody.addEventListener("click", function (e) {
  if (!e.target.classList.contains("hapus")) return;
  keranjang.splice(Number(e.target.dataset.index), 1);
  simpanKeranjang();
  render();
});

inBayar.addEventListener("input", hitungKembalian);

document.getElementById("btnReset").addEventListener("click", function () {
  keranjang = [];
  localStorage.removeItem(STORAGE_KEY);
  inBayar.value = "";
  form.reset();
  render();
});

render();
