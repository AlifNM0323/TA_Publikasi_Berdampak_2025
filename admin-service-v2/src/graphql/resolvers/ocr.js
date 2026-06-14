const Tesseract = require('tesseract.js');

const ocrResolvers = {
  Mutation: {
    scanKK: async (_, { imageBase64 }) => {
      try {

        const { data: { text } } = await Tesseract.recognize(
          imageBase64,
          'ind', 
          { logger: m => console.log(m) } 
        );

    
        const nikMatch = text.match(/\d{16}/);
        const nik = nikMatch ? nikMatch[0] : "NIK tidak terdeteksi";

  
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