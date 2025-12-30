<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        // Frota Taguatinga
        $taguatingaFile = database_path('seeders/data/frota_taguatinga.csv');
        if (file_exists($taguatingaFile)) {
            $rows = array_map('str_getcsv', file($taguatingaFile));
            $vehicles = [];
            foreach ($rows as $row) {
                if (!empty($row[0]) && is_numeric($row[0])) {
                    $vehicles[] = ['number' => trim($row[0])];
                }
            }
            if (!empty($vehicles)) {
                DB::table('taguatinga_vehicles')->insert($vehicles);
            }
        }

        // Frota P-Sul
        $psulFile = database_path('seeders/data/frota_psul.csv');
        if (file_exists($psulFile)) {
            $rows = array_map('str_getcsv', file($psulFile));
            $vehicles = [];
            foreach ($rows as $row) {
                if (!empty($row[0]) && is_numeric($row[0])) {
                    $vehicles[] = ['number' => trim($row[0])];
                }
            }
            if (!empty($vehicles)) {
                DB::table('psul_vehicles')->insert($vehicles);
            }
        }
    }
}