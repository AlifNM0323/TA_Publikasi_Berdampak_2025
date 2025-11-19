<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use MongoDB\Client; // <-- Memanggil SDK murni yang kita instal

class MongoServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Kita buat satu koneksi saja (singleton) untuk seluruh aplikasi
        $this->app->singleton(Client::class, function ($app) {
            
            // Menggunakan variabel dari file .env yang kita isi tadi
            $host = env('DB_HOST', '127.0.0.1'); 
            $port = env('DB_PORT', 27017);

            // Ini adalah alamat koneksi ke MongoDB di Docker
            $uri = "mongodb://{$host}:{$port}";
            
            // Ini adalah koneksi manual menggunakan SDK murni
            return new Client($uri); 
        });

        // Buat alias (nama panggilan) agar mudah dipanggil
        $this->app->alias(Client::class, 'mongodb');
    }
}