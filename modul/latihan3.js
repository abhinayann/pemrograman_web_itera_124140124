let mahasiswa = [
  { nama: "Haewon",  nim: "124140001", jurusan: "Teknik Informatika", nilai: 85 },
  { nama: "Lily",  nim: "124140002", jurusan: "Teknik Informatika",   nilai: 72 },
  { nama: "Yoona", nim: "124140003", jurusan: "Teknik Informatika", nilai: 91 },
  { nama: "Jinsol",nim: "124140004", jurusan: "Teknik Informatika",     nilai: 64 },
  { nama: "Jiwoo",    nim: "124140005", jurusan: "Teknik Informatika",   nilai: 78 },
  { nama: "Kyujin", nim: "124140006", jurusan: "Teknik Informatika",     nilai: 55 }
];
let nimSedangDiedit = null;

const $ = (id) => document.getElementById(id);

function sel(teks) {
  const td = document.createElement("td");
  td.textContent = teks;
  return td;
}

function renderTabelUtama() {
  const tbody = $("tbodyUtama");
  tbody.innerHTML = "";
  if (mahasiswa.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Belum ada data.</td></tr>';
    return;
  }
  mahasiswa.forEach(function (m, i) {
    const tr = document.createElement("tr");
    [i + 1, m.nama, m.nim, m.jurusan, m.nilai].forEach((v) => tr.appendChild(sel(v)));

    const tdAksi = document.createElement("td");
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.addEventListener("click", () => mulaiEdit(m.nim));
    const btnHapus = document.createElement("button");
    btnHapus.textContent = "Hapus";
    btnHapus.addEventListener("click", () => hapus(m.nim));
    tdAksi.append(btnEdit, btnHapus);
    tr.appendChild(tdAksi);
    tbody.appendChild(tr);
  });
}

function cariTertinggi(data) {
  return data.reduce((maks, m) => (m.nilai > maks.nilai ? m : maks));
}
function hitungRata(data) {
  return data.reduce((total, m) => total + m.nilai, 0) / data.length;
}
function renderRingkasan() {
  const tbody = $("tbodyAtas");
  tbody.innerHTML = "";
  if (mahasiswa.length === 0) {
    $("infoTertinggi").textContent = "Nilai tertinggi: -";
    $("infoRata").textContent = "Rata-rata: -";
    return;
  }
  const top = cariTertinggi(mahasiswa);
  const rata = hitungRata(mahasiswa);
  $("infoTertinggi").textContent = "Nilai tertinggi: " + top.nama + " (" + top.nilai + ")";
  $("infoRata").textContent = "Rata-rata kelas: " + rata.toFixed(2) + ". Mahasiswa di atas rata-rata:";

  mahasiswa.filter((m) => m.nilai > rata).forEach(function (m) {
    const tr = document.createElement("tr");
    [m.nama, m.nim, m.jurusan, m.nilai].forEach((v) => tr.appendChild(sel(v)));
    tbody.appendChild(tr);
  });
}

function urutkanNama(arah) {
  mahasiswa.sort(function (a, b) {
    const hasil = a.nama.localeCompare(b.nama);
    return arah === "asc" ? hasil : -hasil;
  });
  render();
}
$("btnAsc").addEventListener("click", () => urutkanNama("asc"));
$("btnDesc").addEventListener("click", () => urutkanNama("desc"));

function validasi(data) {
  if (data.nama.length < 3) return "Nama minimal 3 karakter.";
  if (!/^\d+$/.test(data.nim)) return "NIM wajib diisi dan hanya berisi angka.";
  if (data.jurusan === "") return "Jurusan wajib diisi.";
  if (isNaN(data.nilai) || data.nilai < 0 || data.nilai > 100) return "Nilai harus angka 0 sampai 100.";
  const kembar = mahasiswa.some((m) => m.nim === data.nim && m.nim !== nimSedangDiedit);
  if (kembar) return "NIM sudah terdaftar.";
  return "";
}

$("btnSimpan").addEventListener("click", function () {
  const data = {
    nama: $("nama").value.trim(),
    nim: $("nim").value.trim(),
    jurusan: $("jurusan").value.trim(),
    nilai: $("nilai").value.trim() === "" ? NaN : Number($("nilai").value)
  };
  const pesan = validasi(data);
  $("pesanError").textContent = pesan;
  if (pesan) return;

  if (nimSedangDiedit === null) {
    mahasiswa.push(data);                                    
  } else {
    const idx = mahasiswa.findIndex((m) => m.nim === nimSedangDiedit);
    mahasiswa[idx] = data;                                   
  }
  keModeTambah();
  render();
});

function mulaiEdit(nim) {
  const m = mahasiswa.find((x) => x.nim === nim);
  $("nama").value = m.nama;
  $("nim").value = m.nim;
  $("jurusan").value = m.jurusan;
  $("nilai").value = m.nilai;
  nimSedangDiedit = nim;
  $("judulForm").textContent = "5. Edit mahasiswa (Update)";
  $("btnSimpan").textContent = "Simpan perubahan";
  $("btnBatal").hidden = false;
  $("pesanError").textContent = "";
}

function keModeTambah() {
  nimSedangDiedit = null;
  ["nama", "nim", "jurusan", "nilai"].forEach((id) => ($(id).value = ""));
  $("judulForm").textContent = "5. Tambah mahasiswa (Create)";
  $("btnSimpan").textContent = "Tambah";
  $("btnBatal").hidden = true;
  $("pesanError").textContent = "";
}
$("btnBatal").addEventListener("click", keModeTambah);


function hapus(nim) {
  if (!confirm("Hapus data mahasiswa dengan NIM " + nim + "?")) return;
  mahasiswa = mahasiswa.filter((m) => m.nim !== nim);
  if (nimSedangDiedit === nim) keModeTambah();
  render();
}

function render() {
  renderTabelUtama();
  renderRingkasan();
}
render();
