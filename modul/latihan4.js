const $ = (id) => document.getElementById(id);

function bacaStorage(kunci, awal) {
  try { return JSON.parse(localStorage.getItem(kunci)) ?? awal; }
  catch (e) { return awal; }
}
function tulisStorage(kunci, nilai) {
  localStorage.setItem(kunci, JSON.stringify(nilai));
}
function sel(teks) {
  const td = document.createElement("td");
  td.textContent = teks;
  return td;
}

function terapkanTema(gelap) {
  document.body.classList.toggle("dark", gelap);
  $("btnTema").textContent = gelap ? "Mode terang" : "Mode gelap";
}
$("btnTema").addEventListener("click", function () {
  const gelap = !document.body.classList.contains("dark");
  terapkanTema(gelap);
  tulisStorage("tema_gelap", gelap);
});
terapkanTema(bacaStorage("tema_gelap", false));

let daftarMhs = bacaStorage("mahasiswa", []);

function setError(id, pesan) { $(id).textContent = pesan; return pesan === ""; }

$("formMhs").addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = $("mNama").value.trim();
  const nim = $("mNim").value.trim();
  const jurusan = $("mJurusan").value.trim();
  const nilaiRaw = $("mNilai").value.trim();
  const nilai = Number(nilaiRaw);

  const hasil = [
    setError("eNama", nama.length < 3 ? "Nama minimal 3 karakter." : ""),
    setError("eNim", !/^\d+$/.test(nim) ? "NIM wajib diisi dan hanya angka."
                    : daftarMhs.some((m) => m.nim === nim) ? "NIM sudah terdaftar." : ""),
    setError("eJurusan", jurusan === "" ? "Jurusan wajib diisi." : ""),
    setError("eNilai", nilaiRaw === "" || nilai < 0 || nilai > 100 ? "Nilai harus angka 0 sampai 100." : "")
  ];
  if (!hasil.every(Boolean)) return;

  daftarMhs.push({ nama, nim, jurusan, nilai });
  tulisStorage("mahasiswa", daftarMhs);
  this.reset();
  renderMhs();
});

function renderMhs() {
  const tbody = $("tbodyMhs");
  tbody.innerHTML = "";
  if (daftarMhs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Belum ada data. Tambahkan lewat form.</td></tr>';
    return;
  }
  daftarMhs.forEach(function (m, i) {
    const tr = document.createElement("tr");
    [i + 1, m.nama, m.nim, m.jurusan, m.nilai].forEach((v) => tr.appendChild(sel(v)));
    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Hapus";
    btn.addEventListener("click", function () {
      daftarMhs.splice(i, 1);
      tulisStorage("mahasiswa", daftarMhs);
      renderMhs();
    });
    td.appendChild(btn);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}
renderMhs();

const URL_POSTS = "https://jsonplaceholder.typicode.com/posts";
const PER_HALAMAN = 10;
let semuaPost = [];
let halaman = 1;

async function muatPost() {
  $("statusPost").textContent = "Memuat data...";
  try {
    const res = await fetch(URL_POSTS);
    if (!res.ok) throw new Error("Status " + res.status);
    semuaPost = await res.json();
    $("statusPost").textContent = "";
  } catch (err) {
    $("statusPost").textContent = "Gagal memuat data dari API. Periksa koneksi internet lalu muat ulang halaman.";
  }
  renderPost();
}

function renderPost() {
  const kata = $("cariPost").value.trim().toLowerCase();
  // Search: filter berdasarkan title
  const hasil = semuaPost.filter((p) => p.title.toLowerCase().includes(kata));
  // Pagination: hitung jumlah halaman, lalu potong array
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  if (halaman > totalHalaman) halaman = totalHalaman;
  const awal = (halaman - 1) * PER_HALAMAN;
  const tampil = hasil.slice(awal, awal + PER_HALAMAN);

  const wadah = $("daftarPost");
  wadah.innerHTML = "";
  if (tampil.length === 0 && semuaPost.length > 0) {
    wadah.textContent = "Tidak ada post yang cocok dengan pencarian.";
  }
  tampil.forEach(function (p) {
    const div = document.createElement("div");
    div.className = "post";
    const judul = document.createElement("strong");
    judul.textContent = p.id + ". " + p.title;
    const isi = document.createElement("div");
    const kecil = document.createElement("small");
    kecil.textContent = p.body;
    isi.appendChild(kecil);
    div.append(judul, isi);
    wadah.appendChild(div);
  });

  $("infoHalaman").textContent = "Halaman " + halaman + " dari " + totalHalaman + " (" + hasil.length + " post)";
  $("btnPrev").disabled = halaman <= 1;
  $("btnNext").disabled = halaman >= totalHalaman;
}

$("cariPost").addEventListener("input", function () { halaman = 1; renderPost(); });
$("btnPrev").addEventListener("click", function () { halaman--; renderPost(); });
$("btnNext").addEventListener("click", function () { halaman++; renderPost(); });
muatPost();

let todos = bacaStorage("todos", []);

function simpanTodo() { tulisStorage("todos", todos); renderTodo(); }

function tambahTodo() {
  const teks = $("inputTodo").value.trim();
  if (teks === "") { $("eTodo").textContent = "Tugas tidak boleh kosong."; return; }
  $("eTodo").textContent = "";
  todos.push({ id: Date.now(), teks: teks, selesai: false });
  $("inputTodo").value = "";
  simpanTodo();
}
$("btnTodo").addEventListener("click", tambahTodo);
$("inputTodo").addEventListener("keydown", function (e) { if (e.key === "Enter") tambahTodo(); });

function renderTodo() {
  const ul = $("daftarTodo");
  ul.innerHTML = "";
  if (todos.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Belum ada tugas.";
    ul.appendChild(li);
    return;
  }
  todos.forEach(function (t) {
    const li = document.createElement("li");
    li.className = "item" + (t.selesai ? " selesai" : "");

    const cek = document.createElement("input");
    cek.type = "checkbox";
    cek.style.width = "auto";
    cek.checked = t.selesai;
    cek.setAttribute("aria-label", "Tandai selesai: " + t.teks);
    cek.addEventListener("change", function () { t.selesai = cek.checked; simpanTodo(); });

    const span = document.createElement("span");
    span.textContent = t.teks;

    const hapus = document.createElement("button");
    hapus.textContent = "Hapus";
    hapus.addEventListener("click", function () {
      todos = todos.filter((x) => x.id !== t.id);
      simpanTodo();
    });
    li.append(cek, span, hapus);
    ul.appendChild(li);
  });
}
renderTodo();
