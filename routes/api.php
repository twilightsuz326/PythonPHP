<?php

use App\Http\Controllers\PythonExecutionController;
use App\Http\Controllers\PythonFileController;
use App\Http\Controllers\PythonScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/login', [AuthController::class, 'login']);


Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['message' => 'Logged out']);
});

Route::get('/user', function (Request $request) {
    return response()->json($request->user());
})->middleware('auth:sanctum');

Route::post('/save-python', [PythonFileController::class, 'savePythonCode'])->middleware('auth:sanctum');
Route::get('/python-files', [PythonFileController::class, 'listPythonFiles'])->middleware('auth:sanctum');
Route::get('/python-files/{file}', [PythonFileController::class, 'getFile'])->middleware('auth:sanctum');
Route::post('/execute-python', [PythonExecutionController::class, 'executePythonFile'])->middleware('auth:sanctum');
Route::apiResource('/python-schedules', PythonScheduleController::class)->middleware('auth:sanctum');