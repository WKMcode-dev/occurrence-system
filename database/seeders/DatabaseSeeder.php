<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Cria usuário de teste (não duplica se já existir)
        User::firstOrCreate(
            ['username' => 'testuser'],
            [
                'password' => bcrypt('secret'),
                'role' => 'Gestor',
            ]
        );

        // Chama o seeder de veículos
        $this->call(VehicleSeeder::class);
    }
}