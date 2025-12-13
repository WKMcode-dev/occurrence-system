<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['number' => '440028'],
            ['number' => '448645'],
            ['number' => '449001'],
            // ...adicionar o resto dos veículos
        ];

        Vehicle::insert($vehicles);
    }
}