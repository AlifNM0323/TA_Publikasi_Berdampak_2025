<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use App\Models\Citizen; 

class CitizenController extends Controller
{
    /**
     * Fungsi untuk menyimpan data warga baru (POST /api/citizens)
     */
    public function store(Request $request)
    {
        // Ambil semua data JSON yang dikirim dari Postman
        $data = $request->json()->all();

        // Simpan data ke MongoDB menggunakan helper 'collection()' di Model
        $result = Citizen::collection()->insertOne($data);

        // Kirim balasan sukses
        return response()->json([
            'message' => 'Citizen created successfully',
            'inserted_id' => (string)$result->getInsertedId() // Tampilkan ID baru
        ], 201); // 201 = Created
    }

    /**
     * Fungsi untuk mengambil semua data warga (GET /api/citizens)
     */
    public function index()
    {
        // Ambil semua data dari collection 'citizens'
        $citizensCursor = Citizen::collection()->find([]);
        
        // Ubah hasil (cursor) menjadi array agar bisa dibaca
        $citizensArray = iterator_to_array($citizensCursor);

        // Kirim balasan
        return response()->json($citizensArray);
    }
}