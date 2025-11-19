const express = require('express');
const Citizen = require('../models/Citizen'); // Pastikan model Citizen terhubung dengan koleksi 'citizens'

const router = express.Router();

// CREATE: Menambahkan citizen baru
router.post('/', async (req, res) => {
  const { citizen_id, family_id, contribution_id, name, nik, gender, religion, address, profession, place_of_birth, date_of_birth } = req.body;

  console.log("Data yang Diterima:", req.body); // Log data yang diterima

  // Periksa apakah nik sudah ada di database
  const existingCitizen = await Citizen.findOne({ nik });
  if (existingCitizen) {
    return res.status(400).json({ error: 'NIK sudah terdaftar, silakan gunakan NIK yang berbeda' });
  }

  try {
    const newCitizen = new Citizen({
      citizen_id, 
      family_id, 
      contribution_id, 
      name, 
      nik, 
      gender, 
      religion, 
      address, 
      profession, 
      place_of_birth, 
      date_of_birth,
    });

    // Simpan data citizen ke database
    await newCitizen.save();
    console.log("Data Disimpan:", newCitizen); // Log data yang disimpan
    res.status(201).json({ message: 'Citizen berhasil ditambahkan', citizen: newCitizen });
  } catch (err) {
    console.log("Error:", err); // Log error jika terjadi masalah saat menyimpan
    res.status(500).json({ error: err.message });
  }
});

// READ: Menampilkan semua citizen
router.get('/', async (req, res) => {
  try {
    const data = await Citizen.find(); // Mengambil semua data citizen dari database
    if (data.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data citizen ditemukan' });
    }
    res.status(200).json(data); // Kirimkan data sebagai JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // Kirimkan error jika ada masalah
  }
});

// READ: Menampilkan citizen berdasarkan ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const citizen = await Citizen.findById(id);
    if (!citizen) {
      return res.status(404).json({ message: 'Citizen tidak ditemukan' });
    }
    res.status(200).json(citizen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Memperbarui citizen berdasarkan ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, nik, gender, religion, address, profession, place_of_birth, date_of_birth } = req.body;

  try {
    const updatedCitizen = await Citizen.findByIdAndUpdate(
      id,
      { name, nik, gender, religion, address, profession, place_of_birth, date_of_birth },
      { new: true } // Mengembalikan citizen yang sudah diperbarui
    );
    if (!updatedCitizen) {
      return res.status(404).json({ message: 'Citizen tidak ditemukan' });
    }
    res.status(200).json({ message: 'Citizen berhasil diperbarui', citizen: updatedCitizen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Menghapus citizen berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCitizen = await Citizen.findByIdAndDelete(id);
    if (!deletedCitizen) {
      return res.status(404).json({ message: 'Citizen tidak ditemukan' });
    }
    res.status(200).json({ message: 'Citizen berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
