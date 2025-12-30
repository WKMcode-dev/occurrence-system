<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Occurrence;

use Carbon\Carbon;

Carbon::setTestNow(Carbon::create(2026, 1, 26));

class Kernel extends ConsoleKernel
{
    /**
     * Definição dos comandos Artisan customizados.
     */
    protected $commands = [
        //
    ];

    /**
     * Agenda de tarefas automáticas.
     */
    protected function schedule(Schedule $schedule)
    {
        // Executa diariamente a limpeza de ocorrências expiradas
        $schedule->call(function () {
            Occurrence::where('done', true)
                ->whereNotNull('expires_at')
                ->where('expires_at', '<=', now())
                ->delete();
        })->everyMinute();
    }

    /**
     * Registra os comandos para o Artisan.
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
