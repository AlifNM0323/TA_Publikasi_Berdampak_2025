const Tesseract = require('tesseract.js');

const ocrResolvers = {
  Mutation: {
    scanKK: async (_, { imageBase64 }) => {
      try {
        // Proses OCR menggunakan bahasa Indonesia
        const { data: { text } } = await Tesseract.recognize(
          imageBase64,
          'ind', 
          { logger: m => console.log(m) } // Biar lo bisa liat progress di terminal
        );

        // LOGIKA PARSING (Mencari NIK 16 Digit)
        const nikMatch = text.match(/\d{16}/);
        const nik = nikMatch ? nikMatch[0] : "NIK tidak terdeteksi";

        // LOGIKA PARSING (Mencari Nama - Sederhana)
        // Biasanya nama ada setelah kata "Nama Lengkap"
        const namaMatch = text.match(/Nama Lengkap\s*[:]\s*([A-Z\s]+)/i);
        const nama = namaMatch ? namaMatch[1].trim() : "Nama tidak terdeteksi";

        return {
          nik,
          nama,
          rawText: text,
          status: true,
          message: "Scan berhasil"
        };
      } catch (error) {
        console.error(error);
        return {
          status: false,
          message: "Gagal memproses gambar: " + error.message
        };
      }
    }
  }
};

module.exports = ocrResolvers;