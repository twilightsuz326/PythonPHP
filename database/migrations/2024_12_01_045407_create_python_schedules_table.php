<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePythonSchedulesTable extends Migration
{
    public function up()
    {
        Schema::create('python_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('filename'); // 実行するPythonファイル名
            $table->json('parameters')->nullable(); // 実行時のパラメータ
            $table->string('cron_expression'); // Cron形式のスケジュール設定
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('python_schedules');
    }
}
