<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OccurrenceController;

// Tela inicial = login
Route::get('/', [AuthController::class, 'showLoginForm']);  

// Rotas de autenticação
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rotas protegidas
Route::middleware('auth')->group(function () {
    // Página principal (HTML)
    Route::get('/occurrences', [OccurrenceController::class, 'index'])->name('occurrences.index');

    // API JSON para o JS
    Route::prefix('api')->group(function () {
        Route::get('/occurrences', [OccurrenceController::class, 'listJson']);
        Route::post('/occurrences', [OccurrenceController::class, 'store']);
        Route::get('/occurrences/{id}', [OccurrenceController::class, 'show']);
        Route::put('/occurrences/{id}', [OccurrenceController::class, 'update']);
        Route::delete('/occurrences/{id}', [OccurrenceController::class, 'destroy']);
        Route::patch('/occurrences/{id}/toggle', [OccurrenceController::class, 'toggle']);
    });
});