  // ============ DATA & LOCALSTORAGE ============
  const KEY_KERANJANG = "minipos_keranjang";
  const KEY_PROMO = "minipos_promo";
  let keranjang = [];
  let promoAktif = false;

  function simpan() {
    localStorage.setItem(KEY_KERANJANG, JSON.stringify(keranjang));
    localStorage.setItem(KEY_PROMO, JSON.stringify(promoAktif));
  }

  function muat() {
    try {
      keranjang = JSON.parse(localStorage.getItem(KEY_KERANJANG)) || [];
      promoAktif = JSON.parse(localStorage.getItem(KEY_PROMO)) || false;
    } catch (e) {
      keranjang = [];
      promoAktif = false;
    }
  }

  // ============ FORMAT RUPIAH ============
  function rupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
  }

  // ============ TAHAP 1: VALIDASI FORM ============
  const form = document.getElementById("formBarang");
  const inputNama = document.getElementById("nama");
  const inputHarga = document.getElementById("harga");
  const inputQty = document.getElementById("qty");

  function setError(input, errId, pesan) {
    document.getElementById(errId).textContent = pesan;
    input.classList.toggle("invalid", pesan !== "");
    return pesan === "";
  }

  function validasiNama() {
    const v = inputNama.value.trim();
    if (v === "") return setError(inputNama, "errNama", "Nama barang wajib diisi.");
    if (v.length < 3) return setError(inputNama, "errNama", "Nama barang minimal 3 karakter.");
    return setError(inputNama, "errNama", "");
  }

  function validasiHarga() {
    const raw = inputHarga.value.trim();
    const v = Number(raw);
    if (raw === "" || isNaN(v)) return setError(inputHarga, "errHarga", "Harga wajib berupa angka.");
    if (v < 500) return setError(inputHarga, "errHarga", "Harga minimal Rp 500.");
    return setError(inputHarga, "errHarga", "");
  }

  function validasiQty() {
    const raw = inputQty.value.trim();
    const v = Number(raw);
    if (raw === "" || isNaN(v)) return setError(inputQty, "errQty", "Jumlah wajib berupa angka.");
    if (!Number.isInteger(v)) return setError(inputQty, "errQty", "Jumlah harus bilangan bulat.");
    if (v < 1) return setError(inputQty, "errQty", "Jumlah minimal 1.");
    return setError(inputQty, "errQty", "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Jalankan semua validasi (tanpa short-circuit agar semua pesan muncul)
    const ok = [validasiNama(), validasiHarga(), validasiQty()].every(Boolean);
    if (!ok) return;

    keranjang.push({
      nama: inputNama.value.trim(),
      harga: Number(inputHarga.value),
      qty: Number(inputQty.value)
    });
    simpan();
    form.reset();
    ["errNama", "errHarga", "errQty"].forEach(id => document.getElementById(id).textContent = "");
    [inputNama, inputHarga, inputQty].forEach(i => i.classList.remove("invalid"));
    inputNama.focus();
    render();
  });

  // ============ TAHAP 3: RENDER TABEL & HAPUS ============
  const tbody = document.getElementById("tbodyKeranjang");

  function renderTabel() {
    tbody.innerHTML = "";
    if (keranjang.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">Keranjang masih kosong. Tambahkan barang lewat form.</td></tr>';
      return;
    }
    keranjang.forEach(function (item, i) {
      const tr = document.createElement("tr");
      const subtotal = item.harga * item.qty;
      const sel = [i + 1, item.nama, rupiah(item.harga), item.qty, rupiah(subtotal)];
      sel.forEach(function (isi, idx) {
        const td = document.createElement("td");
        td.textContent = isi; // textContent mencegah injeksi HTML dari nama barang
        if (idx >= 2) td.className = "num";
        tr.appendChild(td);
      });
      const tdAksi = document.createElement("td");
      const btn = document.createElement("button");
      btn.className = "btn-delete";
      btn.textContent = "Hapus";
      btn.addEventListener("click", function () { hapusItem(i); });
      tdAksi.appendChild(btn);
      tr.appendChild(tdAksi);
      tbody.appendChild(tr);
    });
  }

  function hapusItem(index) {
    keranjang.splice(index, 1);
    simpan();
    render();
  }

  // ============ TAHAP 2: KALKULATOR ============
  const BATAS_DISKON = 50000;
  const PERSEN_DISKON = 0.10;

  function hitungTotal() {
    return keranjang.reduce((jumlah, item) => jumlah + item.harga * item.qty, 0);
  }

  function hitungDiskon(total) {
    const dapat = total >= BATAS_DISKON || (promoAktif && total > 0);
    return dapat ? Math.round(total * PERSEN_DISKON) : 0;
  }

  function renderKalkulator() {
    const total = hitungTotal();
    const diskon = hitungDiskon(total);
    const akhir = total - diskon;

    document.getElementById("totalBelanja").textContent = rupiah(total);
    document.getElementById("nominalDiskon").textContent = "- " + rupiah(diskon);
    document.getElementById("totalAkhir").textContent = rupiah(akhir);

    const info = document.getElementById("infoDiskon");
    if (total >= BATAS_DISKON) info.textContent = "Diskon 10% aktif (belanja minimal Rp 50.000).";
    else if (promoAktif && total > 0) info.textContent = "Kode HEMAT10 aktif: diskon 10%.";
    else info.textContent = "Diskon 10% otomatis untuk belanja minimal Rp 50.000, atau gunakan kode HEMAT10.";

    hitungKembalian(akhir);
  }

  const inputBayar = document.getElementById("uangBayar");
  const statusBayar = document.getElementById("statusBayar");

  function hitungKembalian(totalAkhir) {
    const raw = inputBayar.value.trim();
    const kembalianEl = document.getElementById("kembalian");
    statusBayar.className = "status";

    if (raw === "" || isNaN(Number(raw))) {
      kembalianEl.textContent = "Rp 0";
      statusBayar.classList.add("neutral");
      statusBayar.textContent = "";
      return;
    }
    const bayar = Number(raw);
    if (totalAkhir === 0) {
      kembalianEl.textContent = "Rp 0";
      statusBayar.classList.add("neutral");
      statusBayar.textContent = "Keranjang masih kosong.";
    } else if (bayar < totalAkhir) {
      kembalianEl.textContent = "Rp 0";
      statusBayar.classList.add("bad");
      statusBayar.textContent = "Uang belum mencukupi, kurang " + rupiah(totalAkhir - bayar) + ".";
    } else {
      kembalianEl.textContent = rupiah(bayar - totalAkhir);
      statusBayar.classList.add("ok");
      statusBayar.textContent = "Pembayaran cukup.";
    }
  }

  inputBayar.addEventListener("input", renderKalkulator);

  document.getElementById("btnPromo").addEventListener("click", function () {
    const kode = document.getElementById("kodePromo").value.trim().toUpperCase();
    const info = document.getElementById("infoDiskon");
    if (kode === "HEMAT10") {
      promoAktif = true;
      simpan();
      renderKalkulator();
    } else {
      promoAktif = false;
      simpan();
      renderKalkulator();
      info.textContent = "Kode promo tidak valid.";
    }
  });

  // ============ RESET TRANSAKSI ============
  document.getElementById("btnReset").addEventListener("click", function () {
    if (keranjang.length > 0 && !confirm("Kosongkan keranjang dan mulai transaksi baru?")) return;
    keranjang = [];
    promoAktif = false;
    localStorage.removeItem(KEY_KERANJANG);
    localStorage.removeItem(KEY_PROMO);
    document.getElementById("kodePromo").value = "";
    inputBayar.value = "";
    render();
  });

  // ============ RENDER UTAMA ============
  function render() {
    renderTabel();
    renderKalkulator();
  }

  // Validasi saat pengguna meninggalkan kolom (blur)
  inputNama.addEventListener("blur", validasiNama);
  inputHarga.addEventListener("blur", validasiHarga);
  inputQty.addEventListener("blur", validasiQty);

  // Mulai aplikasi
  muat();
  if (promoAktif) document.getElementById("kodePromo").value = "HEMAT10";
  render();
