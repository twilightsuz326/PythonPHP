<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedules = \App\Models\PythonSchedule::all();
        $pythonService = app(\App\Services\PythonExecutionService::class);

        foreach ($schedules as $task) {
            $schedule->call(function () use ($task, $pythonService) {
                try {
                    $output = $pythonService->executeFromFile($task->filename, $task->parameters);
                    Log::info('Python script succeeded. File: ' . $task->filename . ' Output: ' . $output);
                } catch (\Exception $e) {
                    Log::error('Python script failed. File: ' . $task->filename . ' Error: ' . $e->getMessage());
                }
            })->cron($task->cron_expression);
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
