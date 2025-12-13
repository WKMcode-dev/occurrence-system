<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $fillable = [
        'username',
        'password',
        'role',
    ];

    /**
     * Campos que devem ficar ocultos nas respostas JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversões de tipos automáticas
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    /**
     * Relacionamento: um usuário pode ter várias ocorrências criadas
     */
    public function occurrences()
    {
        return $this->hasMany(Occurrence::class, 'created_by');
    }
}