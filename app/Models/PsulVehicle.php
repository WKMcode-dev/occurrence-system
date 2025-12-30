<?php
// app/Models/PsulVehicle.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PsulVehicle extends Model
{
    use HasFactory;

    protected $fillable = ['number'];

    public function occurrences()
    {
        return $this->hasMany(Occurrence::class);
    }
}