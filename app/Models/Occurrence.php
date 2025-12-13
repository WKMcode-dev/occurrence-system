<?php
// app/Models/Occurrence.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Vehicle; // <-- importa o model Vehicle

class Occurrence extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'created_by',
        'occurrence_date',
        'occurrence_time',
        'description',
        'done',
        'delivered',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}