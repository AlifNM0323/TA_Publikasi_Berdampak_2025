<?php

namespace App\Models;

use MongoDB\Client;

class Citizen
{
    /**
     * Fungsi helper untuk mengakses collection 'citizens'
     */
    public static function collection()
    {
        // 'mongodb' adalah alias yang kita buat di MongoServiceProvider
        $client = app('mongodb'); 

        // 'db_admin' adalah nama DB dari .env, 'citizens' adalah nama collection
        return $client->selectCollection(env('DB_DATABASE'), 'citizens');
    }
}