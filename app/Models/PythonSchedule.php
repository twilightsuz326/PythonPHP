<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PythonSchedule extends Model
{
    use HasFactory;

    protected $fillable = ['filename', 'parameters', 'cron_expression'];

    protected $casts = [
        'parameters' => 'array', // JSON形式を配列にキャスト
    ];
}
