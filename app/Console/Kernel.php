<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedules = \App\Models\PythonSchedule::all();

        foreach ($schedules as $task) {
            $command = sprintf(
                'cd %s && python3 %s %s',
                public_path(), // カレントディレクトリを public に設定
                escapeshellarg(storage_path('app/py/' . $task->filename)), // Python ファイルのパス
                implode(' ', array_map('escapeshellarg', $task->parameters)) // パラメータをエスケープ
            );

            $schedule->exec($command)
                ->cron($task->cron_expression);
        }
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
