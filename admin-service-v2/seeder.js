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

const firstNamesL = ["Budi", "Joko", "Asep", "Dedi", "Eko", "Agus", "Rudi", "Iwan", "Hendra", "Fajar", "Bayu", "Dimas", "Adi", "Reza", "Gilang", "Rian", "Dani", "Yusuf", "Ilham", "Rizky", "Slamet", "Bambang", "Suparman"];
const firstNamesP = ["Siti", "Sri", "Rina", "Dewi", "Lina", "Ani", "Yuni", "Putri", "Indah", "Sari", "Maya", "Nur", "Ratna", "Wulan", "Dian", "Nisa", "Fitri", "Tia", "Eka", "Lilis", "Sumiyati", "Hartini"];
const lastNames = ["Santoso", "Wijaya", "Saputra", "Hidayat", "Kusuma", "Pratama", "Siregar", "Utama", "Nugraha", "Permana", "Wibowo", "Setiawan", "Ramadhan", "Haryanto", "Gunawan", "Susanto", "Mulyana", "Subagja", "Firmansyah", "Nasution"];
const streets = ["Jl. Melati", "Jl. Mawar", "Jl. Anggrek", "Jl. Kamboja", "Jl. Kenanga", "Jl. Flamboyan", "Jl. Dahlia", "Jl. Cempaka", "Gg. Buntu", "Gg. Masjid", "Jl. Merpati", "Jl. Elang"];
const insurances = ['BPJS Mandiri', 'BPJS dari Pekerjaan', 'KIS', 'Asuransi Swasta', 'Asuransi Swasta Lainnya', 'Tidak Ada'];

const generatedNIKs = new Set();
const generatedNames = new Set();
const generatedEmails = new Set();

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateUniqueNIK = (gender, yearCode) => {
  let nik;
  do {
    const code = gender === 'L' ? '3201' : '3202';
    const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    nik = `${code}${yearCode}${randomDigits}`.substring(0, 16);
  } while (generatedNIKs.has(nik));
  generatedNIKs.add(nik);
  return nik;
};

const generateUniqueName = (gender) => {
  let name;
  let attempt = 0;
  do {
    const first = getRandom(gender === 'L' ? firstNamesL : firstNamesP);
    const last = getRandom(lastNames);
    name = attempt === 0 ? `${first} ${last}` : `${first} ${last} ${attempt}`;
    attempt++;
  } while (generatedNames.has(name));
  generatedNames.add(name);
  return name;
};

// GENERATE EMAIL OTOMATIS BERDASARKAN NAMA
const generateUniqueEmail = (name) => {
  let email;
  let attempt = 0;
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, ''); // Hapus spasi
  do {
    email = attempt === 0 ? `${cleanName}@warga.com` : `${cleanName}${attempt}@warga.com`;
    attempt++;
  } while (generatedEmails.has(email));
  generatedEmails.add(email);
  return email;
};

const generatePhone = () => '08' + Math.floor(Math.random() * 10000000000).toString().substring(0, 10);

const generateDOBbyAge = (age) => {
  const currentYear = 2026;
  const birthYear = currentYear - age;
  const month = getRandomInt(1, 12).toString().padStart(2, '0');
  const day = getRandomInt(1, 28).toString().padStart(2, '0');
  return `${birthYear}-${month}-${day}`;
};

