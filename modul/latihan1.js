function cetak(id, teks) {
  document.getElementById(id).textContent += teks + "\n";
  console.log(teks);
}

const nama = "Najib Abhinaya";
let umur = 21;                  
let kotaAsal = "Bengkulu"; 
cetak("out1", "Nama      : " + nama);
cetak("out1", "Umur      : " + umur);
cetak("out1", "Kota asal : " + kotaAsal);
umur = umur + 1; 
cetak("out1", "Umur tahun depan: " + umur);
umur = umur - 1; 

const nilai = 78; 
if (nilai >= 70) {
  cetak("out2", "Nilai " + nilai + ": LULUS");
} else {
  cetak("out2", "Nilai " + nilai + ": TIDAK LULUS");
}

function kategoriUmur(u) {
  if (u < 12) return "Anak";
  else if (u <= 17) return "Remaja";
  else if (u <= 59) return "Dewasa";
  else return "Lansia";
}
[5, 15, 30, 65].forEach(function (u) {
  cetak("out3", "Umur " + u + " = " + kategoriUmur(u));
});
cetak("out3", "Umur saya (" + umur + ") = " + kategoriUmur(umur));

function namaHari(angka) {
  switch (angka) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    case 7: return "Sunday";
    default: return "Angka tidak valid (harus 1-7)";
  }
}
[1, 4, 7, 9].forEach(function (a) {
  cetak("out4", a + " = " + namaHari(a));
});

function hitungGrade(n) {
  return n >= 90 ? "A"
       : n >= 80 ? "B"
       : n >= 70 ? "C"
       : n >= 60 ? "D"
       : "E";
}
[95, 85, 72, 65, 40].forEach(function (n) {
  cetak("out5", "Nilai " + n + " = Grade " + hitungGrade(n));
});
