<?php
// database/migrations/0001_01_01_000003_create_frotas_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Tabela da frota de Taguatinga
        Schema::create('taguatinga_vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique(); // número do veículo
            $table->timestamps();
        });

        // Tabela da frota do P-Sul
        Schema::create('psul_vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique(); // número do veículo
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('taguatinga_vehicles');
        Schema::dropIfExists('psul_vehicles');
    }
};