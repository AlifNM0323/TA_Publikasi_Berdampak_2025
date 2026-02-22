import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Family from './models/Family.js';
import Citizen from './models/Citizen.js';
import TrashBank from './models/TrashBank.js';

dotenv.config();

// KONEKSI DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔌 MongoDB Connected...'.cyan.underline))
  .catch(err => {
    console.error(`❌ Connection Error: ${err.message}`.red);
    process.exit(1);
  });

// --- DATA NAMA & ALAMAT ---
const firstNamesL = ["Budi", "Joko", "Asep", "Dedi", "Eko", "Agus", "Rudi", "Iwan", "Hendra", "Fajar", "Bayu", "Dimas", "Adi", "Reza", "Gilang", "Rian", "Dani", "Yusuf", "Ilham", "Rizky", "Slamet", "Bambang", "Suparman"];
const firstNamesP = ["Siti", "Sri", "Rina", "Dewi", "Lina", "Ani", "Yuni", "Putri", "Indah", "Sari", "Maya", "Nur", "Ratna", "Wulan", "Dian", "Nisa", "Fitri", "Tia", "Eka", "Lilis", "Sumiyati", "Hartini"];
const lastNames = ["Santoso", "Wijaya", "Saputra", "Hidayat", "Kusuma", "Pratama", "Siregar", "Utama", "Nugraha", "Permana", "Wibowo", "Setiawan", "Ramadhan", "Haryanto", "Gunawan", "Susanto", "Mulyana", "Subagja", "Firmansyah", "Nasution"];
const streets = ["Jl. Melati", "Jl. Mawar", "Jl. Anggrek", "Jl. Kamboja", "Jl. Kenanga", "Jl. Flamboyan", "Jl. Dahlia", "Jl. Cempaka", "Gg. Buntu", "Gg. Masjid", "Jl. Merpati", "Jl. Elang"];

// --- DATA ASURANSI BARU ---
const insurances = ['BPJS Mandiri', 'BPJS dari Pekerjaan', 'KIS', 'Asuransi Swasta', 'Asuransi Swasta Lainnya', 'Tidak Ada'];

// --- HELPER FUNCTIONS ---
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate NIK (16 digit)
const generateNIK = (gender, yearCode) => {
  const code = gender === 'L' ? '3201' : '3202';
  const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return `${code}${yearCode}${randomDigits}`.substring(0, 16);
};

// Generate No HP Random
const generatePhone = () => {
  return '08' + Math.floor(Math.random() * 10000000000).toString().substring(0, 10);
};

// --- FUNGSI PENTING: GENERATE TANGGAL LAHIR ---
// Input: Umur (misal 5 tahun) -> Output: "2021-05-20"
const generateDOBbyAge = (age) => {
  const currentYear = 2026; // Tahun Sistem Saat Ini
  const birthYear = currentYear - age;
  
  // Random Bulan (01-12) dan Tanggal (01-28)
  const month = getRandomInt(1, 12).toString().padStart(2, '0');
  const day = getRandomInt(1, 28).toString().padStart(2, '0');
  
  return `${birthYear}-${month}-${day}`;
};

