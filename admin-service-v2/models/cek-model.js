import dotenv from 'dotenv';
dotenv.config();

async function cekModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return console.log("❌ API KEY Kosong di .env!");

  try {
    console.log("⏳ Menghubungi Server Google AI...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
       return console.log("❌ Error dari Google:", data.error.message);
    }

    console.log("\n✅ MODEL YANG AKTIF & BISA KAWAN PAKAI SAAT INI:");
    data.models.forEach(m => {
      // Kita hanya filter model yang bisa membaca gambar & teks
      if (m.supportedGenerationMethods.includes("generateContent") && m.name.includes("flash")) {
         console.log(`👉 NAMA MODEL: "${m.name.replace('models/', '')}"`);
      }
    });
    console.log("\n");
  } catch (e) {
    console.log("❌ Error Script:", e.message);
  }
}

cekModel();