const importData = async () => {
  try {
    console.log('🧹 Menghapus data lama...'.yellow);
    await Family.deleteMany();
    await Citizen.deleteMany();
    await TrashBank.deleteMany();

    let families = [];
    let citizens = [];
    let trashLogs = [];
    
    console.log('🚀 Generating Data Lengkap (Semua Warga Punya Email)...'.blue);

    for (let i = 0; i < 100; i++) {
      const kepalaKeluargaName = generateUniqueName('L');
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

      // 1. KEPALA KELUARGA (PASTI DAPAT EMAIL)
      const fatherAge = getRandomInt(25, 75);
      const fatherId = new mongoose.Types.ObjectId();
      citizens.push({
        _id: fatherId, 
        familyId: familyId,
        name: kepalaKeluargaName,
        nik: generateUniqueNIK('L', 99), 
        gender: 'L',
        religion: 'Islam',
        profession: fatherAge > 60 ? 'Pensiunan' : getRandom(['Wiraswasta', 'Buruh', 'PNS', 'Karyawan', 'Pedagang']),
        address: address,
        placeOfBirth: 'Bogor',
        dateOfBirth: generateDOBbyAge(fatherAge), 
        relationship: 'KEPALA KELUARGA/SUAMI',
        phone: generatePhone(),
        email: generateUniqueEmail(kepalaKeluargaName),
        insurance: getRandom(insurances)
      });

      // 2. ISTRI (PASTI DAPAT EMAIL)
      if (Math.random() > 0.1) {
        const wifeName = generateUniqueName('P');
        const wifeId = new mongoose.Types.ObjectId();
        citizens.push({
          _id: wifeId,
          familyId: familyId,
          name: wifeName,
          nik: generateUniqueNIK('P', 99),
          gender: 'P',
          religion: 'Islam',
          profession: getRandom(['IRT', 'Pedagang', 'Karyawan', 'Guru', 'Bidan']),
          address: address,
          placeOfBirth: 'Bogor',
          dateOfBirth: generateDOBbyAge(fatherAge - getRandomInt(0, 5)), 
          relationship: 'ISTRI',
          phone: generatePhone(),
          email: generateUniqueEmail(wifeName), 
          insurance: getRandom(insurances)
        });
      }

      // 3. ANAK-ANAK (SEMUA UMUR SEKARANG PASTI DAPAT EMAIL)
      const childCount = getRandomInt(0, 4);
      for (let j = 0; j < childCount; j++) {
        const maxChildAge = fatherAge - 19;
        if (maxChildAge > 0) {
            const childAge = getRandomInt(0, maxChildAge);
            const childGender = Math.random() > 0.5 ? 'L' : 'P';
            const childName = generateUniqueName(childGender);
            const childId = new mongoose.Types.ObjectId();
            
            let profession = childAge >= 6 && childAge <= 18 ? 'Pelajar' : childAge > 18 ? 'Mahasiswa' : childAge > 23 ? 'Karyawan' : 'Belum Sekolah';

            citizens.push({
              _id: childId,
              familyId: familyId,
              name: childName,
              nik: generateUniqueNIK(childGender, 99),
              gender: childGender,
              religion: 'Islam',
              profession: profession,
              address: address,
              placeOfBirth: 'Bogor',
              dateOfBirth: generateDOBbyAge(childAge), 
              relationship: `ANAK ${j + 1}`,
              phone: childAge > 10 ? generatePhone() : '-',
              email: generateUniqueEmail(childName), // <<< HILANG SUDAH BATASAN UMURNYA, SEMUA ANAK DAPAT EMAIL!
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
                citizenId: randomCitizen._id,
                depositorName: randomCitizen.name,
                trashType: getRandom(['Campuran', 'Botol Bersih', 'Kardus', 'Besi']), 
                weight: getRandomInt(1, 5),
                pricePerKg: 3000,
                deposit: getRandomInt(3000, 15000),
                withdrawal: 0,
                balance: fam.balance,
                txnDate: new Date(new Date() - Math.random() * 1e10),
                operator: "Admin RT"
            });
        }
    }

    await Family.insertMany(families);
    await Citizen.insertMany(citizens);
    await TrashBank.insertMany(trashLogs);

    console.log(`✅ SUKSES!`.green.bold);
    console.log(`Data Unik Terbuat: ${generatedNames.size} Nama, ${generatedNIKs.size} NIK, ${generatedEmails.size} Email.`.white);
    console.log(`Total Warga Terbuat: ${citizens.length}`.cyan);
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

importData();