const importData = async () => {
  try {
    // 1. BERSIHKAN DATA LAMA
    console.log('🧹 Menghapus data lama...'.yellow);
    await Family.deleteMany();
    await Citizen.deleteMany();
    await TrashBank.deleteMany();

    let families = [];
    let citizens = [];
    let trashLogs = [];
    
    console.log('🚀 Generating Data Lengkap (HP, Asuransi, Umur, Status Anak)...'.blue);

    for (let i = 0; i < 100; i++) {
      // --- A. DATA KELUARGA ---
      const firstName = getRandom(firstNamesL);
      const lastName = getRandom(lastNames);
      const kepalaKeluargaName = `${firstName} ${lastName}`;
      const noKK = `3201${getRandomInt(1000, 9999)}${getRandomInt(1000, 9999)}${getRandomInt(1000, 9999)}`;
      const address = `${getRandom(streets)} No. ${getRandomInt(1, 150)}`;
      
      const familyId = new mongoose.Types.ObjectId();
      const hasTabungan = Math.random() > 0.3; 
      const berat = hasTabungan ? getRandomInt(1, 50) : 0;
      const saldo = berat * 3000;

      families.push({
        _id: familyId,
        kepalaKeluarga: kepalaKeluargaName,
        noKK: noKK,
        address: address,
        ownershipStatus: getRandom(['OWNED', 'RENT', 'OFFICIAL']),
        totalTabungan: berat,
        balance: saldo,
        qrCode: `RT14-${noKK}`
      });

      // --- B. ANGGOTA KELUARGA ---
      
      // 1. KEPALA KELUARGA (AYAH)
      // Umur antara 25 sampai 75 tahun
      const fatherAge = getRandomInt(25, 75);
      const fatherDOB = generateDOBbyAge(fatherAge);

      citizens.push({
        familyId: familyId,
        name: kepalaKeluargaName,
        nik: generateNIK('L', 99), 
        gender: 'L',
        religion: 'Islam',
        profession: fatherAge > 60 ? 'Pensiunan' : getRandom(['Wiraswasta', 'Buruh', 'PNS', 'Karyawan', 'Pedagang']),
        address: address,
        placeOfBirth: 'Bogor',
        dateOfBirth: fatherDOB, 
        relationship: 'KEPALA KELUARGA/SUAMI', // Penyesuaian Status Baru
        phone: generatePhone(),                // Field HP
        insurance: getRandom(insurances)       // Field Asuransi
      });

      // 2. ISTRI (IBU)
      const hasWife = Math.random() > 0.1; // 90% punya istri
      if (hasWife) {
        const motherAge = fatherAge - getRandomInt(0, 5);
        const motherDOB = generateDOBbyAge(motherAge);
        const wifeName = `${getRandom(firstNamesP)} ${getRandom(lastNames)}`;

        citizens.push({
          familyId: familyId,
          name: wifeName,
          nik: generateNIK('P', 99),
          gender: 'P',
          religion: 'Islam',
          profession: getRandom(['IRT', 'Pedagang', 'Karyawan', 'Guru', 'Bidan']),
          address: address,
          placeOfBirth: 'Bogor',
          dateOfBirth: motherDOB, 
          relationship: 'ISTRI',                 // Penyesuaian Status Baru
          phone: generatePhone(),                // Field HP
          insurance: getRandom(insurances)       // Field Asuransi
        });
      }

      // 3. ANAK-ANAK (Generasi Balita s/d Dewasa)
      const childCount = getRandomInt(0, 4);
      
      for (let j = 0; j < childCount; j++) {
        // Logika Umur Anak: Harus lebih muda minimal 18 tahun dari Bapaknya
        const maxChildAge = fatherAge - 19;
        const minChildAge = 0; // Baru lahir
        
        // Pastikan tidak error kalau bapaknya masih muda banget
        if (maxChildAge > 0) {
            const childAge = getRandomInt(minChildAge, maxChildAge);
            const childDOB = generateDOBbyAge(childAge);
            
            const childGender = Math.random() > 0.5 ? 'L' : 'P';
            const childName = `${getRandom(childGender === 'L' ? firstNamesL : firstNamesP)} ${getRandom(lastNames)}`;
            
            // Tentukan status pekerjaan berdasarkan umur
            let profession = 'Belum Sekolah';
            if (childAge >= 6 && childAge <= 18) profession = 'Pelajar';
            else if (childAge > 18) profession = 'Mahasiswa';
            else if (childAge > 23) profession = 'Karyawan';

            citizens.push({
              familyId: familyId,
              name: childName,
              nik: generateNIK(childGender, 99),
              gender: childGender,
              religion: 'Islam',
              profession: profession,
              address: address,
              placeOfBirth: 'Bogor',
              dateOfBirth: childDOB, 
              relationship: `ANAK ${j + 1}`, // OTOMATIS ANAK 1, ANAK 2, ANAK 3
              phone: childAge > 10 ? generatePhone() : '-', // Anak di bawah 10 thn biasanya tidak punya HP
              insurance: getRandom(insurances)
            });
        }
      }
    }

    // --- C. LOG TRANSAKSI BANK SAMPAH ---
    for(let i=0; i<50; i++) {
        const randomCitizen = getRandom(citizens);
        const fam = families.find(f => f._id === randomCitizen.familyId);
        if(fam && fam.totalTabungan > 0) {
            trashLogs.push({
                familyId: fam._id,
                depositorName: randomCitizen.name,
                trashType: getRandom(['Plastik', 'Kertas/Kardus', 'Logam/Besi', 'Kaca']),
                weight: getRandomInt(1, 5),
                pricePerKg: 3000,
                debit: getRandomInt(3000, 15000),
                credit: 0,
                balance: fam.balance,
                txnDate: new Date(new Date() - Math.random() * 1e10)
            });
        }
    }

    await Family.insertMany(families);
    await Citizen.insertMany(citizens);
    await TrashBank.insertMany(trashLogs);

    console.log(`✅ SUKSES!`.green.bold);
    console.log(`Semua warga sudah punya HP, Asuransi, Tanggal Lahir, dan Status Anak Urut.`.white);
    console.log(`Total Warga Terbuat: ${citizens.length}`.cyan);
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

importData();