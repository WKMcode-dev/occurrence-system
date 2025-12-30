<?php
// database/migrations/0001_01_01_000004_create_occurrences_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('occurrences', function (Blueprint $table) {
            $table->id();

            // Relacionamento com veículos de Taguatinga
            $table->foreignId('taguatinga_vehicle_id')
                  ->nullable()
                  ->constrained('taguatinga_vehicles')
                  ->onDelete('cascade');

            // Relacionamento com veículos do P-Sul
            $table->foreignId('psul_vehicle_id')
                  ->nullable()
                  ->constrained('psul_vehicles')
                  ->onDelete('cascade');

            // Relacionamento com usuário que criou
            $table->foreignId('created_by')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Campos principais
            $table->date('occurrence_date');     // data da ocorrência
            $table->time('occurrence_time');     // horário da ocorrência
            $table->text('description');         // descrição

            // Status concluído/não concluído
            $table->boolean('done')->default(false);

            // Status entregue (TI Noite usa esse campo)
            $table->boolean('delivered')->default(false);

            // Data de expiração (para exclusão temporária)
            $table->dateTime('expires_at')->nullable();

            // created_at e updated_at
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('occurrences');
    }
};