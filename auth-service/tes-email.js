import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function kirimTes() {
  console.log("--- MEMULAI TES PENGIRIMAN EMAIL ---");
  console.log("Menggunakan Email:", process.env.EMAIL_USER);

  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });

  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: 'TES KONEKSI EMAIL SiRT 14',
    text: 'Halo kawan Alip! Jika kamu menerima email ini, berarti settingan email di .env sudah BENAR.'
  };


  try {
    console.log("Sedang mengirim... mohon tunggu...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ BERHASIL! Email terkirim.");
    console.log("ID Pesan:", info.messageId);
    console.log("Silakan cek kotak masuk (atau folder Spam) email kawan!");
  } catch (error) {
    console.error("❌ GAGAL mengirim email!");
    console.error("Pesan Error:", error.message);
    
    if (error.message.includes("Invalid login")) {
      console.log("\n--- ANALISA PENYAKIT ---");
      console.log("Google menolak login kawan. Ini karena:");
      console.log("1. Password di .env adalah password asli (Harusnya pakai App Password).");
      console.log("2. Ada salah ketik di EMAIL_USER atau EMAIL_PASS.");
    }
  }
}

kirimTes();