function cetak(id, teks) {
  document.getElementById(id).textContent += teks + "\n";
  console.log(teks);
}

const angkaPilihan = 7;
for (let i = 1; i <= 10; i++) {
  cetak("out1", angkaPilihan + " x " + i + " = " + (angkaPilihan * i));
}

function faktorial(n) {
  if (n < 0) return "tidak terdefinisi (angka negatif)";
  let hasil = 1;
  for (let i = 2; i <= n; i++) {
    hasil *= i;
  }
  return hasil;
}
[0, 5, 7, 10, -3].forEach(function (n) {
  cetak("out2", n + "! = " + faktorial(n));
});

function adalahPrima(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
[1, 2, 9, 13, 20, 29].forEach(function (n) {
  cetak("out3", n + (adalahPrima(n) ? " adalah bilangan prima" : " bukan bilangan prima"));
});

function hitungBmi(beratKg, tinggiCm) {
  const tinggiM = tinggiCm / 100;
  return beratKg / (tinggiM * tinggiM);
}
function kategoriBmi(bmi) {
  if (bmi < 18.5) return "Berat badan kurang";
  else if (bmi < 25) return "Normal";
  else if (bmi < 30) return "Berat badan berlebih";
  else return "Obesitas";
}
document.getElementById("btnBmi").addEventListener("click", function () {
  const berat = Number(document.getElementById("berat").value);
  const tinggi = Number(document.getElementById("tinggi").value);
  const out = document.getElementById("out4");
  out.classList.remove("salah");

  if (!(berat > 0) || !(tinggi > 0)) { 
    out.classList.add("salah");
    out.textContent = "Berat dan tinggi harus berupa angka lebih dari 0.";
    return;
  }
  const bmi = hitungBmi(berat, tinggi);
  out.textContent = "BMI Anda: " + bmi.toFixed(1) + "\nKategori: " + kategoriBmi(bmi);
});

for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) cetak("out5", "FizzBuzz");
  else if (i % 3 === 0) cetak("out5", "Fizz");
  else if (i % 5 === 0) cetak("out5", "Buzz");
  else cetak("out5", String(i));
}
