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


// import dotenv from 'dotenv';
// dotenv.config();

// async function cekModelClaude() {
//   const apiKey = process.env.CLAUDE_API_KEY; // Pastikan ganti nama variabel di .env
//   if (!apiKey) return console.log("❌ API KEY Claude Kosong di .env!");

//   try {
//     console.log("⏳ Menghubungi Server Anthropic...");
    
//     const response = await fetch("https://api.anthropic.com/v1/models", {
//       method: "GET",
//       headers: {
//         "x-api-key": apiKey,
//         "anthropic-version": "2023-06-01" // Wajib ada untuk API Claude
//       }
//     });

//     const data = await response.json();

//     if (data.error) {
//        return console.log("❌ Error dari Anthropic:", data.error.message);
//     }

//     console.log("\n✅ MODEL CLAUDE YANG TERSEDIA:");
//     data.data.forEach(m => {
//        console.log(`👉 NAMA MODEL: "${m.id}"`);
//     });
//     console.log("\n");

//   } catch (e) {
//     console.log("❌ Error Script:", e.message);
//   }
// }

// cekModelClaude();