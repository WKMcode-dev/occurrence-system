<?php
// app/Models/Occurrence.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occurrence extends Model
{
    use HasFactory;

    protected $fillable = [
        'taguatinga_vehicle_id',
        'psul_vehicle_id',
        'created_by',
        'occurrence_date',
        'occurrence_time',
        'description',
        'done',
        'delivered',
        'expires_at',
    ];

    // Relacionamento com veículos de Taguatinga
    public function taguatingaVehicle()
    {
        return $this->belongsTo(TaguatingaVehicle::class);
    }

    // Relacionamento com veículos do P-Sul
    public function psulVehicle()
    {
        return $this->belongsTo(PsulVehicle::class);
    }

    // Relacionamento com usuário criador
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}