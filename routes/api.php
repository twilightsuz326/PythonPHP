<?php

use App\Http\Controllers\PythonExecutionController;
use App\Http\Controllers\PythonFileController;
use App\Http\Controllers\PythonScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

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

Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $request->session()->regenerate();
    return response()->json(['user' => Auth::user()]);
});

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
Route::post('/execute-python', [PythonExecutionController::class, 'executePythonFile'])->middleware('auth:sanctum');
Route::apiResource('/python-schedules', PythonScheduleController::class)->middleware('auth:sanctum');